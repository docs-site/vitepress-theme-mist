import type { CatalogueOption } from "@docs-site/vitepress-plugin-catalogue";
import type { DocAnalysisOption } from "@docs-site/vitepress-plugin-doc-analysis";
import type { DemoOption } from "@docs-site/vitepress-plugin-demo";

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
}
