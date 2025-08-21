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

// 插槽配置数组
const showSlotDebug = ref(false); // 默认不启用调试模式,设置为true后，所有插槽都会显示
const slotConfigs = ref([
  // layout: 'doc' (默认) 在 frontmatter 中被启用
  { enabled: false, color: '#FF0000', name: 'doc-before' },
  { enabled: false, color: '#00FF00', name: 'doc-top' },
  { enabled: false, color: '#0000FF', name: 'doc-bottom' },
  { enabled: false, color: '#FFFF00', name: 'doc-footer-before' },
  { enabled: false, color: '#FF00FF', name: 'doc-after' },
  { enabled: false, color: '#00FFFF', name: 'sidebar-nav-before' },
  { enabled: false, color: '#FFA500', name: 'sidebar-nav-after' },
  { enabled: false, color: '#800080', name: 'aside-top' },
  { enabled: false, color: '#FFC0CB', name: 'aside-bottom' },
  { enabled: false, color: '#008000', name: 'aside-outline-before' },
  { enabled: false, color: '#000080', name: 'aside-outline-after' },
  { enabled: false, color: '#800000', name: 'aside-ads-before' },
  { enabled: false, color: '#008080', name: 'aside-ads-after' },
  // layout: 'home' 在 frontmatter 中被启用
  { enabled: false, color: '#FF6347', name: 'home-hero-before' },
  { enabled: false, color: '#FF4500', name: 'home-hero-info-before' },
  { enabled: false, color: '#DA70D6', name: 'home-hero-info' },
  { enabled: false, color: '#D2691E', name: 'home-hero-info-after' },
  { enabled: false, color: '#FFD700', name: 'home-hero-actions-after' },
  { enabled: false, color: '#32CD32', name: 'home-hero-image' },
  { enabled: false, color: '#4169E1', name: 'home-hero-after' },
  { enabled: false, color: '#DC143C', name: 'home-features-before' },
  { enabled: false, color: '#00BFFF', name: 'home-features-after' },
  // layout: 'page' 在 frontmatter 中被启用
  { enabled: false, color: '#8A2BE2', name: 'page-top' },
  { enabled: false, color: '#20B2AA', name: 'page-bottom' },
  // 总是启用
  { enabled: false, color: '#FF69B4', name: 'layout-top' },
  { enabled: false, color: '#FF4500', name: 'layout-bottom' },
  { enabled: false, color: '#DA70D6', name: 'nav-bar-title-before' },
  { enabled: false, color: '#D2691E', name: 'nav-bar-title-after' },
  { enabled: false, color: '#FFD700', name: 'nav-bar-content-before' },
  { enabled: false, color: '#32CD32', name: 'nav-bar-content-after' },
  { enabled: false, color: '#4169E1', name: 'nav-screen-content-before' },
  { enabled: false, color: '#DC143C', name: 'nav-screen-content-after' }
]);

</script>

<template>
  <Layout>
    <!-- 插槽调试: 使用动态插槽遍历生成所有插槽 -->
    <template v-for="slot in slotConfigs" #[slot.name] :key="slot.name">
        <div v-if="showSlotDebug || slot.enabled" :style="`color: ${slot.color}`">
          <!-- {{ console.log('Rendering slot:', slot.name, 'enabled:', slot.enabled, 'color:', slot.color) }} -->
          #{{ slot.name }}
        </div>
    </template>
  </Layout>
</template>
