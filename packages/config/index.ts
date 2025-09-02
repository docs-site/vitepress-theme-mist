// myThemeConfig.ts
import type { DefaultTheme, UserConfig } from "vitepress";
import type { MistConfig } from "./types";
// import type { PluginOption } from "vite";
import { demoPlugin, containerPlugin } from "../markdown";
import { registerPluginAndGet } from "./vitePlugins";
import { version } from "../../packages/mist/version";

import {
  FooterGroupConfig,
} from "./defaultConfig"
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
  // 页脚信息组配置
  footerGroup: FooterGroupConfig,
  // 页脚配置
  footerInfo: {
    // 页脚信息，支持 HTML 格式（位于主题版权上方）
    topMessage: ["莫道桑榆晚, 为霞尚满天"],
    // 页脚信息，支持 HTML 格式（位于主题版权下方）
    bottomMessage: [""],
    // 主题版权配置
    theme: {
      show: true, // 是否显示主题版权，建议显示
      name: `mist@${version}`, // 自定义名称
      link: "https://github.com/docs-site/vitepress-theme-mist", // 自定义链接
    },
    // 博客版权配置
    copyright: {
      show: true, // 是否显示博客版权
      createYear: 2025, // 创建年份
      suffix: "苏木", // 后缀
    }
  },
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
  themeEnhance: {
    enabled: true, // 启用主题增强功能
    position: "top", // 位置，top 为导航栏右侧，bottom 为右下角
    // 布局切换配置
    layoutSwitch: {
      disabled: false, // 禁用布局切换
      defaultMode: "fullWidth", // 布局切换的默认模式
      disableHelp: false, // 禁用帮助提示
      disableAnimation: false, // 禁用布局切换动画
      defaultDocMaxWidth: 90, // 内容布局最大宽度的默认百分比，仅限 0-100
      disableDocMaxWidthHelp: false, // 禁用帮助提示
      defaultPageMaxWidth: 95, // 页面布局最大宽度的默认百分比，仅限 0-100
      disablePageMaxWidthHelp: false, // 禁用帮助提示
    },
    // 布局主题色配置
    themeColor: {
      // disabled: false, // 禁用布局主题色切换
      // defaultColorName: "vp-default", // 布局默认主题色
      // defaultSpread: false, // 是否将主题色扩散到其他元素（根据主题色计算其他元素需要的颜色）
      // disableHelp: false, // 禁用帮助提示
      // disabledInMobile: false, // 是否在移动端禁用
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
        debugPrint: false,
        saveToFile: false
      },
      sideBarOption: {
        type: "object",
        ignoreList: ["index.md", "README.md"],
        initItems: false, // 这个设置为true的话进入某个导航栏路径时可能不显示侧边栏
        collapsed: true,
        debugPrint: false,
        saveToFile: false
      }
    }
  },
  docFooterCopyright: {
    enabled: true,
    author: "苏木",
    authorLink: "https://docs-site.github.io/vitepress-theme-mist/",
    pathMapping: {},
    copyrightText: "本博客所有文章除特别声明外，均采用",
    licenseName: "BY-NC-SA 4.0",
    licenseLink: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
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
    }
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
