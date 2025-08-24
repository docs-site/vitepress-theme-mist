import type { Plugins } from "./interface";
import type { PostData, MtContentData } from "./post/types";


import FileContentLoader, { FileContentLoaderOptions } from "@docs-site/vitepress-plugin-file-content-loader";
import { transformData, transformRaw } from "./post";
import Catalogue from "@docs-site/vitepress-plugin-catalogue";
import DocAnalysis from "@docs-site/vitepress-plugin-doc-analysis";

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

  const {
    docAnalysis = true,
    docAnalysisOption = {},
  } = vitePlugins || {};

  // 文档内容分析插件
  if (docAnalysis) {
    docAnalysisOption.ignoreList = [...ignoreDir.docAnalysis];
    plugins.push(DocAnalysis(docAnalysisOption));
  }

  return plugins;
};

/**
 * 注册强依赖插件（与主题强绑定，无法关闭）
 */
export const registerTightPlugins = (vitePlugins: Plugins, ignoreDir: Record<string, any[]>) => {
  const plugins: any[] = [];

  const { catalogueOption = {}, fileContentLoaderIgnore = [] } = vitePlugins || {};

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

  return plugins;
};
