<script setup lang="ts" name="MistLayout">
import type { MistConfig } from "@mist/config";
import DefaultTheme from "vitepress/theme";
import { onMounted, useSlots } from 'vue';

import { useMistConfig, usePageState } from "@mist/components/theme/ConfigProvider";
import { logMistConfigMembers, logSlotInfo } from './debugUtils';
import { MtArticleShare } from "@mist/components/theme/ArticleShare";
import { MtThemeEnhance } from "@mist/components/theme/ThemeEnhance";
import { MtHomeUnderline } from "@mist/components/theme/HomeUnderline";

import { MtBackTop } from "@mist/components/common/BackTop";
import { MtClickEffect } from "@mist/components/common/ClickEffect";

const { Layout } = DefaultTheme;
const { getMistConfigRef } = useMistConfig();
const { isHomePage } = usePageState();
// useSlots() 只返回直接传递的插槽(也就是.vitepress/theme/components/MistLayoutProvider.vue)传递过来的，
// 而 $slots 包含所有可用的插槽。
const slots = useSlots();

// 支持 provide、frontmatter.mt、frontmatter、theme 配置
const mistConfig = getMistConfigRef<Required<MistConfig>>(null, {
  useTheme: true,
});

// 在组件挂载后打印 mistConfig 成员和插槽信息
onMounted(() => {
  logMistConfigMembers(mistConfig);
  logSlotInfo(slots);
});

// 维护已使用的插槽，防止外界传来的插槽覆盖已使用的插槽
const usedSlots = [
  "layout-top",
  "aside-outline-before",
  "nav-bar-content-after",
  "doc-footer-before",
];
</script>

<!-- 注意：不能出现同名插槽，因为在 Vue 中如果有同名插槽，后面的插槽定义会覆盖前面的插槽定义 -->
<template>
  <template v-if="mistConfig.useTheme">
    <Layout>
      <!-- layout-top插槽 -->
      <template #layout-top>
        <slot name="mist-click-effect-before" />
        <MtClickEffect />
        <MtHomeUnderline v-if=isHomePage />
        <slot name="mist-click-effect-after" />
        <slot name="layout-top" />
      </template>
      
      <template #nav-bar-content-after>
        <slot name="nav-bar-content-after" />

        <MtThemeEnhance v-if="mistConfig.themeEnhance.enabled ?? true">
          <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
            <slot :name="name" v-bind="scope" />
          </template>
        </MtThemeEnhance>
      </template>

      <template #aside-outline-before>
        <slot name="mist-article-share-before" />
        <MtArticleShare v-if="mistConfig.articleShare.enabled" />
        <slot name="mist-article-share-after" />
        <slot name="aside-outline-before" /> <!-- 将插槽内容传递给vitepress -->
      </template>
      
      <!-- doc-footer-before插槽 -->
      <template #doc-footer-before>
        <slot name="doc-footer-before" /> <!-- 将插槽内容传递给vitepress -->
        <MtBackTop />
      </template>
      
      <!-- 通过了 v-for 遍历所有 未使用 VitePress 的插槽，并使用 #[name]="slotData" 将插槽内容传递给 VitePress -->
      <template
        v-for="name in Object.keys($slots).filter(name => !usedSlots.includes(name))"
        :key="name"
        #[name]="slotData"
      >
        <slot :name="name" v-bind="slotData"></slot>
      </template>
    </Layout>
  </template>

  <template v-else>
    <Layout>
      <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData"></slot>
      </template>
    </Layout>
  </template>
</template>
