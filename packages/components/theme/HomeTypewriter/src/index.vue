<script setup lang="ts" name="HomeTypewriter">
import { computed, onMounted } from "vue";
import { useNamespace } from "@mist/composables";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { useTextTypes } from "@mist/composables";
import type { HomeTypewriter } from "@mist/config";

const ns = useNamespace("home-typewriter");

const { getMistConfigRef } = useMistConfig();
// 打字机配置项
const typewriterConfig = getMistConfigRef<Required<HomeTypewriter>>("homeTypewriter", {
  enabled: false,
  texts: [],
  inputTime: 200,
  outputTime: 100,
  nextTime: 800,
  shuffle: false,
});

// 去除空文案并去重
const texts = computed(() => [...new Set(typewriterConfig.value.texts.filter((v: string) => !!v))]);

// 文字打印输入输出效果
const { text, isFinished, start } = useTextTypes(texts, {
  inputTime: typewriterConfig.value.inputTime,
  outputTime: typewriterConfig.value.outputTime,
  nextTime: typewriterConfig.value.nextTime,
  shuffle: typewriterConfig.value.shuffle,
});

onMounted(() => {
  if (typewriterConfig.value.enabled && texts.value.length) start();
});
</script>

<template>
  <div v-if="typewriterConfig.enabled && texts.length" :class="ns.b()" aria-label="typewriter">
    <span :class="ns.e('text')">{{ text }}</span>
    <span :class="[ns.e('cursor'), ns.is('animation', isFinished)]">|</span>
  </div>
</template>
