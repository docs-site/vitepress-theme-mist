<script setup>
import { MtTransitionCollapse } from "vitepress-theme-mist"
import { ref } from 'vue'
const show = ref(false)
</script>

<style scoped>
.preview-container {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.content {
  padding: 10px;
  background-color:rgb(199, 199, 199);
  margin-top: 10px;
}
</style>

<!-- more -->

## 简介

`MtTransitionCollapse` 是一个用于实现平滑折叠展开动画的 Vue 组件。它可以为内容区域添加展开/收起的过渡效果。

## 基本用法

在 Markdown 文档中可以直接使用 `<MtTransitionCollapse>` 标签来包装需要添加折叠动画的内容。

### 示例

下面是一个使用 `MtTransitionCollapse` 组件的简单示例：

<div class="preview-container">
  <button @click="show = !show">切换显示</button>
  <MtTransitionCollapse>
    <div v-if="show" class="content">
      这里是可折叠的内容区域。点击上面的按钮可以展开或收起这段文字。
    </div>
  </MtTransitionCollapse>
</div>


