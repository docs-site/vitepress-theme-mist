import DefaultTheme from "vitepress/theme";
import "../theme-chalk/src/index.scss";
export type DefaultThemeType = typeof DefaultTheme;

export default {
  extends: DefaultTheme,
  Layout: DefaultTheme.Layout,
  enhanceApp({ app, siteData }) {
    console.log('vitepress-theme-mist enhanceApp called!');// 正式发布时可能会被自动删除
  },
} as DefaultThemeType & { extends: DefaultThemeType };
