import { defineConfig } from 'vitepress'
import { getSidebarData, getNavData } from './get-nav-sidebar'
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
    nav: getNavData({ 
      dirName: 'sdoc', 
      maxLevel: 2, 
      debugPrint: false 
    }),
    sidebar: getSidebarData({ 
      dirName: 'sdoc', 
      maxLevel: 6,
      debugPrint: false 
    }),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
