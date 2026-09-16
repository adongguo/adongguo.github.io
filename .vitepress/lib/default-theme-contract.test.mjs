// The home hero override depends on internals of the VitePress default theme:
// VPHome imports ./VPHomeHero.vue, which config.mts replaces through a Vite
// alias, and VPHero decides whether to render its image column from the
// 'hero-image-slot-exists' injection. A theme upgrade that changes either would
// still build but silently drop the home hero visual, so fail here instead.

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const components = path.join(
  path.dirname(require.resolve('vitepress/package.json')),
  'dist/client/theme-default/components',
)
const override = fileURLToPath(new URL('../theme/components/HomeHero.vue', import.meta.url))

const read = (file) => readFile(file, 'utf8')
const slotNames = (source) =>
  new Set([...source.matchAll(/<slot\b[^>]*\bname="([^"]+)"/g)].map((match) => match[1]))

describe('default theme contract for the home hero override', () => {
  it('still renders the home hero through a separate VPHomeHero component', async () => {
    const home = await read(path.join(components, 'VPHome.vue'))
    assert.match(home, /import VPHomeHero from '\.\/VPHomeHero\.vue'/)
  })

  it('still gates the hero image column on the injected slot flag', async () => {
    const hero = await read(path.join(components, 'VPHero.vue'))
    assert.match(hero, /inject\('hero-image-slot-exists'\)/)
    assert.match(hero, /<slot name="home-hero-image">/)
  })

  it('forwards every slot the default VPHomeHero forwards', async () => {
    const original = slotNames(await read(path.join(components, 'VPHomeHero.vue')))
    const replacement = slotNames(await read(override))
    assert.ok(original.size > 0)
    assert.deepEqual(replacement, original)
  })
})
