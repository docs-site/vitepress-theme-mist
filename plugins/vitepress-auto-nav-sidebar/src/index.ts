import type { Plugin } from "vite";
import type { DefaultTheme } from "vitepress";
import { join } from "node:path";
import { NavSidebarOption } from "./types";
import logger from "./log";
import createNavigationData from "./getDataToNavigation";

export * from "./types";

export default function VitePluginVitePressAutoNavSidebar(option: NavSidebarOption = {}): Plugin & { name: string } {
  let isExecute = false;
  return {
    name: "vitepress-auto-nav-sidebar",
    config(config: any) {
      // 防止 vitepress build 时重复执行
      if (isExecute) return;
      isExecute = true;

      // 获取 themeConfig 配置
      const {
        site: { themeConfig = {} },
        srcDir, // 此工作区中的站点配置中未配置，默认为 D:/xxx/vitepress-theme-mist/docs/src
      } = config.vitepress;

      const { path, debugInfo } = option;
      const baseDir = path ? join(srcDir, path) : srcDir;
      
      if(debugInfo) {
        logger.prt(`srcDir: ${srcDir}`);
        logger.prt(`baseDir: ${baseDir}"`);
      }
      
      // 获取导航栏数据
      const navData = createNavigationData(option, baseDir);

      // 设置导航栏
      setNavBar(themeConfig, navData);
    },
  };
}

const setNavBar = (
  themeConfig: any,
  autoNav: DefaultTheme.NavItem[]
) => {
  // 防止 themeConfig 为 undefined
  themeConfig = themeConfig || {};

  themeConfig.nav = [
    ...(autoNav || []),
    ...(Array.isArray(themeConfig.nav) ? themeConfig.nav : []),
  ];

  logger.info("Injected Navigation Data Successfully. 注入导航栏数据成功!");
};
