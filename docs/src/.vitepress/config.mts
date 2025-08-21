import { defineConfig } from 'vitepress'
import { getSidebarData, getNavData } from './get-nav-sidebar'
// 主题配置
import { defineMistConfig } from "../../../packages/config";

const myThemeConfig = defineMistConfig({
  useTheme: true,
  themeName: 'vitepress-theme-mist',
});

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
    outline: {
      label: '页面导航',
      level: [2, 6],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
