<script setup lang="ts" name="ThemeEnhance">
import type { ThemeEnhance } from "@mist/config";
import { readingIcon } from "@mist/static/icons";
import { useMediaQuery } from "@Mist/composables";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { MtIcon } from "@mist/components/common/Icon";
import { MtPopover } from "@mist/components/common/Popover";
import { ns } from "./namespace";
import { mobileMaxWidthMedia } from "./themeEnhance";
defineOptions({ name: "ThemeEnhance" });

const { getMistConfigRef } = useMistConfig();
const themeEnhanceConfig = getMistConfigRef<ThemeEnhance>("themeEnhance", { position: "top" });
const isMobile = useMediaQuery(mobileMaxWidthMedia);
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
  </MtPopover>
</template>
