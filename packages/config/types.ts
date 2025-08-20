import type { 
  Markdown 
} from "./interface";

export type * from "./interface";
export interface MistConfig {
  useTheme?: boolean; // 是否开启主题
  markdown?: Markdown;// markdown插件配置
  // ...
}
