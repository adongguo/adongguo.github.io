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
  {
    slug: 'zwork',
    name: 'zwork',
    tagline: '面向云效的桌面 Agent 工作台',
    visible: true,
    sidebar: [
      {
        text: '开始',
        items: [
          { text: '介绍', link: '/zwork/guide/' },
          { text: '安装与更新', link: '/zwork/guide/install' },
          { text: '快速开始', link: '/zwork/guide/getting-started' },
        ],
      },
      {
        text: '参考',
        items: [
          { text: '快捷键', link: '/zwork/reference/shortcuts' },
          { text: '命令行', link: '/zwork/reference/cli' },
        ],
      },
      {
        text: '帮助',
        items: [
          { text: '常见问题', link: '/zwork/faq' },
          { text: '更新日志', link: '/zwork/changelog' },
        ],
      },
    ],
  },
  {
    slug: 'zdash',
    name: 'zdash',
    tagline: '云效工作项的终端看板',
    visible: true,
    sidebar: [
      {
        text: '开始',
        items: [
          { text: '介绍', link: '/zdash/guide/' },
          { text: '安装', link: '/zdash/guide/install' },
          { text: '快速开始', link: '/zdash/guide/getting-started' },
        ],
      },
      {
        text: '参考',
        items: [
          { text: '键位', link: '/zdash/reference/keys' },
          { text: '命令行', link: '/zdash/reference/cli' },
          { text: '配置', link: '/zdash/reference/config' },
        ],
      },
      {
        text: '帮助',
        items: [
          { text: '常见问题', link: '/zdash/faq' },
          { text: '更新日志', link: '/zdash/changelog' },
        ],
      },
    ],
  },
  {
    slug: 'zclaw',
    name: 'zclaw',
    tagline: '以你本人身份在钉钉里代答的数字分身',
    visible: true,
    sidebar: [
      {
        text: '开始',
        items: [
          { text: '介绍', link: '/zclaw/guide/' },
          { text: '安装', link: '/zclaw/guide/install' },
          { text: '快速开始', link: '/zclaw/guide/getting-started' },
          { text: '安全与合规设计', link: '/zclaw/guide/security' },
        ],
      },
      {
        text: '参考',
        items: [
          { text: '命令行', link: '/zclaw/reference/cli' },
          { text: '配置', link: '/zclaw/reference/config' },
        ],
      },
      {
        text: '帮助',
        items: [
          { text: '常见问题', link: '/zclaw/faq' },
          { text: '更新日志', link: '/zclaw/changelog' },
        ],
      },
    ],
  },
]
