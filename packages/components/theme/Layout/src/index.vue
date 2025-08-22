<script setup lang="ts" name="MistLayout">
import type { MistConfig } from "@mist/config";
import DefaultTheme from "vitepress/theme";
import { onMounted, useSlots } from 'vue';

import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { logMistConfigMembers, logSlotInfo } from './debugUtils';
import { MtArticleShare } from "@mist/components/theme/ArticleShare";


const { Layout } = DefaultTheme;
const { getMistConfigRef } = useMistConfig();
const slots = useSlots();

// 支持 provide、frontmatter.tk、frontmatter、theme 配置
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
  "aside-outline-before",
];
</script>

<!-- 注意：不能出现同名插槽，因为在 Vue 中如果有同名插槽，后面的插槽定义会覆盖前面的插槽定义 -->
<template>
  <Layout>
    <template #aside-outline-before>
      <slot name="mist-article-share-before" />
      <MtArticleShare v-if="mistConfig.articleShare.enabled" />
      <slot name="mist-article-share-after" />
      <slot name="aside-outline-before" /> <!-- 将插槽内容传递给vitepress -->
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
