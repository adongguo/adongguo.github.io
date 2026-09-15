import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { after, before, describe, it } from 'node:test'

import {
  BUILTIN_RULES,
  ConfigError,
  collectFiles,
  isPublicIPv4,
  loadDenylist,
  parseDenylist,
  run,
  scanText,
} from './check-public.mjs'

async function writeTree(root, files) {
  for (const [relative, content] of Object.entries(files)) {
    const target = path.join(root, relative)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, content)
  }
}

describe('parseDenylist', () => {
  it('reads rules, case-insensitive rules and allow entries, skipping comments', () => {
    const { rules, allow } = parseDenylist('# comment\n\nsecret-name\ni:Hidden\nallow:~/.config/hidden/config\n')
    assert.deepEqual(rules.map((rule) => rule.id), ['denylist-3', 'denylist-4'])
    assert.ok(rules[0].pattern.test('a secret-name here'))
    assert.ok(!rules[0].pattern.test('SECRET-NAME'))
    assert.ok(rules[1].pattern.test('HIDDEN'))
    assert.deepEqual(allow, ['~/.config/hidden/config'])
  })

  it('reports the line of an invalid expression without echoing it', () => {
    assert.throws(
      () => parseDenylist('ok\n(unclosed'),
      (error) => error instanceof ConfigError && /line 2: invalid regular expression/.test(error.message)
        && !error.message.includes('unclosed'),
    )
  })

  it('rejects empty allow entries', () => {
    assert.throws(() => parseDenylist('rule\nallow:'), /line 2: empty allow entry/)
  })

  it('rejects a denylist without rules', () => {
    assert.throws(() => parseDenylist('# only comments\nallow:x\n'), /no rules/)
  })
})

describe('loadDenylist', () => {
  it('prefers the PUBLIC_DENYLIST variable', async () => {
    const reader = async () => assert.fail('file should not be read')
    const { rules } = await loadDenylist({ PUBLIC_DENYLIST: 'from-env', PUBLIC_DENYLIST_FILE: '/x' }, reader)
    assert.ok(rules[0].pattern.test('from-env'))
  })

  it('falls back to PUBLIC_DENYLIST_FILE when the variable is blank', async () => {
    const reader = async (file) => {
      assert.equal(file, '/tmp/denylist.txt')
      return 'from-file'
    }
    const { rules } = await loadDenylist({ PUBLIC_DENYLIST: '  ', PUBLIC_DENYLIST_FILE: '/tmp/denylist.txt' }, reader)
    assert.ok(rules[0].pattern.test('from-file'))
  })

  it('uses the file system reader by default', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'check-public-denylist-'))
    try {
      const file = path.join(dir, 'denylist.txt')
      await writeFile(file, 'on-disk\n')
      const { rules } = await loadDenylist({ PUBLIC_DENYLIST_FILE: file })
      assert.ok(rules[0].pattern.test('on-disk'))
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('turns an unreadable file into a configuration error', async () => {
    const reader = async () => {
      throw new Error('ENOENT')
    }
    await assert.rejects(loadDenylist({ PUBLIC_DENYLIST_FILE: '/missing' }, reader), /cannot be read/)
  })

  it('fails when no denylist source is configured', async () => {
    await assert.rejects(loadDenylist({}), (error) => error instanceof ConfigError && /set PUBLIC_DENYLIST/.test(error.message))
  })
})

