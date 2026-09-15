import { defineConfig } from 'vitepress'

import {
  buildNav,
  productSidebars,
  siteExcludes,
  sitemapItems,
  validateProducts,
} from './lib/site.mjs'
import { products } from './products.mjs'

validateProducts(products)

export default defineConfig({
  title: '自然常量',
  description: '自然常量 zteam — 打造工作流里可以依赖的常量',
  lang: 'zh-CN',
  cleanUrls: true,

  srcExclude: siteExcludes(products),

  sitemap: {
    hostname: 'https://dirtyhands.team',
    transformItems: sitemapItems,
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#0f766e' }],
    ['meta', { property: 'og:site_name', content: '自然常量' }],
  ],

  themeConfig: {
    logo: { src: '/logo.svg', alt: '自然常量' },

    nav: buildNav(products),

    sidebar: {
      '/blog/': [
        {
          text: '博客文章',
          items: [{ text: '欢迎', link: '/blog/' }],
        },
      ],
      ...productSidebars(products),
    },

    footer: {
      message: '文中提及的第三方产品名称和商标归各自权利人所有，本站产品与其无隶属关系。',
      copyright: '© 2025-present 自然常量 zteam',
    },

    search: {
      provider: 'local',
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

    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
  },
})
