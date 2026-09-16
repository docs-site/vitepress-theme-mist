<script setup lang="ts" name="RightBottomButton">
import type { BackTop, MistConfig, ThemeEnhance, ToComment } from "@mist/config";
import { computed, inject } from "vue";
import { useData } from "vitepress";
import { isBoolean } from "@mist/helper";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { mobileMaxWidthMedia } from "@mist/components/theme/ThemeEnhance";
import { giscusContext } from "@mist/components/theme/CommentGiscus";
import { useMediaQuery } from "@mist/composables";
import { ns } from "./namespace";
import BackTopComponent from "./BackTop.vue";
import ToCommentComponent from "./ToComment.vue";
import ThemeColorComponent from "./ThemeColor.vue";

defineOptions({ name: "RightBottomButton" });

const { getMistConfigRef } = useMistConfig();
const backTopConfig = getMistConfigRef<BackTop>("backTop", { enabled: true });
const toCommentConfig = getMistConfigRef<ToComment>("toComment", { enabled: true });
const themeEnhanceConfig = getMistConfigRef<ThemeEnhance>("themeEnhance", { enabled: true });
const mistConfig = getMistConfigRef<Required<MistConfig>>(null, { comment: { provider: "" } });
const { frontmatter } = useData();

const commentConfig = computed(() => {
  const comment = frontmatter.value.comment ?? mistConfig.value.comment;
  if (isBoolean(comment)) return { enabled: comment };

  // 评论区组件通过实例注入方式使用时，无 provider 配置也应视为启用
  const getGiscusInstance = inject(giscusContext, null);
  if (getGiscusInstance) return { enabled: true };

  return { enabled: true, provider: comment.provider };
});

const isMobile = useMediaQuery(mobileMaxWidthMedia);
const disabledThemeColor = computed(() => {
  const { enabled = true, themeColor = {}, position = "top" } = themeEnhanceConfig.value;

  // 如果全局禁用主题增强功能或明确禁用主题颜色，则直接禁用；disabledInMobile 仅在移动端生效，避免覆盖桌面端的启用状态
  if (!enabled || themeColor.disabled) return true;
  if (isMobile.value && themeColor.disabledInMobile !== undefined) return themeColor.disabledInMobile;
  return !isMobile.value && position === "top";
});
</script>

<template>
  <div :class="[ns.b(), ns.join('wallpaper-outside'), 'flx-column']">
    <slot name="mist-right-bottom-before" />

    <BackTopComponent v-if="backTopConfig.enabled">
      <template #default="scope">
        <slot name="mist-back-top" v-bind="scope" />
      </template>
    </BackTopComponent>

    <ToCommentComponent v-if="toCommentConfig.enabled && (commentConfig.enabled || commentConfig.provider)">
      <template #default="scope">
        <slot name="mist-to-comment" v-bind="scope" />
      </template>
    </ToCommentComponent>

    <ThemeColorComponent v-if="!disabledThemeColor" />

    <slot name="mist-right-bottom-after" />
  </div>
</template>
