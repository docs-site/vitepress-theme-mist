import DefaultTheme from "vitepress/theme";

import { 
  MtDataLoader, // MtDataLoader组件
  MtBackTop,    // MtBackTop组件
} from "@mist/components";

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
