import type { Plugins } from "./interface";
import type { PostData, MtContentData } from "./post/types";

import FileContentLoader, { FileContentLoaderOptions } from "@docs-site/vitepress-plugin-file-content-loader";
import { transformData, transformRaw } from "./post";
import Catalogue from "@docs-site/vitepress-plugin-catalogue";
import DocAnalysis from "@docs-site/vitepress-plugin-doc-analysis";
import { getNavData, getSidebarData } from "@docs-site/vitepress-nav-sidebar";
import VitePluginVitePressDemo from "@docs-site/vitepress-plugin-demo"
import VitePluginVitePressAutoNavSidebar from "@docs-site/vitepress-auto-nav-sidebar"

export const registerPluginAndGet = (vitePlugins: Plugins = {}, mistTheme = true) => {
  const plugins: any[] = [];

  // 定义各插件扫描时忽略的目录
  const ignoreDir = {
    docAnalysis: ["@pages", /目录页/, ".scripts"],
    fileContentLoader: ["**/components/**", "**/.vitepress/**", "**/public/**", "**/*目录页*/**", "**/.scripts/**"],
  };

  plugins.push(...registerLoosePlugins(vitePlugins, ignoreDir));

  // 主题强内置插件
  if (mistTheme !== false) plugins.push(...registerTightPlugins(vitePlugins, ignoreDir));

  return plugins;
};

/**
 * 注册弱依赖插件（可通过配置项进行关闭）
 */
const registerLoosePlugins = (vitePlugins: Plugins, ignoreDir: Record<string, any[]>) => {
  const plugins: any[] = [];

  const { docAnalysis = true, docAnalysisOption = {}, demoOption = {}} = vitePlugins || {};

  // 文档内容分析插件
  if (docAnalysis) {
    docAnalysisOption.ignoreList = [...ignoreDir.docAnalysis];
    plugins.push(DocAnalysis(docAnalysisOption));
  }

  // Data demo
  plugins.push(VitePluginVitePressDemo(demoOption));
  return plugins;
};

/**
 * 注册强依赖插件（与主题强绑定，无法关闭）
 */
export const registerTightPlugins = (vitePlugins: Plugins, ignoreDir: Record<string, any[]>) => {
  const plugins: any[] = [];

  const { 
    catalogueOption = {}, 
    fileContentLoaderIgnore = [],
    navSidebarOption = {},
  } = vitePlugins || {};

  // 目录页插件
  plugins.push(Catalogue(catalogueOption));

  const fileContentLoaderOptions: FileContentLoaderOptions<MtContentData, PostData> = {
    pattern: ["**/*.md"],
    // 指定摘录格式
    excerpt: "<!-- more -->",
    includeSrc: true,
    transformData,
    transformRaw,
    themeConfigKey: "posts",
    globOptions: {
      ignore: [...ignoreDir.fileContentLoader, ...fileContentLoaderIgnore],
    },
  };

  // Post 数据处理插件
  plugins.push(FileContentLoader<MtContentData, PostData>(fileContentLoaderOptions));

  // 自动侧边栏插件
  plugins.push(VitePluginVitePressAutoNavSidebar(navSidebarOption))
  return plugins;
};

/**
 * 生成导航和侧边栏数据
 * @param navSidebar - 导航和侧边栏配置
 * @returns 包含导航和侧边栏数据的对象
 */
export const generateNavAndSidebar = (navSidebar: any) => {
  // 获取文档目录名称，默认为 'sdoc'
  const docDirName = navSidebar?.docDirName || 'sdoc';
  
  // 生成导航数据
  const navData = [
    ...getNavData({
      dirName: docDirName,
      maxLevel: navSidebar?.nav?.maxLevel || 2,
      debugPrint: navSidebar?.nav?.debugPrint || false
    }),
    {
      text: '功能页',
      items: [
        { text: '导航页', link: '/@pages/Navigation' }
      ]
    },
  ];
  
  // 生成侧边栏数据
  const sidebarData = getSidebarData({
    dirName: docDirName,
    maxLevel: navSidebar?.sidebar?.maxLevel || 6,
    debugPrint: navSidebar?.sidebar?.debugPrint || false
  });
  
  return {
    nav: navData,
    sidebar: sidebarData
  };
};
