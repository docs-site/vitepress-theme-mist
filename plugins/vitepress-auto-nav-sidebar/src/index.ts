import type { Plugin } from "vite";
import { NavSidebarOption } from "./types";
import logger from "./log";

export * from "./types";

export default function VitePluginVitePressAutoNavSidebar(option: NavSidebarOption = {}): Plugin & { name: string } {
  return {
    name: "vitepress-auto-nav-sidebar",
    config(config: any) {
      // 获取 themeConfig 配置
      const {
        site: { themeConfig = {} },
      } = config.vitepress;

      // 获取传过来的参数 
      const path = option.path;

      // 生成要挂载到 themeConfig 的数据
      const navData = "navData" + path;
      const sidebarData = "sidebarData" + path;

      themeConfig.autoNav = navData;
      themeConfig.autoSidebar = sidebarData;
      
      logger.info("Injected Navigation and Sidebar Data Successfully. 注入导航栏和侧边栏数据成功!");
    },
  };
}

