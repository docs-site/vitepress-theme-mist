<script setup lang="ts" name="CommentSwitch">
import type { ThemeEnhance } from "@mist/config";
import { computed } from "vue";
import { useData } from "vitepress";
import { isObject } from "@mist/helper";
import { commentIcon } from "@mist/static";
import { useLocale } from "@mist/composables";
import { mistRuntimeConfig, useMistConfig } from "@mist/components/theme/ConfigProvider";
import BaseTemplate from "./components/BaseTemplate.vue";
import Switch from "./components/Switch.vue";

defineOptions({ name: "CommentSwitch" });

const { t } = useLocale();
const { getMistConfigRef } = useMistConfig();
const themeEnhanceConfig = getMistConfigRef<ThemeEnhance>("themeEnhance", {});
const { theme } = useData();

// 静态评论配置（theme 层），重新开启评论区时优先还原该配置
const staticComment = computed(() => theme.value.comment);

// 评论区开关状态：配置了评论提供者时视为开启，切换后实时加载或卸载评论区
const commentEnabled = computed({
  get: () => {
    const comment = mistRuntimeConfig.value.comment ?? staticComment.value;
    return isObject(comment) && !!comment.provider;
  },
  set: (value: boolean) => {
    mistRuntimeConfig.value.comment = value
      ? isObject(staticComment.value) && staticComment.value.provider
        ? staticComment.value
        : // 未配置静态评论时，回退到 Giscus 评论提供者
          { provider: "giscus", options: {} }
      : false;
  },
});
</script>

<template>
  <BaseTemplate
    :icon="commentIcon"
    :title="t('mt.themeEnhance.comment.title')"
    :helper="!themeEnhanceConfig.comment?.disableHelp"
    :helper-desc="t('mt.themeEnhance.comment.helpDesc')"
    :border-highlight="false"
  >
    <div class="flx-justify-between flx-align-center">
      <span>{{ t("mt.themeEnhance.comment.label") }}</span>
      <Switch v-model="commentEnabled" />
    </div>
  </BaseTemplate>
</template>
