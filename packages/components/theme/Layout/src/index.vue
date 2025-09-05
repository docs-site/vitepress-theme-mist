<script setup lang="ts" name="MistLayout">
import type { MistConfig } from "@mist/config";
import DefaultTheme from "vitepress/theme";
import { onMounted, useSlots, computed } from "vue";
import { useData } from "vitepress";

import { isBoolean } from "@mist/helper";
import { useNamespace } from "@mist/composables";
import { useMistConfig, usePageState } from "@mist/components/theme/ConfigProvider";
import { logMistConfigMembers, logSlotInfo } from "./debugUtils";
import { MtFooterGroup } from "@mist/components/theme/FooterGroup";
import { MtFooterInfo } from "@mist/components/theme/FooterInfo";
import { MtArticleShare } from "@mist/components/theme/ArticleShare";
import { MtThemeEnhance } from "@mist/components/theme/ThemeEnhance";
import { MtHomeUnderline } from "@mist/components/theme/HomeUnderline";
import { MtNavigationPage } from "@mist/components/theme/NavigationPage";
import { MtCataloguePage } from "@mist/components/theme/CataloguePage";
import { MtArticleAnalyze } from "@mist/components/theme/ArticleAnalyze";
import { MtCodeBlockToggle } from "@mist/components/theme/CodeBlockToggle";
import { MtCommentGiscus } from "@mist/components/theme/CommentGiscus";
import { MtDocFooterCopyright } from "@mist/components/theme/DocFooterCopyright";
import { MtRightBottomButton } from "@mist/components/theme/RightBottomButton";

import { MtClickEffect } from "@mist/components/common/ClickEffect";

const { Layout } = DefaultTheme;
const ns = useNamespace("layout");
const { getMistConfigRef } = useMistConfig();
const { isHomePage, isNavigation, isCataloguePage } = usePageState();
const { frontmatter } = useData();
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

const commentConfig = computed(() => {
  const comment = frontmatter.value.comment ?? mistConfig.value.comment;
  if (isBoolean(comment)) return { enabled: comment };

  return {
    enabled: true,
    components: {
      giscus: MtCommentGiscus,
    },
    provider: comment.provider,
    options: comment.options,
  };
});
// 维护已使用的插槽，防止外界传来的插槽覆盖已使用的插槽
const usedSlots = [
  "layout-top",
  "aside-outline-before",
  "nav-bar-content-after",
  "page-top",
  "doc-before",
  "doc-after",
  "doc-footer-before",
];
</script>

<!-- 注意：不能出现同名插槽，因为在 Vue 中如果有同名插槽，后面的插槽定义会覆盖前面的插槽定义 -->
<template>
  <template v-if="mistConfig.useTheme">
    <MtRightBottomButton>
      <!-- 通用插槽 -->
      <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
        <slot :name="name" v-bind="scope" />
      </template>
    </MtRightBottomButton>

    <Layout>
      <!-- layout-top插槽 -->
      <template #layout-top>
        <slot name="mist-click-effect-before" />
        <MtClickEffect />
        <MtHomeUnderline v-if="isHomePage" />
        <slot name="mist-click-effect-after" />
        <slot name="layout-top" />
      </template>

      <template #layout-bottom>
        <MtFooterGroup v-if="isHomePage" />
        <slot name="mist-footer-info-before" />
        <slot name="mist-footer-info">
          <MtFooterInfo v-if="isHomePage" />
        </slot>
        <slot name="mist-footer-info-after" />
        <slot name="layout-bottom" />
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
        <slot name="aside-outline-before" />
        <!-- 将插槽内容传递给vitepress -->
      </template>

      <!-- page-top插槽 - 导航页面组件 -->
      <template #page-top>
        <slot name="page-top" />
        <slot name="mist-page-top-before" />
        <MtNavigationPage v-if="isNavigation">
          <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
            <slot :name="name" v-bind="scope" />
          </template>
        </MtNavigationPage>
        <MtCataloguePage v-if="isCataloguePage">
          <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
            <slot :name="name" v-bind="scope" />
          </template>
        </MtCataloguePage>
        <slot name="mist-page-top-after" />
      </template>

      <template #doc-before>
        <slot name="doc-before" />
        <slot name="mist-article-analyze-before" />
        <MtCodeBlockToggle v-if="mistConfig.codeBlock.enabled" />
        <MtArticleAnalyze />
        <slot name="mist-article-analyze-after" />
      </template>

      <template #doc-after>
        <slot name="doc-after" />
        <slot name="mist-comment-before" />
        <!-- 评论区 -->
        <template v-if="commentConfig.enabled && commentConfig.provider">
          <template v-if="commentConfig.provider === 'render'"><slot name="mist-comment" /></template>
          <component
            v-else
            :is="commentConfig.components?.[commentConfig.provider]"
            :id="`${ns.namespace}-comment`"
            :class="ns.e('comment')"
          />
        </template>

        <slot name="mist-comment-after" />
      </template>

      <!-- doc-footer-before插槽 -->
      <template #doc-footer-before>
        <slot name="doc-footer-before" />
        <MtDocFooterCopyright />
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
