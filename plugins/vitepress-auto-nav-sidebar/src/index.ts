import type { Plugin } from "vite";
import type { NavSidebarOption, SidebarOption } from "./types";
import { DefaultTheme } from "vitepress";
import { join } from "node:path";
import createNavigationData from "./filePathToNavigation";
import createFilePathSidebar from "./filePathToSidebar";
import createRewritesSidebar from "./rewritesToSidebar";
import createRewritesNavigation from "./rewritesToNavigation";
import logger from "./log";

export * from "./types";
export * from "./utils";

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
        rewrites: rewritesObj,
        userConfig,
      } = config.vitepress;

      const { path, debugInfo, sideBarOption } = option;
      const baseDir = path ? join(srcDir, path) : srcDir;

      // 如果使用 ./rewrites.ts 的 createRewrites 创建的 rewrites，则这里自动使用rewrite
      let createRule: "filePath" | "rewrites" = "filePath";
      const rewrites = rewritesObj.map || {};
      const rewritesLength = Object.keys(rewrites).length;
      if (userConfig?.rewrites?.__create__ === "vitepress-plugin-permalink" && rewritesLength !== 0) {
        createRule = "rewrites";
      }

      if (debugInfo) {
        logger.prt(`srcDir: ${srcDir}`);
        logger.prt(`baseDir: ${baseDir}"`);
        logger.prt(`createRule: ${createRule}, rewritesLength: ${rewritesLength}`);
      }
      //=============================================
      let navData: any;
      let sideBarData: any;
      if (createRule === "filePath") {
        //  filePath 规则
        navData = createNavigationData({ ...option.navOption, path: baseDir }, option.path, srcDir);

        sideBarData = createFilePathSidebar(
          { ...option.sideBarOption, path: baseDir }, // 展开原始的 option 对象，并覆盖 path 属性为 baseDir
          option.path,
          srcDir
        );
      } else if (createRule === "rewrites") {
        //  rewrites 规则
        // 去掉每一项键中的 option.sideBarOption.path 路径部分
        // 这个是要是让sdoc为基础目录来生成侧边栏，不然后面的逻辑会全部变成一个侧边栏，且位于sdoc下
        const pathToRemove = option.sideBarOption?.path || "sdoc";
        const filteredRewrites = Object.fromEntries(
          Object.entries(rewrites).map(([key, value]) => [key.replace(new RegExp(`^${pathToRemove}/`, "g"), ""), value])
        ) as Record<string, string>;

        navData = createRewritesNavigation(filteredRewrites, { ...option.navOption, path: baseDir });

        // console.log(filteredRewrites);
        sideBarData = createRewritesSidebar(filteredRewrites, option.path, { ...option.sideBarOption, path: baseDir });
      }
      setNavBar(themeConfig, navData); // 设置导航栏
      setSideBar(themeConfig, sideBarData, sideBarOption?.type, createRule);
    },
  };
}

const setNavBar = (themeConfig: any, autoNav: DefaultTheme.NavItem[]) => {
  // 防止 themeConfig 为 undefined
  themeConfig = themeConfig || {};

  themeConfig.nav = [...(autoNav || []), ...(Array.isArray(themeConfig.nav) ? themeConfig.nav : [])];

  logger.info("Injected Navigation Data Successfully. 注入导航栏数据成功!");
};

const setSideBar = (
  themeConfig: any,
  autoSidebar: DefaultTheme.SidebarMulti | DefaultTheme.SidebarItem[],
  type: SidebarOption["type"],
  createRule: any
) => {
  // 防止 themeConfig 为 undefined
  themeConfig = themeConfig || {};

  if (type === "object") {
    themeConfig.sidebar = {
      ...autoSidebar,
      ...(Array.isArray(themeConfig.sidebar) ? logger.warn("自定义 Sidebar 必须是对象形式") : themeConfig.sidebar),
    };
  } else {
    themeConfig.sidebar = [
      ...(autoSidebar as DefaultTheme.SidebarItem[]),
      ...(Object.prototype.toString.call(themeConfig.sidebar) === "[object Object]"
        ? logger.warn("自定义 Sidebar 必须是数组形式")
        : themeConfig.sidebar || []),
    ];
  }

  logger.info(`Injected ${createRule} Sidebar Data Successfully. 注入侧边栏数据成功!`);
};
