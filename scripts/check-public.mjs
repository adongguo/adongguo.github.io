#!/usr/bin/env node
// Blocks publication of site content that must stay private.
//
// Rules that would themselves reveal what is being kept private are not stored
// in this public repository. They are read from the PUBLIC_DENYLIST environment
// variable (CI secret) or the file named by PUBLIC_DENYLIST_FILE. Findings are
// reported as file, line and rule id only, never the rule or the matched text,
// so CI logs do not leak either.
//
// Exit codes: 0 clean, 1 findings, 2 configuration error.

import { readdir, readFile, realpath, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { LEGACY_EXCLUDES, isExcluded } from '../.vitepress/lib/site.mjs'

export class ConfigError extends Error {}

/**
 * Generic rules that are safe to publish: they describe classes of secrets,
 * not any particular private name.
 */
export const BUILTIN_RULES = Object.freeze([
  { id: 'local-home-path', pattern: /(?:\/Users|\/home)\/[A-Za-z0-9._-]+\// },
  { id: 'private-key', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { id: 'github-token', pattern: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/ },
  { id: 'aws-access-key', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { id: 'cloud-access-key', pattern: /\bLTAI[0-9A-Za-z]{12,}\b/ },
  { id: 'api-secret-key', pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/ },
  { id: 'slack-token', pattern: /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/ },
])

const IPV4_PATTERN = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g

const SOURCE_EXTENSIONS = new Set([
  '.md', '.mts', '.ts', '.mjs', '.js', '.vue', '.css', '.svg', '.txt', '.html', '.json', '.yml', '.yaml',
])
const DIST_EXTENSIONS = new Set(['.html', '.js', '.css', '.json', '.xml', '.txt', '.svg'])

// Tooling and history that is never served as site content.
const SOURCE_SKIP_DIRS = new Set([
  '.git', '.github', '.idea', 'node_modules', 'scripts', 'script', 'coverage',
])
const SOURCE_SKIP_PATHS = new Set(['.vitepress/cache', '.vitepress/dist'])
const SOURCE_SKIP_FILES = new Set(['package-lock.json'])
// The local search index stores page text split into terms, which breaks
// allowed literals apart. Every term comes from a page that is scanned as HTML.
const DIST_SKIP_FILE = /^assets\/chunks\/@localSearchIndex[^/]*\.js$/

/**
 * Parses a denylist: one regular expression per line, `i:` prefix for a
 * case-insensitive rule, `allow:` prefix for a literal that is always
 * permitted, `#` for comments.
 *
 * @param {string} text
 */
export function parseDenylist(text) {
  const rules = []
  const allow = []
  const lines = text.split(/\r?\n/)
  lines.forEach((raw, index) => {
    const line = raw.trim()
    if (line === '' || line.startsWith('#')) return
    const lineNumber = index + 1
    if (line.startsWith('allow:')) {
      const literal = line.slice('allow:'.length)
      if (literal === '') throw new ConfigError(`denylist line ${lineNumber}: empty allow entry`)
      allow.push(literal)
      return
    }
    const caseInsensitive = line.startsWith('i:')
    const source = caseInsensitive ? line.slice(2) : line
    try {
      rules.push({ id: `denylist-${lineNumber}`, pattern: new RegExp(source, caseInsensitive ? 'iu' : 'u') })
    } catch {
      throw new ConfigError(`denylist line ${lineNumber}: invalid regular expression`)
    }
  })
  if (rules.length === 0) {
    throw new ConfigError('denylist has no rules')
  }
  return { rules, allow }
}

/**
 * @param {NodeJS.ProcessEnv} env
 * @param {(file: string) => Promise<string>} readText
 */
export async function loadDenylist(env, readText = (file) => readFile(file, 'utf8')) {
  if (env.PUBLIC_DENYLIST && env.PUBLIC_DENYLIST.trim() !== '') {
    return parseDenylist(env.PUBLIC_DENYLIST)
  }
  if (env.PUBLIC_DENYLIST_FILE) {
    let text
    try {
      text = await readText(env.PUBLIC_DENYLIST_FILE)
    } catch {
      throw new ConfigError('PUBLIC_DENYLIST_FILE cannot be read')
    }
    return parseDenylist(text)
  }
  throw new ConfigError('set PUBLIC_DENYLIST or PUBLIC_DENYLIST_FILE')
}

/**
 * True for addresses routable on the public internet; private, loopback,
 * link-local, shared, documentation, benchmark and multicast ranges are not.
 *
 * @param {string} candidate
 */
export function isPublicIPv4(candidate) {
  const parts = candidate.split('.')
  if (parts.length !== 4) return false
  const octets = parts.map((part) => Number(part))
  if (octets.some((octet, index) => !/^\d{1,3}$/.test(parts[index]) || octet > 255)) return false
  const [a, b, c] = octets
  if (a === 0 || a === 10 || a === 127 || a >= 224) return false
  if (a === 100 && b >= 64 && b <= 127) return false
  if (a === 169 && b === 254) return false
  if (a === 172 && b >= 16 && b <= 31) return false
  if (a === 192 && b === 168) return false
  if (a === 192 && b === 0 && (c === 0 || c === 2)) return false
  if (a === 198 && (b === 18 || b === 19)) return false
  if (a === 198 && b === 51 && c === 100) return false
  if (a === 203 && b === 0 && c === 113) return false
  return true
}

/**
 * @param {string} text
 * @param {{ id: string, pattern: RegExp }[]} rules
 * @param {string[]} allow
 * @returns {{ line: number, rule: string }[]}
 */
export function scanText(text, rules, allow) {
  const findings = []
  text.split(/\r?\n/).forEach((original, index) => {
    let line = original
    for (const literal of allow) {
      line = line.split(literal).join(' ')
    }
    for (const rule of rules) {
      if (rule.pattern.test(line)) findings.push({ line: index + 1, rule: rule.id })
    }
    for (const match of line.matchAll(IPV4_PATTERN)) {
      if (isPublicIPv4(match[0])) {
        findings.push({ line: index + 1, rule: 'public-ipv4' })
        break
      }
    }
  })
  return findings
}

/**
 * Lists the files that make up the served site: the VitePress sources, or the
 * built output when `dist` is set.
 *
 * @param {string} root repository root
 * @param {{ dist?: boolean }} options
 * @returns {Promise<string[]>} POSIX paths relative to the scanned directory
 */
export async function collectFiles(root, { dist = false } = {}) {
  const base = dist ? path.join(root, '.vitepress', 'dist') : root
  const extensions = dist ? DIST_EXTENSIONS : SOURCE_EXTENSIONS
  const files = []
  // Symbolic links are followed like the site build follows them, so a link
  // cannot smuggle content past the check; visited real paths stop cycles.
  const visited = new Set()

  async function walk(directory, relative) {
    const real = await realpath(directory)
    if (visited.has(real)) return
    visited.add(real)

    const entries = await readdir(directory, { withFileTypes: true })
    for (const entry of entries) {
      const entryRelative = relative ? `${relative}/${entry.name}` : entry.name
      const entryPath = path.join(directory, entry.name)
      let isDirectory = entry.isDirectory()
      let isFile = entry.isFile()
      if (entry.isSymbolicLink()) {
        const target = await stat(entryPath).catch(() => null)
        if (!target) continue
        isDirectory = target.isDirectory()
        isFile = target.isFile()
      }
      if (isDirectory) {
        if (!dist && (SOURCE_SKIP_DIRS.has(entry.name) || SOURCE_SKIP_PATHS.has(entryRelative))) continue
        await walk(entryPath, entryRelative)
      } else if (isFile && extensions.has(path.extname(entry.name))) {
        if (dist && DIST_SKIP_FILE.test(entryRelative)) continue
        if (!dist && (SOURCE_SKIP_FILES.has(entryRelative) || isExcluded(entryRelative, LEGACY_EXCLUDES))) continue
        files.push(entryRelative)
      }
    }
  }

  try {
    await walk(base, '')
  } catch (error) {
    if (dist && error.code === 'ENOENT') throw new ConfigError('build output not found; run docs:build first')
    throw error
  }
  return files.sort()
}

/**
 * @param {{ root: string, env: NodeJS.ProcessEnv, dist?: boolean, log: (line: string) => void }} options
 * @returns {Promise<number>} exit code
 */
export async function run({ root, env, dist = false, log }) {
  let denylist
  let files
  try {
    denylist = await loadDenylist(env)
    files = await collectFiles(root, { dist })
  } catch (error) {
    if (error instanceof ConfigError) {
      log(`check-public: configuration error: ${error.message}`)
      return 2
    }
    throw error
  }

  const base = dist ? path.join(root, '.vitepress', 'dist') : root
  const rules = [...BUILTIN_RULES, ...denylist.rules]
  let findingCount = 0
  for (const file of files) {
    const text = await readFile(path.join(base, file), 'utf8')
    for (const finding of scanText(text, rules, denylist.allow)) {
      log(`${dist ? '.vitepress/dist/' : ''}${file}:${finding.line} rule=${finding.rule}`)
      findingCount += 1
    }
  }

  const scope = dist ? 'built site' : 'site sources'
  if (findingCount > 0) {
    log(`check-public: ${findingCount} finding(s) in ${scope}`)
    return 1
  }
  log(`check-public: ${files.length} file(s) in ${scope} passed`)
  return 0
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invokedDirectly) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const code = await run({
    root,
    env: process.env,
    dist: process.argv.includes('--dist'),
    log: (line) => console.log(line),
  })
  process.exitCode = code
}
