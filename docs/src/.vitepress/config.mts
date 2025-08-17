import { defineConfig } from 'vitepress'

// 主题配置
import getThemeConfig from "./myThemeConfig";

const myThemeConfig = getThemeConfig({ useTheme: true });

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: myThemeConfig,
  title: "vitepress-theme-mist",
  description: "Mist Instruction Manual",
  base: '/vitepress-theme-mist/', // 计划将站点部署到 https://docs-site.github.io/vitepress-theme-mist/，那么应该将 base 设置为 '/vitepress-theme-mist/'。它应该始终以 / 开头和结尾。
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/Examples' },
      { text: '开发指南', link: '/01-开发' },
      { 
        text: '组件', 
        items: [
          { text: '公共组件', link: '/02-组件/01-公共组件/' }
        ]
      }
    ],

    sidebar: {
      '/Examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/Examples/markdown-examples' },
            { text: 'Runtime API Examples', link: '/Examples/api-examples' }
          ]
        }
      ],
      '/01-开发/': [
        {
          text: '开发指南',
          items: [
            { text: '主题配置', link: '/01-开发/主题配置' },
          ]
        }
      ],
      '/02-组件/': [
        {
          text: '公共组件',
          items: [
            { text: 'DataLoader数据加载', link: '/02-组件/01-公共组件/DataLoader数据加载' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
