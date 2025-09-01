<script setup lang="ts" name="RightBottomButton">
import type { BackTop, MistConfig, ThemeEnhance, ToComment } from "@mist/config";
import { computed } from "vue";
import { useData } from "vitepress";
import { isBoolean } from "@mist/helper";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { mobileMaxWidthMedia } from "@mist/components/theme/ThemeEnhance";
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

  return { enabled: true, provider: comment.provider };
});

const isMobile = useMediaQuery(mobileMaxWidthMedia);
const disabledThemeColor = computed(() => {
  const { enabled = true, themeColor = {}, position = "top" } = themeEnhanceConfig.value;
  const isDisabled = themeColor.disabled ?? themeColor.disabledInMobile;

  // 如果全局禁用主题增强功能，则禁用主题颜色，其次判断是否局部禁用主题颜色功能，最后默认移动端启用主题颜色功能
  if (!enabled) return true;
  if (isDisabled !== undefined) return isDisabled;
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

    <ToCommentComponent v-if="toCommentConfig.enabled && commentConfig.enabled && commentConfig.provider">
      <template #default="scope">
        <slot name="mist-to-comment" v-bind="scope" />
      </template>
    </ToCommentComponent>

    <ThemeColorComponent v-if="!disabledThemeColor" />

    <slot name="mist-right-bottom-after" />
  </div>
</template>
