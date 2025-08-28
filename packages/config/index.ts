// myThemeConfig.ts
import type { DefaultTheme, UserConfig } from "vitepress";
import type { MistConfig } from "./types";
// import type { PluginOption } from "vite";
import { demoPlugin, containerPlugin } from "../markdown";
import { registerPluginAndGet } from "./vitePlugins";

export type * from "./types";

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
  articleAnalyze: {
    showIcon: true,
    dateFormat: "yyyy-MM-dd",
    showInfo: true,
    showAuthor: true,
    showCreateDate: true,
    showUpdateDate: false,
    showCategory: false,
    showTag: false,
    teleport: {
      position: "after",
      className: "teleport",
    },
  },
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
    textArray: [ "富强", "民主", "文明", "和谐", "自由", "平等", "公正", "法治", "爱国", "敬业", "诚信", "友善" ],
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
  docAnalysis: {
    enabled: true,
    title: "${icon}站点信息",
    wordCount: true,
    readingTime: true,
    statistics: {
      siteView: true,
      pageView: true,
      permalink: true,
    },
  },
  markdown: {},
  themeName: "mist",
  themeEnhance: {
    enabled: true,
    position: "top",
  },
  navSidebar: {
    docDirName: 'sdoc',
    nav: {
      maxLevel: 2,
      debugPrint: false
    },
    sidebar: {
      maxLevel: 6,
      debugPrint: false
    }
  },
  vitePlugins: {
    enabled: true,
    docAnalysis: true,
    fileContentLoaderIgnore: [],
    demoOption: {
      str: "mist",
    },
    navSidebarOption: {
      path: "sdoc",
      debugInfo: false,
      navOption: {
        maxLevel: 2,
        debugPrint: false
      },
      sideBarOption: {
        type: "object",
        ignoreList: ["index.md", "README.md"],
        initItems: false, // 这个设置为true的话进入某个导航栏路径时可能不显示侧边栏
        collapsed: true,
      }
    }
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
    navSidebar: {
      ...defaultMistConfig.navSidebar,
      ...MistThemeConfig.navSidebar,
      nav: {
        ...defaultMistConfig.navSidebar?.nav,
        ...MistThemeConfig.navSidebar?.nav,
      },
      sidebar: {
        ...defaultMistConfig.navSidebar?.sidebar,
        ...MistThemeConfig.navSidebar?.sidebar,
      },
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
