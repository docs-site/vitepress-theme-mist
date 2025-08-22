<script setup lang="ts" name="LayoutPageWidthSlide">
import type { ThemeEnhance } from "@mist/config";
import { computed, watch } from "vue";
import { isClient } from "@mist/helper";
import { useDebounce, useStorage, useMediaQuery, useLocale } from "@mist/composables";
import { autoWidthIcon, scaleIcon } from "@mist/static";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { MtInputSlide } from "@mist/components/common/InputSlide";
import { activateMaxWidthSlideMedia, LayoutMode, mobileMaxWidthMedia } from "./themeEnhance";
import { ns, layoutModeStorageKey, pageMaxWidthSlideStorageKey, transitionName, pageMaxWidthVar } from "./namespace";
import { useAnimated } from "./useAnimated";
import BaseTemplate from "./components/BaseTemplate.vue";

defineOptions({ name: "LayoutPageWidthSlide" });

const { getMistConfigRef } = useMistConfig();
const themeEnhanceConfig = getMistConfigRef<ThemeEnhance>("themeEnhance", {});
const { t } = useLocale();

const min = computed(() => 60 * 100);
const max = computed(() => 100 * 100);

const pageMaxWidth = useStorage(
  pageMaxWidthSlideStorageKey,
  (themeEnhanceConfig.value.layoutSwitch?.defaultPageMaxWidth || 90) * 100
);
const layoutMode = useStorage(
  layoutModeStorageKey,
  themeEnhanceConfig.value.layoutSwitch?.defaultMode || LayoutMode.Original
);

const { start: startAnimated } = useAnimated();

const updatePageMaxWidth = (val: number) => {
  if (!isClient) return;
  if (!themeEnhanceConfig.value.layoutSwitch?.disableAnimation) startAnimated();

  document.body.style.setProperty(pageMaxWidthVar, `${Math.ceil(val / 100)}%`);
};

const isMobile = useMediaQuery(mobileMaxWidthMedia);
const shouldActivateMaxWidth = useMediaQuery(activateMaxWidthSlideMedia);

// 初始化会马上触发一次
watch(shouldActivateMaxWidth, () => {
  const value = typeof pageMaxWidth.value === 'number' ? pageMaxWidth.value :
                (typeof pageMaxWidth.value === 'string' ? Number(pageMaxWidth.value) :
                 (themeEnhanceConfig.value.layoutSwitch?.defaultPageMaxWidth || 90) * 100);
  updatePageMaxWidth(value);
});

const update = useDebounce(updatePageMaxWidth, 1000);
watch(pageMaxWidth, update);

const format = (val: number) => `${Math.ceil(val / 100)}%`;

const tips = [
  {
    title: t("mt.themeEnhance.pageLayoutMaxWidth.helpTipTitle"),
    icon: scaleIcon,
    content: t("mt.themeEnhance.pageLayoutMaxWidth.helpTipContent"),
  },
];
</script>

<template>
  <Transition :name="transitionName">
    <BaseTemplate
      v-show="layoutMode === LayoutMode.SidebarWidthAdjustableOnly || layoutMode === LayoutMode.BothWidthAdjustable"
      :icon="autoWidthIcon"
      :title="t('mt.themeEnhance.pageLayoutMaxWidth.title')"
      :helper="!themeEnhanceConfig.layoutSwitch?.disablePageMaxWidthHelp"
      :helper-desc="t('mt.themeEnhance.pageLayoutMaxWidth.helpDesc')"
      :tips
      :disabled="isMobile"
    >
      <MtInputSlide
        v-model="pageMaxWidth"
        :disabled="isMobile"
        :min
        :max
        :format
        :class="ns.e('slide')"
        :aria-label="t('mt.themeEnhance.pageLayoutMaxWidth.helperTipTitle')"
      />
    </BaseTemplate>
  </Transition>
</template>
