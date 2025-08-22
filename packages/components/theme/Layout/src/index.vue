<script setup lang="ts" name="MistLayout">
import type { MistConfig } from "@mist/config";
import DefaultTheme from "vitepress/theme";
import { onMounted, useSlots } from 'vue';

import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { debugConfig, logMistConfigMembers, logSlotInfo, slotConfigs } from './debugUtils';


const { Layout } = DefaultTheme;
const { getMistConfigRef } = useMistConfig();
const slots = useSlots();

// 支持 provide、frontmatter.tk、frontmatter、theme 配置
const mistConfig = getMistConfigRef<Required<MistConfig>>(null, {
  useTheme: true,
});

// 在组件挂载后打印 mistConfig 成员和插槽信息
onMounted(() => {
  logMistConfigMembers(mistConfig);
  logSlotInfo(slots);
});

</script>

<template>
  <Layout>
    <!-- 插槽调试 -->
    <template v-for="(slot, name) in slotConfigs" #[name] :key="name">
        <div v-if="debugConfig.showSlots || slot.enabled" :style="`color: ${slot.color}`">
          <!-- {{ console.log('Rendering slot:', name, 'enabled:', slot.enabled, 'color:', slot.color) }} -->
          #{{ name }}
        </div>
    </template>
  </Layout>
</template>
