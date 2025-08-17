// myThemeConfig.ts
import type { DefaultTheme, UserConfig } from "vitepress";
// import type { PluginOption } from "vite";

interface ThemeConfig {
  useTheme?: boolean; // 是否开启主题
  // ...
}

export default function getThemeConfig(config: ThemeConfig & UserConfig<DefaultTheme.Config> = {}): UserConfig {
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
      }
    }
  };
}
