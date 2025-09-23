// myThemeConfig.ts
import type { DefaultTheme, UserConfig } from "vitepress";
import type { MistConfig } from "./types";
// import type { PluginOption } from "vite";
import { demoPlugin, containerPlugin, imgLazyLoadPlugin } from "../markdown";
import { registerPluginAndGet } from "./vitePlugins";

import {
  articleAnalyzeConfig,
  articleShareConfig,
  authorConfig,
  backTopConfig,
  breadcrumbConfig,
  clickEffectConfig,
  codeBlockConfig,
  commentConfig,
  docAnalysisConfig,
  docFooterCopyrightConfig,
  FooterGroupConfig,
  FooterInfoConfig,
  markdownConfig,
  socialConfig,
  themeEnhanceConfig,
  themeNameConfig,
  toCommentConfig,
  vitePluginsConfig,
  windowTransitionConfig,
} from "./defaultConfig";
export type * from "./types";
export { createRewrites } from "@docs-site/vitepress-plugin-permalink";

/**
 * @brief 定义Mist主题的配置
 *
 * @description 该函数用于创建和合并Mist主题的VitePress配置，支持自定义主题开关和配置覆盖
 *
 * @param config 用户配置对象，包含以下可选属性：
 *   - useTheme: boolean (默认true) 是否启用主题
 *   - 其他VitePress标准配置项（类型为 ThemeConfig & UserConfig<DefaultTheme.Config>）
 *
 * @return UserConfig 返回合并后的VitePress配置对象
 *
 * @example 基本使用
 * const config = defineMistConfig({
 *   useTheme: true,
 *   themeConfig: {
 *     logo: '/custom-logo.svg',
 *     footer: {
 *       message: '自定义页脚信息',
 *       copyright: 'Copyright © 2023'
 *     }
 *   }
 * });
 *
 * @example 禁用主题
 * const config = defineMistConfig({ useTheme: false });
 */
// 默认配置
const defaultMistConfig: Required<MistConfig> = {
  useTheme: true,
  articleAnalyze: articleAnalyzeConfig,
  articleShare: articleShareConfig,
  author: authorConfig,
  breadcrumb: breadcrumbConfig,
  clickEffect: clickEffectConfig,
  codeBlock: codeBlockConfig,
  comment: commentConfig,
  docAnalysis: docAnalysisConfig,
  // 页脚信息组配置
  footerGroup: FooterGroupConfig,
  // 页脚配置
  footerInfo: FooterInfoConfig,
  markdown: markdownConfig,
  social: socialConfig,
  themeName: themeNameConfig,
  themeEnhance: themeEnhanceConfig,
  vitePlugins: vitePluginsConfig,
  docFooterCopyright: docFooterCopyrightConfig,
  // 右下角回到顶部配置
  backTop: backTopConfig,
  // 滚动到评论区配置
  toComment: toCommentConfig,
  windowTransition: windowTransitionConfig,
} as Required<MistConfig>;

export const defineMistConfig = (config: MistConfig & UserConfig<DefaultTheme.Config> = {}): UserConfig => {
  // 获取用户的配置，进行逻辑处理
  const { vitePlugins, markdown = {}, ...MistThemeConfig } = config;

  // 合并默认配置和用户配置的 vitePlugins
  const mergedVitePlugins = {
    ...defaultMistConfig.vitePlugins,
    ...vitePlugins,
  };

  const plugins = registerPluginAndGet(mergedVitePlugins, MistThemeConfig.useTheme);

  // 合并默认配置和用户配置
  const mergedConfig: MistConfig = {
    ...defaultMistConfig,
    ...MistThemeConfig,
    articleShare: {
      ...defaultMistConfig.articleShare,
      ...MistThemeConfig.articleShare,
    },
  };

  // if (!mergedConfig.useTheme) return {};

  return {
    // ignoreDeadLinks 默认值修改为 true，当用户在 VitePress 手动改为 false 才为 false
    ignoreDeadLinks: true,
    // 添加主题需要的 head 信息
    head: [],
    vite: {
      // 添加主题需要的 Vite 插件
      plugins: plugins,
      // 解决项目启动后终端打印 Scss 的废弃警告：The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.
      css: { preprocessorOptions: { scss: { api: "modern" } } },
      ssr: { noExternal: ["vitepress-theme-mist"] },
    },
    markdown: {
      config: md => {
        const { container = {}, demo } = markdown;
        // 使用链式调用可以简化代码结构，提高可读性。
        // 每个 `.use()` 方法都会返回 `md` 实例本身，因此可以连续调用多个插件。
        // 这种方式避免了多次重复书写 `md.use(...)`，使代码更加简洁明了。
        if (!demo?.disabled) md.use(demoPlugin, demo).use(containerPlugin, container.label);
        // 自动为 HTML img 标签添加 loading="lazy" 属性
        // 使用最终的 markdown 配置中的 lazyLoading 值
        const finalConfig = md.options as any;
        const lazyLoading = finalConfig.image?.lazyLoading ?? true;
        md.use(imgLazyLoadPlugin, lazyLoading);
      },
      lineNumbers: true,
      image: {
        // 默认禁用；设置为 true 可为所有图片启用懒加载。
        lazyLoading: true,
      },
    },
    lastUpdated: true, // 显示最后更新时间
    themeConfig: {
      ...mergedConfig,
    },
  };
};
