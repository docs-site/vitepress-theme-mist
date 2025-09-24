import type {
  ArticleAnalyze,
  ArticleShare,
  Author,
  BackTop,
  Breadcrumb,
  ClickEffect,
  CodeBlock,
  CommentConfig,
  DocAnalysis,
  FooterGroup,
  FooterInfo,
  DocFooterCopyright,
  Markdown,
  Plugins,
  ThemeEnhance,
  ToComment,
  Social,
  WindowTransition,
} from "./interface";

export type * from "./interface";
export type * from "./post/types";

export type { Catalogue, CatalogueInfo, CatalogueItem, CatalogueOption } from "@docs-site/vitepress-plugin-catalogue";
export type { FileContentLoaderData, FileContentLoaderOptions } from "@docs-site/vitepress-plugin-file-content-loader";
export type {
  DocAnalysis as DocAnalysisData,
  DocAnalysisOption,
  FileInfo as DocDocAnalysisFileInfo,
  FilePathInfo,
} from "@docs-site/vitepress-plugin-doc-analysis";
export type { DemoOption } from "@docs-site/vitepress-plugin-demo";

export interface MistConfig {
  useTheme?: boolean; // 是否开启主题
  articleAnalyze?: ArticleAnalyze; // 文章信息配置
  articleShare?: ArticleShare; // 文章分享配置
  author?: Author; // 文章作者配置
  backTop?: BackTop; // 回到顶部按钮配置
  breadcrumb?: Breadcrumb; // 面包屑配置
  clickEffect?: ClickEffect; // 点击特效配置
  codeBlock?: CodeBlock; // 代码块配置
  comment?: // 评论配置,toComment要用到，这里先添加
  | CommentConfig<"">
    | CommentConfig<"twikoo">
    | CommentConfig<"waline">
    | CommentConfig<"giscus">
    | CommentConfig<"artalk">
    | CommentConfig<"render">
    | boolean;
  docAnalysis?: DocAnalysis; // 文章分析配置
  docFooterCopyright?: DocFooterCopyright; // 页脚版权配置
  footerInfo?: FooterInfo; // 页脚配置
  footerGroup?: FooterGroup[]; // 页脚信息组配置
  markdown?: Markdown; // markdown插件配置
  sidebarTrigger?: boolean; // 是否启用侧边栏展开/折叠触发器
  social?: Social[]; // 社交信息配置
  themeName?: string; // 主题名称
  themeEnhance?: ThemeEnhance; // 主题增强配置
  toComment?: ToComment; // 滚动到评论区配置
  vitePlugins?: Plugins; // 内置 Vite 插件配置
  windowTransition?: boolean | WindowTransition; // 是否全局启用视图渐入过渡效果
  // ...
}