describe('isPublicIPv4', () => {
  it('accepts public addresses, including neighbours of reserved ranges', () => {
    for (const address of ['8.8.8.8', '101.1.2.3', '172.15.0.1', '172.32.0.1', '100.63.0.1', '100.128.0.1', '192.0.1.1', '198.20.0.1', '223.255.255.255']) {
      assert.equal(isPublicIPv4(address), true, address)
    }
  })

  it('rejects private, loopback, shared, link-local, documentation, benchmark and multicast ranges', () => {
    for (const address of ['0.0.0.0', '10.1.2.3', '127.0.0.1', '100.64.0.1', '100.127.255.255', '169.254.1.1', '172.16.0.1', '172.31.255.255', '192.168.1.1', '192.0.0.8', '192.0.2.1', '198.18.0.1', '198.19.255.255', '198.51.100.7', '203.0.113.9', '224.0.0.1', '255.255.255.255']) {
      assert.equal(isPublicIPv4(address), false, address)
    }
  })

  it('rejects malformed candidates', () => {
    for (const candidate of ['256.1.1.1', '1.2.3', '1.2.3.4.5', 'a.b.c.d', '1.2.3.1000']) {
      assert.equal(isPublicIPv4(candidate), false, candidate)
    }
  })
})

describe('scanText', () => {
  const rules = [...BUILTIN_RULES, { id: 'denylist-1', pattern: /hidden-name/iu }]

  it('reports rule ids with line numbers', () => {
    const text = 'clean line\nsee /Users/someone/project\nHidden-Name appears\n-----BEGIN RSA PRIVATE KEY-----'
    assert.deepEqual(scanText(text, rules, []), [
      { line: 2, rule: 'local-home-path' },
      { line: 3, rule: 'denylist-1' },
      { line: 4, rule: 'private-key' },
    ])
  })

  it('ignores allowed literals but still flags other occurrences', () => {
    const text = 'path ~/.config/hidden-name/config\nhidden-name elsewhere'
    assert.deepEqual(scanText(text, rules, ['~/.config/hidden-name/config']), [{ line: 2, rule: 'denylist-1' }])
  })

  it('flags a public IPv4 address once per line and ignores private ones', () => {
    const text = 'hosts 8.8.8.8 and 1.1.1.1\nlocal 127.0.0.1 and 192.168.0.1\nversion 1.2.3'
    assert.deepEqual(scanText(text, rules, []), [{ line: 1, rule: 'public-ipv4' }])
  })

  it('detects common token formats', () => {
    const text = [
      `ghp_${'a'.repeat(36)}`,
      `AKIA${'A'.repeat(16)}`,
      `LTAI${'b'.repeat(16)}`,
      `sk-${'c'.repeat(24)}`,
      'xoxb-1234567890-abcdef',
    ].join('\n')
    assert.deepEqual(scanText(text, rules, []).map((finding) => finding.rule), [
      'github-token',
      'aws-access-key',
      'cloud-access-key',
      'api-secret-key',
      'slack-token',
    ])
  })
})

