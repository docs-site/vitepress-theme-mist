import type { CatalogueOption } from "@docs-site/vitepress-plugin-catalogue";
export interface Plugins {
  enabled?: boolean; // 是否启用插件
  /**
   * catalogues 插件配置项
   */
  catalogueOption?: CatalogueOption;
  /**
   * fileContentLoader 插件扫描 markdown 文档时，指定忽略路径，格式为 glob 表达式，如 test/**
   *
   * @default []
   */
  fileContentLoaderIgnore?: string[];
}
