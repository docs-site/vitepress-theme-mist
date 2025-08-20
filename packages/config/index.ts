// myThemeConfig.ts
import type { DefaultTheme, UserConfig } from "vitepress";
import type { MistConfig } from "./types";
// import type { PluginOption } from "vite";

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
export const defineMistConfig = (config: MistConfig & UserConfig<DefaultTheme.Config> = {}): UserConfig => {
  // 获取用户的配置，进行逻辑处理
  const { useTheme = true, ...themeConfig } = config;

  if (!useTheme) return {};

  return {
    // ignoreDeadLinks 默认值修改为 true，当用户在 VitePress 手动改为 false 才为 false
    ignoreDeadLinks: true,
    // 添加主题需要的 head 信息
    head: [],
    vite: {
      // 添加主题需要的 Vite 插件
      plugins: [],
    },
    themeConfig: {
      logo: '/favicon.svg', // 导航栏标题的logo
      footer: {
        message: '莫道桑榆晚, 为霞尚满天.',
        copyright: 'Copyright © 2019-present 苏木'
      },
      ...themeConfig.themeConfig // 合并用户传入的themeConfig
    }
  };
};
