import { defineConfig } from "vitepress";
// 主题配置
import { defineMistConfig } from "../../../packages/config";
import { createRewrites } from "../../../packages/config";

const myThemeConfig = defineMistConfig({
  useTheme: true,
  themeName: "vitepress-theme-mist",
  clickEffect: {
    enabled: true,
  },
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: myThemeConfig,
  title: "vitepress-theme-mist",
  description: "Mist Instruction Manual",
  base: "/vitepress-theme-mist/", // 计划将站点部署到 https://docs-site.github.io/vitepress-theme-mist/，那么应该将 base 设置为 '/vitepress-theme-mist/'。它应该始终以 / 开头和结尾。
  // rewrites: createRewrites({ srcDir: "src" }), // 这里需要填项目根目录(.vtiepress所在目录，若是.vitepress和package.json在同级，则可为空)
  vite: {
    server: {
			host: "0.0.0.0",
			allowedHosts: true
		}
	},
	themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: "功能页",
        items: [
          { text: "归档页", link: "/archives" },
          { text: "导航页", link: "/Navigation" },
        ],
      },
    ],
    logo: "/favicon.svg", // 导航栏标题的logo
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    outline: {
      label: "页面导航",
      level: [2, 6],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/docs-site/vitepress-theme-mist.git" }],
  },
});
