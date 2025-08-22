<script setup lang="ts" name="Title">
import type { MtIconProps } from "@mist/components/common/Icon";
import { ns } from "../namespace";
import { MtIcon } from "@mist/components/common/Icon";

defineProps<{ title?: string; disabled?: boolean; icon?: MtIconProps["icon"] }>();
</script>

<template>
  <div :class="[ns.e('title'), ns.is('disabled', !!disabled)]">
    <slot name="icon">
      <MtIcon v-if="icon" :icon="icon" :size="16" />
    </slot>

    <slot>
      <span v-if="title">{{ title }}</span>
    </slot>
  </div>
</template>
