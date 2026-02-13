import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Dirty Hands",
  description: "脏手团队 — 解构规律，突破边界，面向未来",
  lang: 'zh-CN',
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '宣言', link: '/manifesto' },
      { text: '博客', link: '/blog/' },
      { text: '项目', link: '/projects/' },
      { text: '关于', link: '/about' },
    ],

    sidebar: {
      '/blog/': [
        {
          text: '博客文章',
          items: [
            { text: '欢迎', link: '/blog/' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/adongguo' },
    ],

    footer: {
      message: 'Get your hands dirty.',
      copyright: '© 2025-present Dirty Hands Team'
    },

    search: {
      provider: 'local'
    },

    outline: {
      label: '目录',
      level: [2, 3],
    },

    lastUpdated: {
      text: '最后更新',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },
})
