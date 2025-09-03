import type { Plugin } from "vite";
import type { NavSidebarOption, SidebarOption } from "./types";
import { DefaultTheme } from "vitepress";
import { join } from "node:path";
import createNavigationData from "./filePathToNavigation";
import createFilePathSidebar from "./filePathToSidebar";
import createRewritesSidebar from "./rewritesToSidebar";
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
      } = config.vitepress;

      const { path, debugInfo, sideBarOption } = option;
      const baseDir = path ? join(srcDir, path) : srcDir;
      const rewrites = rewritesObj.map || {};
      const rewritesLength = Object.keys(rewrites).length;
      // 如果 指定 rewrites 规则，但是 rewrites 不存在，则走 filePath 逻辑
      const resolveRule = sideBarOption?.resolveRule ?? "filePath"
      const isFilePathRule = resolveRule === "filePath" || (resolveRule === "rewrites" && !rewritesLength);
      const isRewritesRule = resolveRule === "rewrites" && rewritesLength;

      if(debugInfo) {
        logger.prt(`srcDir: ${srcDir}`);
        logger.prt(`baseDir: ${baseDir}"`);
      }
      //=============================================
      // 获取导航栏数据,不管哪种模式，都是检测index.md，所以这里可以不用支持rewrite，也没有问题
      const navData = createNavigationData(
        { ...option.navOption, path: baseDir },
        option.path,
        srcDir
      );
      setNavBar(themeConfig, navData); // 设置导航栏
      //=============================================
      // 获取侧边栏数据
      //  filePath 规则
      if (isFilePathRule){
        const sideBarData = createFilePathSidebar(
          { ...option.sideBarOption, path: baseDir }, // 展开原始的 option 对象，并覆盖 path 属性为 baseDir
          option.path,
          srcDir
        );
        setSideBar(themeConfig, sideBarData, sideBarOption?.type);
      }
      else if(isRewritesRule) {

        // 去掉每一项键中的 option.sideBarOption.path 路径部分
        // 这个是要是让sdoc为基础目录来生成侧边栏，不然后面的逻辑会全部变成一个侧边栏，且位于sdoc下
        const pathToRemove = option.sideBarOption?.path || 'sdoc';
        const filteredRewrites = Object.fromEntries(
          Object.entries(rewrites).map(([key, value]) => [
            key.replace(new RegExp(`^${pathToRemove}/`, 'g'), ''),
            value
          ])
        ) as Record<string, string>;
        // console.log(filteredRewrites);
        const rewriteSideBarData = createRewritesSidebar(
          filteredRewrites,
          option.path,
          { ...option.sideBarOption, path: baseDir }
        );
        return setSideBar(themeConfig, rewriteSideBarData, sideBarOption?.type);
      }
    }
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

const setSideBar = (
  themeConfig: any,
  autoSidebar: DefaultTheme.SidebarMulti | DefaultTheme.SidebarItem[],
  type: SidebarOption["type"]
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

  logger.info("Injected Sidebar Data Successfully. 注入侧边栏数据成功!");
};
