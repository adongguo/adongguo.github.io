// Product registry that drives navigation, sidebars and build exclusions.
//
// Only register products that are cleared for publication. This repository is
// public, so an entry is visible to anyone reading it even while `visible` is
// false; the flag exists to stage pages of an already public product.

/** @type {import('./lib/site.mjs').Product[]} */
export const products = [
  {
    slug: 'zmux',
    name: 'zmux',
    tagline: '为多 Agent 并行工作打造的 macOS 终端',
    visible: true,
    sidebar: [
      {
        text: '开始',
        items: [
          { text: '介绍', link: '/zmux/guide/' },
          { text: '安装与校验', link: '/zmux/guide/install' },
          { text: '快速开始', link: '/zmux/guide/getting-started' },
        ],
      },
      {
        text: '参考',
        items: [{ text: '快捷键', link: '/zmux/reference/shortcuts' }],
      },
      {
        text: '帮助',
        items: [
          { text: '常见问题', link: '/zmux/faq' },
          { text: '更新日志', link: '/zmux/changelog' },
        ],
      },
    ],
  },
]
