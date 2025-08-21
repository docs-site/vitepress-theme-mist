import DefaultTheme from "vitepress/theme";

import { 
  MtBackTop,    // MtBackTop组件
  MtDemoCode,
  MistConfigProvider,
  MtLayout,
} from "@mist/components";

import "../theme-chalk/src/index.scss";

// 引入社交图标库
import "@mist/static/iconfont/social/iconfont.js";
import "@mist/static/iconfont/social/iconfont.css";

export type DefaultThemeType = typeof DefaultTheme;
export type * from "@mist/config";

export * from "@mist/static";
export * from "@mist/components";

export default {
  extends: DefaultTheme,
  Layout: MistConfigProvider(MtLayout),
  enhanceApp({ app, siteData }) {
    console.log('vitepress-theme-mist enhanceApp called!');// 正式发布时可能会被自动删除
    app.component("MtBackTop", MtBackTop);
    app.component("MtDemoCode", MtDemoCode);
  },
} as DefaultThemeType & { extends: DefaultThemeType };
