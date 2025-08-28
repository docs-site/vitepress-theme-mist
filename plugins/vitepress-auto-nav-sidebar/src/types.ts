export interface NavOption {
  maxLevel?: number;          // 最大遍历层级 @default 1
  ignoreDirNames?: string[];  // 忽略的文件夹名称 @default ['demo', 'asserts', '.git', '.github']
  ignoreFileNames?: string[]; // 忽略的文件名 @default ['index.md']
  debugPrint?: boolean;       // 是否打印调试信息 @default false
}

export interface NavSidebarOption {
  /**
   * 文章所在的目录，基于 .vitepress 目录层级添加，开头不需要有 /
   *
   * @default 'vitepress 的 srcDir 配置项'
   */
  path?: string;
  
  /**
   * 忽略插件在构建侧边栏时生成的警告信息
   *
   * @default false
   */
  debugInfo?: boolean;
  /**
   * 导航栏扫描的一些配置项
   *
   * @default {}
   */
  navOption?: NavOption;
}

