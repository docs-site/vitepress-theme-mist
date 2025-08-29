import type { CatalogueOption } from "@docs-site/vitepress-plugin-catalogue";
import type { DocAnalysisOption } from "@docs-site/vitepress-plugin-doc-analysis";
import type { DemoOption } from "@docs-site/vitepress-plugin-demo";
import type { NavSidebarOption } from "@docs-site/vitepress-auto-nav-sidebar";
import type { PermalinkOption } from "@docs-site/vitepress-plugin-permalink";

export interface Plugins {
  enabled?: boolean; // 是否启用插件
  /**
   * catalogues 插件配置项
   */
  catalogueOption?: CatalogueOption;
  /**
   * 是否启用 docAnalysis 插件
   *
   * @default true
   */
  docAnalysis?: boolean;
  /**
   * docAnalysis 插件配置项
   */
  docAnalysisOption?: DocAnalysisOption;
  /**
   * fileContentLoader 插件扫描 markdown 文档时，指定忽略路径，格式为 glob 表达式，如 test/**
   *
   * @default []
   */
  fileContentLoaderIgnore?: string[];

  demoOption?: DemoOption;

  /**
   * NavSidebarOption 自动导航栏和侧边栏配置
   *
   * @default []
   */
  navSidebarOption?: NavSidebarOption;
  /**
   * 是否启用 permalink 插件
   *
   * @default true
   */
  permalink?: boolean;
  /**
   * permalinks 插件配置项
   */
  permalinkOption?: PermalinkOption;
}
