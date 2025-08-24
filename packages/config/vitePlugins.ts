import type { Plugins } from "./interface";
import type { PostData, MtContentData } from "./post/types";


import FileContentLoader, { FileContentLoaderOptions } from "@docs-site/vitepress-plugin-file-content-loader";
import { transformData, transformRaw } from "./post";

export const registerPluginAndGet = (vitePlugins: Plugins = {}, mistTheme = true) => {
  const plugins: any[] = [];

  // 定义各插件扫描时忽略的目录
  const ignoreDir = {
    fileContentLoader: ["**/components/**", "**/.vitepress/**", "**/public/**", "**/*目录页*/**", "**/.scripts/**"],
  };

  // 主题强内置插件
  if (mistTheme !== false) plugins.push(...registerTightPlugins(vitePlugins, ignoreDir));

  return plugins;
};


/**
 * 注册强依赖插件（与主题强绑定，无法关闭）
 */
export const registerTightPlugins = (vitePlugins: Plugins, ignoreDir: Record<string, any[]>) => {
  const plugins: any[] = [];

  const { fileContentLoaderIgnore = [] } = vitePlugins || {};

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
