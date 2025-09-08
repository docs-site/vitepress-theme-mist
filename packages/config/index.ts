// myThemeConfig.ts
import type { DefaultTheme, UserConfig } from "vitepress";
import type { MistConfig } from "./types";
// import type { PluginOption } from "vite";
import { demoPlugin, containerPlugin } from "../markdown";
import { registerPluginAndGet } from "./vitePlugins";

import {
  articleAnalyzeConfig,
  docAnalysisConfig,
  docFooterCopyrightConfig,
  FooterGroupConfig,
  FooterInfoConfig,
  themeEnhanceConfig,
  vitePluginsConfig,
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
  articleShare: {
    enabled: true,
  },
  author: {
    name: "苏木",
  },
  breadcrumb: {
    enabled: true,
    showCurrentName: false,
    separator: "/",
    homeLabel: "首页",
  },
  clickEffect: {
    enabled: false,
    textArray: ["富强", "民主", "文明", "和谐", "自由", "平等", "公正", "法治", "爱国", "敬业", "诚信", "友善"],
    fontSize: 16,
    random: false,
  },
  codeBlock: {
    enabled: true,
    collapseHeight: 500,
    copiedDone: undefined,
    overlay: false,
    overlayHeight: 400,
    langTextTransform: "lowercase", // 语言文本显示样式
  },
  comment: false,
  // comment: {
  //   provider: "giscus", // 评论区提供者
  //   // 评论区配置项，根据 provider 不同而不同，具体看对应官网的使用介绍
  //   options: {
  //     // twikoo 配置，官网：https://twikoo.js.org/
  //     // envId: "your envId",

  //     // waline 配置，官网：https://waline.js.org/
  //     // serverURL: "your serverURL",
  //     // jsLink: "https://unpkg.com/@waline/client@v3/dist/waline.js",
  //     // cssLink: "https://unpkg.com/@waline/client@v3/dist/waline.css",

  //     // giscus 配置，官网：https://giscus.app/zh-CN
  //     repo: "your name/your repo",
  //     repoId: "your repoId",
  //     category: "your category",
  //     categoryId: "your categoryId",

  //     // artalk 配置，官网：https://artalk.js.org/
  //     // server: "your server",
  //     // site: "site",
  //   },
  // },
  docAnalysis: docAnalysisConfig,
  // 页脚信息组配置
  footerGroup: FooterGroupConfig,
  // 页脚配置
  footerInfo: FooterInfoConfig,
  markdown: {},
  social: [
    {
      icon: "",
      name: "",
      link: "",
    },
    {
      icon: "",
      name: "",
      link: "",
    },
  ],
  themeName: "mist",
  themeEnhance: themeEnhanceConfig,
  vitePlugins: vitePluginsConfig,
  docFooterCopyright: docFooterCopyrightConfig,
  // 右下角回到顶部配置
  backTop: {
    enabled: true, // 是否启动回到顶部功能
    content: "progress", // 回到顶部按钮的显示内容，可选配置 progress | icon
    done: TkMessage => TkMessage.success("返回顶部成功"), // 回到顶部后的回调
  },
  // 滚动到评论区配置
  toComment: {
    enabled: true, // 是否启动滚动到评论区功能
    done: TkMessage => TkMessage.success("滚动到评论区成功"), // 滚动到评论区后的回调
  },
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
      },
    },
    themeConfig: {
      ...mergedConfig,
    },
  };
};
