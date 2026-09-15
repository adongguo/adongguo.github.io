// Site structure helpers shared by the VitePress config and the public content
// check. Plain ESM with no dependencies so node:test can exercise them directly.

/**
 * @typedef {{ text: string, link: string }} SidebarItem
 * @typedef {{ text: string, items: SidebarItem[] }} SidebarGroup
 * @typedef {{
 *   slug: string,
 *   name: string,
 *   tagline: string,
 *   visible: boolean,
 *   sidebar: SidebarGroup[],
 * }} Product
 */

/**
 * Pages inherited from the old Jekyll site. They stay in the repository as
 * history but must never be built, indexed or treated as site content.
 */
export const LEGACY_EXCLUDES = Object.freeze([
  '_posts/**',
  'SoC-*.md',
  'GSoC-*.md',
  'Outreachy-*.md',
])

/** Pages that only redirect elsewhere and must stay out of the sitemap. */
export const REDIRECT_PAGES = Object.freeze({
  'projects/': '/products/',
})

const SLUG_PATTERN = /^[a-z][a-z0-9-]*$/

/**
 * Fails fast on registry mistakes that would otherwise publish a page by
 * accident (a typo in a hidden slug) or break navigation silently.
 *
 * @param {Product[]} products
 */
export function validateProducts(products) {
  if (!Array.isArray(products)) {
    throw new TypeError('products must be an array')
  }
  const seen = new Set()
  for (const product of products) {
    if (!SLUG_PATTERN.test(product?.slug ?? '')) {
      throw new Error(`invalid product slug: ${JSON.stringify(product?.slug)}`)
    }
    if (seen.has(product.slug)) {
      throw new Error(`duplicate product slug: ${product.slug}`)
    }
    seen.add(product.slug)
    if (typeof product.visible !== 'boolean') {
      throw new Error(`product ${product.slug} must set visible to true or false`)
    }
    if (!product.name || !product.tagline) {
      throw new Error(`product ${product.slug} needs a name and a tagline`)
    }
    if (!Array.isArray(product.sidebar) || product.sidebar.length === 0) {
      throw new Error(`product ${product.slug} needs at least one sidebar group`)
    }
    const prefix = `/${product.slug}/`
    for (const group of product.sidebar) {
      if (!Array.isArray(group.items) || group.items.length === 0) {
        throw new Error(`product ${product.slug} has an empty sidebar group: ${group.text}`)
      }
      for (const item of group.items) {
        if (!item.link?.startsWith(prefix)) {
          throw new Error(`product ${product.slug} links outside ${prefix}: ${item.link}`)
        }
      }
    }
  }
  return products
}

/** @param {Product[]} products */
export function visibleProducts(products) {
  return products.filter((product) => product.visible === true)
}

/** @param {Product[]} products */
export function productNavItems(products) {
  return visibleProducts(products).map((product) => ({
    text: product.name,
    link: `/${product.slug}/`,
  }))
}

/**
 * Each product's documentation entry is the first page of its sidebar.
 *
 * @param {Product[]} products
 */
export function productDocsNavItems(products) {
  return visibleProducts(products).map((product) => ({
    text: product.name,
    link: product.sidebar[0].items[0].link,
  }))
}

/**
 * Top navigation. The docs menu is omitted while no product is visible so the
 * site never renders an empty dropdown.
 *
 * @param {Product[]} products
 */
export function buildNav(products) {
  const docs = productDocsNavItems(products)
  return [
    { text: '首页', link: '/' },
    { text: '产品', items: [{ text: '全部产品', link: '/products/' }, ...productNavItems(products)] },
    ...(docs.length > 0 ? [{ text: '文档', items: docs }] : []),
    { text: '博客', link: '/blog/' },
    {
      text: '关于',
      items: [
        { text: '关于我们', link: '/about' },
        { text: '宣言', link: '/manifesto' },
        { text: '安全与隐私', link: '/trust/' },
      ],
    },
  ]
}

/** @param {Product[]} products */
export function productSidebars(products) {
  return Object.fromEntries(
    visibleProducts(products).map((product) => [`/${product.slug}/`, product.sidebar]),
  )
}

/**
 * Hidden products are kept out of the build entirely, not just unlinked, so a
 * stray link or the sitemap cannot expose them.
 *
 * @param {Product[]} products
 */
export function siteExcludes(products) {
  const hidden = products
    .filter((product) => product.visible !== true)
    .map((product) => `${product.slug}/**`)
  return [...LEGACY_EXCLUDES, ...hidden]
}

/**
 * @template {{ url: string }} T
 * @param {T[]} items
 * @returns {T[]}
 */
export function sitemapItems(items) {
  return items.filter((item) => !Object.hasOwn(REDIRECT_PAGES, item.url))
}

/**
 * Converts the simple globs used above (`*` within a segment, `**` across
 * segments) to an anchored regular expression over POSIX relative paths.
 *
 * @param {string} glob
 */
export function globToRegExp(glob) {
  let source = ''
  for (let index = 0; index < glob.length; index += 1) {
    const char = glob[index]
    if (char === '*') {
      if (glob[index + 1] === '*') {
        source += '.*'
        index += 1
      } else {
        source += '[^/]*'
      }
    } else if ('\\^$+?.()|{}[]'.includes(char)) {
      source += `\\${char}`
    } else {
      source += char
    }
  }
  return new RegExp(`^${source}$`)
}

/**
 * @param {string} relativePath POSIX path relative to the source root
 * @param {readonly string[]} globs
 */
export function isExcluded(relativePath, globs) {
  return globs.some((glob) => globToRegExp(glob).test(relativePath))
}