describe('collectFiles', () => {
  let root
  let external

  before(async () => {
    root = await mkdtemp(path.join(tmpdir(), 'check-public-tree-'))
    external = await mkdtemp(path.join(tmpdir(), 'check-public-external-'))
    await writeTree(external, { 'leak.md': 'outside file', 'section/page.md': 'outside dir' })
    await writeTree(root, {
      'index.md': '# home',
      'zmux/guide/index.md': '# guide',
      'public/logo.svg': '<svg/>',
      'public/icon.png': 'binary',
      '.vitepress/config.mts': 'export default {}',
      '.vitepress/cache/deps/x.js': 'cache',
      '.vitepress/dist/index.html': '<html></html>',
      '.vitepress/dist/assets/app.js': 'js',
      '.vitepress/dist/assets/chunks/@localSearchIndexroot.abc123.js': 'terms',
      '.vitepress/dist/assets/chunks/page.abc123.js': 'page chunk',
      '.vitepress/dist/logo.png': 'binary',
      '_posts/2024-01-01-edition.md': 'legacy',
      'SoC-2026-Ideas.md': 'legacy',
      'node_modules/pkg/readme.md': 'dependency',
      'scripts/tool.mjs': 'tooling',
      '.github/workflows/deploy.yml': 'ci',
      'package-lock.json': '{}',
      'package.json': '{}',
    })
    await symlink(path.join(external, 'leak.md'), path.join(root, 'linked.md'))
    await symlink(path.join(external, 'section'), path.join(root, 'docs-link'))
    await symlink(path.join(root, 'zmux'), path.join(root, 'zmux/guide/loop'))
    await symlink(path.join(external, 'missing.md'), path.join(root, 'broken.md'))
  })

  after(async () => {
    await rm(root, { recursive: true, force: true })
    await rm(external, { recursive: true, force: true })
  })

  it('lists served sources and skips tooling, caches, legacy pages and binaries', async () => {
    assert.deepEqual(await collectFiles(root), [
      '.vitepress/config.mts',
      'docs-link/page.md',
      'index.md',
      'linked.md',
      'package.json',
      'public/logo.svg',
      'zmux/guide/index.md',
    ])
  })

  it('lists text files of the built site in dist mode, skipping the tokenized search index', async () => {
    assert.deepEqual(await collectFiles(root, { dist: true }), [
      'assets/app.js',
      'assets/chunks/page.abc123.js',
      'index.html',
    ])
  })

  it('fails with a configuration error when the build output is missing', async () => {
    const empty = await mkdtemp(path.join(tmpdir(), 'check-public-empty-'))
    try {
      await assert.rejects(collectFiles(empty, { dist: true }), (error) => error instanceof ConfigError)
    } finally {
      await rm(empty, { recursive: true, force: true })
    }
  })

  it('propagates unexpected file system errors', async () => {
    await assert.rejects(collectFiles(path.join(root, 'index.md')), (error) => !(error instanceof ConfigError))
  })
})

describe('run', () => {
  let root

  before(async () => {
    root = await mkdtemp(path.join(tmpdir(), 'check-public-run-'))
  })

  after(async () => {
    await rm(root, { recursive: true, force: true })
  })

  it('returns 2 and names the missing configuration', async () => {
    const lines = []
    const code = await run({ root, env: {}, log: (line) => lines.push(line) })
    assert.equal(code, 2)
    assert.match(lines.join('\n'), /configuration error: set PUBLIC_DENYLIST/)
  })

  it('returns 1 and reports locations without the rule or the matched text', async () => {
    await writeTree(root, { 'index.md': 'intro\nthe hidden-name leaks here\n' })
    const lines = []
    const code = await run({ root, env: { PUBLIC_DENYLIST: 'hidden-name' }, log: (line) => lines.push(line) })
    assert.equal(code, 1)
    assert.deepEqual(lines, ['index.md:2 rule=denylist-1', 'check-public: 1 finding(s) in site sources'])
  })

  it('returns 0 when the sources are clean', async () => {
    await writeTree(root, { 'index.md': 'intro\nnothing to see\n' })
    const lines = []
    const code = await run({ root, env: { PUBLIC_DENYLIST: 'hidden-name' }, log: (line) => lines.push(line) })
    assert.equal(code, 0)
    assert.deepEqual(lines, ['check-public: 1 file(s) in site sources passed'])
  })

  it('prefixes built-site findings with the output directory', async () => {
    await writeTree(root, { '.vitepress/dist/index.html': '<p>hidden-name</p>' })
    const lines = []
    const code = await run({ root, env: { PUBLIC_DENYLIST: 'hidden-name' }, dist: true, log: (line) => lines.push(line) })
    assert.equal(code, 1)
    assert.equal(lines[0], '.vitepress/dist/index.html:1 rule=denylist-1')
  })

  it('reports a missing build output as a configuration error', async () => {
    const empty = await mkdtemp(path.join(tmpdir(), 'check-public-nodist-'))
    try {
      const lines = []
      const code = await run({ root: empty, env: { PUBLIC_DENYLIST: 'x' }, dist: true, log: (line) => lines.push(line) })
      assert.equal(code, 2)
      assert.match(lines[0], /build output not found/)
    } finally {
      await rm(empty, { recursive: true, force: true })
    }
  })
})
