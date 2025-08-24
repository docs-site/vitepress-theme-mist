<script setup lang="ts">
import { MtIcon } from "@mist/components/common/Icon";
import { arrowDownIcon } from "@mist/static";

const emits = defineEmits<{ click: [] }>();

const onClick = () => emits("click");
</script>

<template>
  <div class="code-block-overlay" @click="onClick">
    <!-- <span>查看更多</span> -->
    <MtIcon class="overlay-icon" :icon="arrowDownIcon" />
  </div>
</template>
