<script setup lang="ts" name="Helper">
import { questionFilledIcon } from "@mist/static";
import { MtIcon } from "@mist/components/common/Icon";
import { MtPopover } from "@mist/components/common/Popover";
import { ns } from "../namespace";
import { ref, watch } from "vue";

defineOptions({ name: "Helper" });

defineProps<{ triggerEl?: HTMLDivElement }>();

const visible = defineModel({ default: false });

const popoverVisible = ref(visible.value);

watch(popoverVisible, newVal => {
  visible.value = newVal;
});
</script>

<template>
  <MtPopover :class="ns.e('helper')" v-model="popoverVisible" :trigger-el placement="left-start">
    <template #reference>
      <MtIcon :icon="questionFilledIcon" :size="16" />
    </template>
    <div :class="ns.e('helper__popup')">
      <slot />
    </div>
  </MtPopover>
</template>
