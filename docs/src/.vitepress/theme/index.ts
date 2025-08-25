// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'

import Mist from "vitepress-theme-mist";

import MistLayoutProvider from "./components/MistLayoutProvider.vue";

import './style.css'

// 工作区本地引入
import "@mist/theme-chalk/mt-plus/fade-up-animation.scss"; // 淡入效果

export default {
  extends: Mist,
  Layout: MistLayoutProvider,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
