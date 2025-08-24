import type {
  ArticleShare,
  Author,
  ClickEffect,
  Markdown,
  Plugins,
  ThemeEnhance,
} from "./interface";

export type * from "./interface";
export type * from "./post/types";

export type { Catalogue, CatalogueInfo, CatalogueItem, CatalogueOption } from "@docs-site/vitepress-plugin-catalogue";
export type { FileContentLoaderData, FileContentLoaderOptions } from "@docs-site/vitepress-plugin-file-content-loader";

export interface MistConfig {
  useTheme?: boolean; // 是否开启主题
  articleShare?: ArticleShare; // 文章分享配置
  author?: Author; // 文章作者配置
  clickEffect?: ClickEffect; // 点击特效配置
  markdown?: Markdown;// markdown插件配置
  themeName?: string; // 主题名称
  themeEnhance?: ThemeEnhance; // 主题增强配置
  vitePlugins?: Plugins; // 内置 Vite 插件配置
  // ...
}
