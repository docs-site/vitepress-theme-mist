<script setup lang="ts" name="LayoutDocWidthSlide">
import type { ThemeEnhance } from "@mist/config";
import { computed, watch } from "vue";
import { isClient } from "@mist/helper";
import { useDebounce, useStorage, useMediaQuery, useLocale } from "@mist/composables";
import { autoWidthIcon, scaleIcon } from "@mist/static";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { MtInputSlide } from "@mist/components/common/InputSlide";
import { activateMaxWidthSlideMedia, LayoutMode, mobileMaxWidthMedia } from "./themeEnhance";
import { ns, layoutModeStorageKey, docMaxWidthSlideStorageKey, transitionName, docMaxWidthVar } from "./namespace";
import { useAnimated } from "./useAnimated";
import BaseTemplate from "./components/BaseTemplate.vue";

defineOptions({ name: "LayoutDocWidthSlide" });

const { getMistConfigRef } = useMistConfig();
const themeEnhanceConfig = getMistConfigRef<ThemeEnhance>("themeEnhance", {});
const { t } = useLocale();

const min = computed(() => 60 * 100);
const max = computed(() => 100 * 100);

const docMaxWidth = useStorage(
  docMaxWidthSlideStorageKey,
  (themeEnhanceConfig.value.layoutSwitch?.defaultDocMaxWidth || 95) * 100
);
const layoutMode = useStorage(
  layoutModeStorageKey,
  themeEnhanceConfig.value.layoutSwitch?.defaultMode || LayoutMode.Original
);

const { start: startAnimated } = useAnimated();

const updateMaxWidth = (val: number) => {
  if (!isClient) return;
  if (!themeEnhanceConfig.value.layoutSwitch?.disableAnimation) startAnimated();

  const bodyStyle = document.body.style;
  if (!shouldActivateMaxWidth.value) bodyStyle.setProperty(ns.join("page-max-width"), `100%`);

  bodyStyle.setProperty(docMaxWidthVar, `${Math.ceil(val / 100)}%`);
};

const isMobile = useMediaQuery(mobileMaxWidthMedia);
// 初始化会马上触发一次
const shouldActivateMaxWidth = useMediaQuery(activateMaxWidthSlideMedia);

watch(shouldActivateMaxWidth, () => {
  const value = docMaxWidth.value;
  if (typeof value === "number") {
    updateMaxWidth(value);
  }
});

const update = useDebounce(updateMaxWidth, 1000);
watch(docMaxWidth, update);

const format = (val: number) => `${Math.ceil(val / 100)}%`;

const tips = [
  {
    title: t("mt.themeEnhance.docLayoutMaxWidth.helpTipTitle"),
    icon: scaleIcon,
    content: t("mt.themeEnhance.docLayoutMaxWidth.helpTipContent"),
  },
];
</script>

<template>
  <Transition :name="transitionName">
    <BaseTemplate
      v-show="layoutMode === LayoutMode.BothWidthAdjustable"
      :icon="autoWidthIcon"
      :title="t('mt.themeEnhance.docLayoutMaxWidth.title')"
      :helper="!themeEnhanceConfig.layoutSwitch?.disableDocMaxWidthHelp"
      :helper-desc="t('mt.themeEnhance.docLayoutMaxWidth.helpDesc')"
      :tips
      :disabled="isMobile"
    >
      <MtInputSlide
        v-model="docMaxWidth"
        :disabled="isMobile"
        :min
        :max
        :format
        :class="ns.e('slide')"
        :aria-label="t('mt.themeEnhance.docLayoutMaxWidth.helperTipTitle')"
      />
    </BaseTemplate>
  </Transition>
</template>
