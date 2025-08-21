// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import './style.css'
import MistLayoutProvider from "./components/MistLayoutProvider.vue";

import Mist from "vitepress-theme-mist"; 
export default {
  extends: Mist,
  Layout: MistLayoutProvider,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
