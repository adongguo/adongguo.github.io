import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { products as registry } from '../products.mjs'
import {
  LEGACY_EXCLUDES,
  buildNav,
  globToRegExp,
  isExcluded,
  productDocsNavItems,
  productNavItems,
  productSidebars,
  siteExcludes,
  sitemapItems,
  validateProducts,
  visibleProducts,
} from './site.mjs'

function product(overrides = {}) {
  const slug = overrides.slug ?? 'alpha'
  return {
    slug,
    name: 'Alpha',
    tagline: 'first product',
    visible: true,
    sidebar: [
      {
        text: 'Start',
        items: [
          { text: 'Intro', link: `/${slug}/guide/` },
          { text: 'Install', link: `/${slug}/guide/install` },
        ],
      },
    ],
    ...overrides,
  }
}

describe('validateProducts', () => {
  it('accepts a well-formed registry and returns it', () => {
    const list = [product(), product({ slug: 'beta', visible: false })]
    assert.equal(validateProducts(list), list)
  })

  it('accepts the real product registry', () => {
    assert.doesNotThrow(() => validateProducts(registry))
  })

  it('rejects a non-array registry', () => {
    assert.throws(() => validateProducts({}), TypeError)
  })

  it('rejects slugs that are not lowercase path segments', () => {
    assert.throws(() => validateProducts([product({ slug: 'Bad Slug' })]), /invalid product slug/)
    assert.throws(() => validateProducts([{ ...product(), slug: undefined }]), /invalid product slug/)
  })

  it('rejects duplicate slugs', () => {
    assert.throws(() => validateProducts([product(), product()]), /duplicate product slug: alpha/)
  })

  it('requires an explicit boolean visibility flag', () => {
    assert.throws(() => validateProducts([product({ visible: 'yes' })]), /must set visible/)
  })

  it('requires a name and a tagline', () => {
    assert.throws(() => validateProducts([product({ name: '' })]), /needs a name and a tagline/)
    assert.throws(() => validateProducts([product({ tagline: '' })]), /needs a name and a tagline/)
  })

  it('requires at least one non-empty sidebar group', () => {
    assert.throws(() => validateProducts([product({ sidebar: [] })]), /at least one sidebar group/)
    assert.throws(
      () => validateProducts([product({ sidebar: [{ text: 'Empty', items: [] }] })]),
      /empty sidebar group: Empty/,
    )
  })

  it('rejects sidebar links outside the product prefix', () => {
    const stray = product({ sidebar: [{ text: 'Start', items: [{ text: 'Other', link: '/beta/guide/' }] }] })
    assert.throws(() => validateProducts([stray]), /links outside \/alpha\//)
  })
})

describe('navigation helpers', () => {
  const list = [product(), product({ slug: 'hidden', name: 'Hidden', visible: false })]

  it('keeps only visible products', () => {
    assert.deepEqual(visibleProducts(list).map((item) => item.slug), ['alpha'])
  })

  it('links product nav items to each landing page', () => {
    assert.deepEqual(productNavItems(list), [{ text: 'Alpha', link: '/alpha/' }])
  })

  it('links docs nav items to the first sidebar page', () => {
    assert.deepEqual(productDocsNavItems(list), [{ text: 'Alpha', link: '/alpha/guide/' }])
  })

  it('builds the top navigation with product and docs menus for visible products', () => {
    const nav = buildNav(list)
    assert.deepEqual(nav.map((entry) => entry.text), ['首页', '产品', '文档', '博客', '关于'])
    assert.deepEqual(nav[1].items, [
      { text: '全部产品', link: '/products/' },
      { text: 'Alpha', link: '/alpha/' },
    ])
    assert.deepEqual(nav[2].items, [{ text: 'Alpha', link: '/alpha/guide/' }])
    assert.ok(nav[4].items.some((item) => item.link === '/trust/'))
  })

  it('omits the docs menu while no product is visible', () => {
    const nav = buildNav([product({ visible: false })])
    assert.deepEqual(nav.map((entry) => entry.text), ['首页', '产品', '博客', '关于'])
    assert.deepEqual(nav[1].items, [{ text: '全部产品', link: '/products/' }])
  })

  it('keys sidebars by product prefix for visible products only', () => {
    const sidebars = productSidebars(list)
    assert.deepEqual(Object.keys(sidebars), ['/alpha/'])
    assert.equal(sidebars['/alpha/'], list[0].sidebar)
  })
})

describe('siteExcludes', () => {
  it('excludes legacy pages and every hidden product directory', () => {
    const list = [product(), product({ slug: 'beta', visible: false })]
    assert.deepEqual(siteExcludes(list), [...LEGACY_EXCLUDES, 'beta/**'])
  })

  it('excludes only legacy pages when every product is visible', () => {
    assert.deepEqual(siteExcludes([product()]), [...LEGACY_EXCLUDES])
  })
})

describe('sitemapItems', () => {
  it('drops redirect pages and keeps real pages', () => {
    const items = [{ url: '' }, { url: 'projects/' }, { url: 'products/' }]
    assert.deepEqual(sitemapItems(items), [{ url: '' }, { url: 'products/' }])
  })
})

describe('globToRegExp and isExcluded', () => {
  it('matches double-star globs across directories', () => {
    assert.ok(globToRegExp('_posts/**').test('_posts/2024/edition.markdown'))
    assert.ok(!globToRegExp('_posts/**').test('blog/_posts/x.md'))
  })

  it('keeps single-star globs within one path segment', () => {
    assert.ok(globToRegExp('SoC-*.md').test('SoC-2026-Ideas.md'))
    assert.ok(!globToRegExp('SoC-*.md').test('docs/SoC-2026-Ideas.md'))
  })

  it('escapes regular expression metacharacters', () => {
    assert.ok(globToRegExp('a.b').test('a.b'))
    assert.ok(!globToRegExp('a.b').test('aXb'))
    assert.ok(globToRegExp('(x)+[y]').test('(x)+[y]'))
  })

  it('reports whether a path matches any glob', () => {
    assert.ok(isExcluded('GSoC-Participants.md', LEGACY_EXCLUDES))
    assert.ok(!isExcluded('zmux/guide/index.md', LEGACY_EXCLUDES))
  })
})
