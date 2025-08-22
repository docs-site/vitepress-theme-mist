<script setup lang="ts" name="MistLayout">
import type { MistConfig } from "@mist/config";
import DefaultTheme from "vitepress/theme";
import { ref, onMounted } from 'vue';

import { useMistConfig } from "@mist/components/theme/ConfigProvider";


const { Layout } = DefaultTheme;
const { getMistConfigRef } = useMistConfig();

// 支持 provide、frontmatter.tk、frontmatter、theme 配置
const mistConfig = getMistConfigRef<Required<MistConfig>>(null, {
  useTheme: true,
});

// 调试控制选项
const debugMode = ref(true);

// 打印 mistConfig 所有成员的方法
const logMistConfigMembers = () => {
  // 如果 debugMode 为 false，则不执行打印操作
  if (!debugMode.value) return;
  
  console.log('--- mistConfig 所有成员 ---');
  console.log('mistConfig 对象:', mistConfig.value);
  console.log('mistConfig 键名:', Object.keys(mistConfig.value));
  console.log('mistConfig 键值对:', Object.entries(mistConfig.value));
};

// 在组件挂载后打印 mistConfig 成员
onMounted(() => {
  logMistConfigMembers();
});

// 插槽配置对象
const showSlotDebug = ref(true); // 默认不启用调试模式,设置为true后，所有插槽都会显示
const slotConfigs = ref({
  // layout: 'doc' (默认) 在 frontmatter 中被启用
  'doc-before': { enabled: false, color: '#FF0000' },
  'doc-top': { enabled: false, color: '#00FF00' },
  'doc-bottom': { enabled: false, color: '#0000FF' },
  'doc-footer-before': { enabled: false, color: '#FFFF00' },
  'doc-after': { enabled: false, color: '#FF00FF' },
  'sidebar-nav-before': { enabled: false, color: '#00FFFF' },
  'sidebar-nav-after': { enabled: false, color: '#FFA500' },
  'aside-top': { enabled: false, color: '#800080' },
  'aside-bottom': { enabled: false, color: '#FFC0CB' },
  'aside-outline-before': { enabled: false, color: '#008000' },
  'aside-outline-after': { enabled: false, color: '#000080' },
  'aside-ads-before': { enabled: false, color: '#800000' },
  'aside-ads-after': { enabled: false, color: '#008080' },
  // layout: 'home' 在 frontmatter 中被启用
  'home-hero-before': { enabled: false, color: '#FF6347' },
  'home-hero-info-before': { enabled: false, color: '#FF4500' },
  'home-hero-info': { enabled: false, color: '#DA70D6' },
  'home-hero-info-after': { enabled: false, color: '#D2691E' },
  'home-hero-actions-after': { enabled: false, color: '#FFD700' },
  'home-hero-image': { enabled: false, color: '#32CD32' },
  'home-hero-after': { enabled: false, color: '#4169E1' },
  'home-features-before': { enabled: false, color: '#DC143C' },
  'home-features-after': { enabled: false, color: '#00BFFF' },
  // layout: 'page' 在 frontmatter 中被启用
  'page-top': { enabled: false, color: '#8A2BE2' },
  'page-bottom': { enabled: false, color: '#20B2AA' },
  // 总是启用
  'layout-top': { enabled: false, color: '#FF69B4' },
  'layout-bottom': { enabled: false, color: '#FF4500' },
  'nav-bar-title-before': { enabled: false, color: '#DA70D6' },
  'nav-bar-title-after': { enabled: false, color: '#D2691E' },
  'nav-bar-content-before': { enabled: false, color: '#FFD700' },
  'nav-bar-content-after': { enabled: false, color: '#32CD32' },
  'nav-screen-content-before': { enabled: false, color: '#4169E1' },
  'nav-screen-content-after': { enabled: false, color: '#DC143C' }
});

</script>

<template>
  <Layout>
    <!-- 插槽调试 -->
    <template v-for="(slot, name) in slotConfigs" #[name] :key="name">
        <div v-if="showSlotDebug || slot.enabled" :style="`color: ${slot.color}`">
          <!-- {{ console.log('Rendering slot:', name, 'enabled:', slot.enabled, 'color:', slot.color) }} -->
          #{{ name }}
        </div>
    </template>
  </Layout>
</template>
