import type { SidebarGenerateConfig, NavGenerateConfig } from "@docs-site/vitepress-nav-sidebar";

export interface NavSidebarConfig {
  /**
   * 文档目录名称
   * @default 'sdoc'
   */
  docDirName?: string;
  
  /**
   * 导航配置
   */
  nav?: Omit<NavGenerateConfig, 'dirName' | 'rootDir'>;
  
  /**
   * 侧边栏配置
   */
  sidebar?: Omit<SidebarGenerateConfig, 'dirName' | 'rootDir'>;
}
