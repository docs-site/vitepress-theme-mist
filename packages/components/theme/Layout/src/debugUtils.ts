import type { Ref } from 'vue';
import type { MistConfig } from "@mist/config";
import { ref } from 'vue';

// 调试配置对象
export const debugConfig = ref({
  showMistConfig: false, // 是否启用调试模式
  usableSlots: false,   // 是否在控制台显示所有可用的插槽
});

// 打印 mistConfig 所有成员的方法
export const logMistConfigMembers = (mistConfig: Ref<Required<MistConfig> | null>) => {
  // 如果 debugConfig.enabled 为 false，则不执行打印操作
  if (!debugConfig.value.showMistConfig) return;
  
  console.log('--- mistConfig all members ---');
  
  if (mistConfig.value) {
    const keyNames = Object.keys(mistConfig.value);
    const keyValue = Object.entries(mistConfig.value);
    console.log('mistConfig object:', mistConfig.value);
    console.log('mistConfig object key:', keyNames);
    console.log('mistConfig object value:', keyValue);
  } else {
    console.log('mistConfig is empty, no available configuration information');
  }
};

// 打印插槽信息的方法
export const logSlotInfo = (slots: any) => {
  // 如果 debugConfig.showSlots 为 false，则不执行打印操作
  if (!debugConfig.value.usableSlots) return;

  console.log('--- available slot info ---');
  if (slots) {
    const slotNames = Object.keys(slots);
    console.log('slot total num:', slotNames.length);
    console.log('slot name list:', slotNames);
  } else {
    console.log('No available slots were found!');
  }
};

// 使用插槽调试示例：
/* .vitepress/theme/components/MistLayoutProvider.vue
<script setup lang="ts" name="MistLayoutProvider">
import Mist from "vitepress-theme-mist";
import { ref } from 'vue';

// 调试配置对象
const debugConfig = ref({
  showMistConfig: false, // 是否启用调试模式
});
// 插槽配置对象
export const slotConfigs = ref({
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
  <Mist.Layout>
    <!-- 自定义内容 -->
    <template v-for="(slot, name) in slotConfigs" #[name] :key="name">
        <div v-if="debugConfig.showMistConfig || slot.enabled" :style="`color: ${slot.color}`">
          <!-- {{ console.log('Rendering slot:', name, 'enabled:', slot.enabled, 'color:', slot.color) }} -->
          #{{ name }}
        </div>
    </template>
  </Mist.Layout>
</template>
*/
