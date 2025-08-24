<script setup lang="ts" name="ThemeEnhance">
import type { ThemeEnhance } from "@mist/config";
import { computed } from "vue";
import { readingIcon } from "@mist/static/icons";
import { useMediaQuery } from "@mist/composables";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { MtIcon } from "@mist/components/common/Icon";
import { MtPopover } from "@mist/components/common/Popover";
import { ns } from "./namespace";
import { mobileMaxWidthMedia } from "./themeEnhance";
import LayoutSwitch from "./LayoutSwitch.vue";
import LayoutPageWidthSlide from "./LayoutPageWidthSlide.vue";
import LayoutDocWidthSlide from "./LayoutDocWidthSlide.vue";
import ThemeColor from "./ThemeColor.vue";
defineOptions({ name: "ThemeEnhance" });

const { getMistConfigRef } = useMistConfig();
const themeEnhanceConfig = getMistConfigRef<ThemeEnhance>("themeEnhance", { position: "top" });
const isMobile = useMediaQuery(mobileMaxWidthMedia);
const disabledList = computed(() => {
  return {
    layoutSwitch: themeEnhanceConfig.value.layoutSwitch?.disabled ?? false,
    themeColor: themeEnhanceConfig.value.themeColor?.disabled ?? false,
  };
});
</script>

<template>
  <MtPopover
    v-if="!isMobile && themeEnhanceConfig.position === 'top'"
    :class="[ns.b(), 'flx-align-center']"
    :popper-class="ns.e('popover')"
    :y-offset="-15"
  >
    <template #reference>
      <MtIcon :icon="readingIcon" :size="20" />
    </template>
    <div :class="ns.e('content')">

      <template v-if="!disabledList.layoutSwitch">
        <LayoutSwitch />
        <LayoutPageWidthSlide />
        <LayoutDocWidthSlide />
      </template>

      <template v-if="!disabledList.themeColor">
        <ThemeColor />
      </template>
    </div>
  </MtPopover>
</template>
