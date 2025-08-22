import type { 
  ArticleShare,
  Markdown 
} from "./interface";

export type * from "./interface";
export interface MistConfig {
  useTheme?: boolean; // 是否开启主题
  articleShare?: ArticleShare; // 文章分享配置
  markdown?: Markdown;// markdown插件配置
  themeName?: string; // 主题名称
  // ...
}
