<script setup lang="ts" name="SpotlightStyle">
import type { ThemeEnhance } from "@mist/config";
import { computed } from "vue";
import { useStorage, useMediaQuery, useLocale } from "@mist/composables";
import { clickIcon, alignLeftIcon, alignTextLeftIcon } from "@mist/static";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { MtSegmented } from "@mist/components/common/Segmented";
import { SpotlightStyle, touchMedia } from "./themeEnhance";
import { spotlightStyleStorageKey, spotlightStorageKey, transitionName } from "./namespace";
import BaseTemplate from "./components/BaseTemplate.vue";

defineOptions({ name: "SpotlightStyle" });

const { getMistConfigRef } = useMistConfig();
const themeEnhanceConfig = getMistConfigRef<ThemeEnhance>("themeEnhance", {});
const { t } = useLocale();

const spotlightStyle = useStorage(
  spotlightStyleStorageKey,
  themeEnhanceConfig.value.spotlight?.defaultStyle || SpotlightStyle.Aside
);
const spotlightToggledOn = useStorage(spotlightStorageKey, themeEnhanceConfig.value.spotlight?.defaultValue ?? true);
const supportTouch = useMediaQuery(touchMedia);

const content = computed(() => [
  {
    value: SpotlightStyle.Aside,
    title: t("mt.themeEnhance.spotlightStyles.asideTipTitle"),
    helpMessage: t("mt.themeEnhance.spotlightStyles.asideHelpTipContent"),
    ariaLabel: t("mt.themeEnhance.spotlightStyles.asideTipTitle"),
    icon: alignTextLeftIcon,
  },
  {
    value: SpotlightStyle.Under,
    title: t("mt.themeEnhance.spotlightStyles.underTipTitle"),
    helpMessage: t("mt.themeEnhance.spotlightStyles.underHelpTipContent"),
    ariaLabel: t("mt.themeEnhance.spotlightStyles.underTipTitle"),
    icon: alignLeftIcon,
  },
]);

const segmentedOptions = computed(() =>
  content.value.map(item => ({
    value: item.value,
    title: item.title,
    ariaLabel: item.ariaLabel,
    icon: item.icon,
  }))
);

const tips = computed(() =>
  content.value.map(item => ({
    title: item.title,
    icon: item.icon,
    content: item.helpMessage,
  }))
);
</script>

<template>
  <Transition :name="transitionName">
    <BaseTemplate
      v-if="spotlightToggledOn"
      :icon="clickIcon"
      :title="t('mt.themeEnhance.spotlightStyles.title')"
      :helper="!themeEnhanceConfig.spotlight?.disableHelp"
      :helper-desc="t('mt.themeEnhance.spotlightStyles.helpDesc')"
      :tips
      :disabled="supportTouch"
    >
      <MtSegmented v-model="spotlightStyle" :options="segmentedOptions" :disabled="supportTouch" />
    </BaseTemplate>
  </Transition>
</template>
