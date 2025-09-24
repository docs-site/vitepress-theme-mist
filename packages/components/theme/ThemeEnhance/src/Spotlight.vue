<script setup lang="ts" name="Spotlight">
import type { ThemeEnhance } from "@mist/config";
import { computed, ref, watch } from "vue";
import { useData } from "vitepress";
import { useStorage, useMediaQuery, useLocale } from "@mist/composables";
import { clickIcon } from "@mist/static";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { MtSegmented } from "@mist/components/common/Segmented";
import { touchMedia } from "./themeEnhance";
import { spotlightStorageKey } from "./namespace";
import BaseTemplate from "./components/BaseTemplate.vue";
import SpotlightHover from "./components/SpotlightHover.vue";

defineOptions({ name: "Spotlight" });

const { getMistConfigRef } = useMistConfig();
const themeEnhanceConfig = getMistConfigRef<ThemeEnhance>("themeEnhance", {});
const { t } = useLocale();
const { frontmatter } = useData();

const supportTouch = useMediaQuery(touchMedia);

const spotlight = useStorage(spotlightStorageKey, themeEnhanceConfig.value.spotlight?.defaultValue ?? true);
const oldSpotlight = ref(spotlight.value);

// 文章单独设置是否使用聚光灯
watch(
  () => frontmatter.value.spotlight,
  newVal => {
    if (newVal !== undefined) {
      oldSpotlight.value = spotlight.value;
      spotlight.value = newVal;
    } else {
      // 还原
      spotlight.value = oldSpotlight.value;
    }
  },
  { immediate: true }
);

const segmentedOptions = computed(() => [
  {
    value: true,
    label: "ON",
    title: t("mt.themeEnhance.spotlight.onTipTitle"),
    ariaLabel: t("mt.themeEnhance.spotlight.onTipTitle"),
  },
  {
    value: false,
    label: "OFF",
    title: t("mt.themeEnhance.spotlight.offTipTitle"),
    ariaLabel: t("mt.themeEnhance.spotlight.offTipTitle"),
  },
]);

const tips = [
  {
    title: `ON ${t("mt.themeEnhance.spotlight.onTipTitle")}`,
    content: t("mt.themeEnhance.spotlight.onHelpTipContent"),
  },
  {
    title: `OFF ${t("mt.themeEnhance.spotlight.offTipTitle")}`,
    content: t("mt.themeEnhance.spotlight.offHelpTipContent"),
  },
];
</script>

<template>
  <BaseTemplate
    :icon="clickIcon"
    :title="t('mt.themeEnhance.spotlight.title')"
    :helper="!themeEnhanceConfig.spotlight?.disableHelp"
    :helper-desc="t('mt.themeEnhance.spotlight.helpDesc')"
    :tips
    :disabled="supportTouch"
  >
    <MtSegmented v-model="spotlight" :options="segmentedOptions" :disabled="supportTouch" />
  </BaseTemplate>

  <SpotlightHover v-if="spotlight && !supportTouch" :enabled="spotlight && !supportTouch" />
</template>
