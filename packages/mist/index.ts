import type { EnhanceAppContext } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { isClient } from "@mist/helper";

import { MtDemoCode, MtTitleTag, MistConfigProvider, MtLayout } from "@mist/components";

import "../theme-chalk/src/index.scss";

// 引入社交图标库
import "@mist/static/iconfont/social/iconfont.js";
import "@mist/static/iconfont/social/iconfont.css";

export type DefaultThemeType = typeof DefaultTheme;
export type * from "@mist/config";

export * from "@mist/static";
export * from "@mist/components";
export * from "@mist/composables";

export default {
  extends: DefaultTheme,
  Layout: MistConfigProvider(MtLayout),
  async enhanceApp({ app, siteData, router }) {
    app.component("MtDemoCode", MtDemoCode);
    app.component("MtTitleTag", MtTitleTag);
    if (!isClient) return;
    const { themeConfig } = siteData.value;
    // 处理永久链接导致 404 问题
    if (themeConfig.permalinks) await processPermalinkNotFoundWhenFirstLoaded({ siteData, router });
  },
} as Omit<DefaultThemeType, "enhanceApp"> & {
  extends: DefaultThemeType;
  enhanceApp: (options: EnhanceAppContext) => Promise<void>;
};

/**
 * 第一次访问页面时，处理永久链接导致 404 问题
 */
const processPermalinkNotFoundWhenFirstLoaded = async ({ siteData, router }: any) => {
  const { base, cleanUrls, themeConfig } = siteData.value;
  // 404 页面处理永久链接 404 问题（仅针对首次页面刷新）
  if (router.route.path === base && router.route.data.isNotFound) {
    const { pathname, search, hash } = new URL(location.href);
    const decodePath =
      "/" +
      decodeURIComponent(pathname.slice(base.length))
        .replace(/\/$/, "")
        .replace(/\.html/, "");

    const link = cleanUrls ? decodePath : decodePath + ".html";
    const filePath = themeConfig.permalinks.inv[link];

    // 通过永久链接获取的文件路径存在，则跳转
    if (filePath) {
      const targetUrl = base + filePath + search + hash;
      await router.go(targetUrl);
    }
  }
};
