import { defineConfig } from 'vitepress'

// 主题配置
import { defineMistConfig } from "../../../packages/config";

const myThemeConfig = defineMistConfig({
    useTheme: true,
    
    themeConfig: {
      logo: '/favicon.svg', // 导航栏标题的logo
      footer: {
        message: '前路漫漫亦灿灿',
        copyright: 'Copyright © 2019-present 苏木'
      },
      outline: {
        label: '页面导航',
        level: [2, 6],
      },
    }
  }
);

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
      { text: 'Examples', link: '/Examples/' },
      { text: '开发指南', link: '/01-开发/' },
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
            { text: 'pnpm工作区', link: '/01-开发/pnpm工作区' },
            { text: 'TS路径映射与包作用域', link: '/01-开发/TS路径映射与包作用域' },
            { text: '主题入口分析', link: '/01-开发/主题入口分析' },
            { text: 'DataLoader组件分析', link: '/01-开发/DataLoader组件分析' },
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
