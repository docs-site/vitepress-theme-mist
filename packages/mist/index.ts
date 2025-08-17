import DefaultTheme from "vitepress/theme";

import { MtDataLoader } from "@mist/components"; // MtDataLoader组件导入
import { MtBackTop } from "@mist/components";    // MtBackTop组件导入

import "../theme-chalk/src/index.scss";

export type DefaultThemeType = typeof DefaultTheme;
export type * from "@mist/config";

export * from "@mist/components";

export default {
  extends: DefaultTheme,
  Layout: DefaultTheme.Layout,
  enhanceApp({ app, siteData }) {
    console.log('vitepress-theme-mist enhanceApp called!');// 正式发布时可能会被自动删除
    app.component("MtDataLoader", MtDataLoader);
    app.component("MtBackTop", MtBackTop);
  },
} as DefaultThemeType & { extends: DefaultThemeType };
