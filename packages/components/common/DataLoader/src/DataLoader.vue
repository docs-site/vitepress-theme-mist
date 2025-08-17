<script setup lang="ts" name="DataLoader">
import { useData } from 'vitepress'
import { useNamespace } from "@mist/composables";

const { site, page } = useData()
const siteData = site.value
const pageData = page.value

const ns = useNamespace("data-loader"); // 使用 useNamespace 创建一个命名空间，方便后续样式的使用
</script>

<template>
  <div :class="ns.b()"> <!-- class="mt-data-loader" -->
    <p>页面数据:</p>
    <pre :class="ns.e('pre')">{{ JSON.stringify(pageData, null, 2) }}</pre> <!-- class="mt-data-loader__pre" -->

    <p>站点数据:</p>
    <pre :class="ns.e('pre')">{{ JSON.stringify(siteData, null, 2) }}</pre>
  </div>
</template>

<!-- 移动到 packages/theme-chalk/src/components/common/data-loader.scss 中实现 -->
<!-- 
<style scoped>
.mt-data-loader {
  border: 1px solid #eee;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  font-size: 0.8rem;
}
.mt-data-loader__pre {
  background: #f5f5f5;
  padding: 0.5rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.8rem;
}
</style>
-->
