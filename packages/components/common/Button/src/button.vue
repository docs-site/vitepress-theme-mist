<script setup lang="ts" name="MtButton">
import { computed, ref } from "vue";
import { useNamespace } from "@mist/composables";
import type { ButtonOption } from "./button";

/**
 * @brief 使用命名空间工具
 * @details 为组件样式生成BEM规范的命名空间前缀
 */
const ns = useNamespace("button");

/**
 * @brief 定义组件选项
 * @details 设置组件名称为"Button"
 */
defineOptions({ name: "MtButton" });

/**
 * @brief 定义组件props
 * @details 接收ButtonOption类型的props参数
 */
const props = defineProps<ButtonOption>();

/**
 * @brief 定义组件emit
 * @details 定义组件可以触发的事件
 */
const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

/**
 * @brief 按钮元素引用
 * @details 用于获取按钮DOM元素，提供focus和blur方法
 */
const buttonRef = ref<HTMLButtonElement>();

/**
 * @brief 聚焦按钮
 * @details 调用按钮元素的focus方法
 */
const focus = () => {
  buttonRef.value?.focus();
};

/**
 * @brief 失焦按钮
 * @details 调用按钮元素的blur方法
 */
const blur = () => {
  buttonRef.value?.blur();
};

/**
 * @brief 处理点击事件
 * @details 当按钮被点击时触发click事件
 * @param {MouseEvent} event - 鼠标事件对象
 */
const handleClick = (event: MouseEvent) => {
  emit("click", event);
};

/**
 * @brief 计算按钮类名
 * @details 根据props动态生成按钮的样式类名
 */
const buttonClass = computed(() => {
  return [ns.b(), ns.m(props.type || "default"), ns.m(props.size || "default")];
});

/**
 * @brief 暴露方法给父组件
 * @details 提供focus和blur方法供外部调用
 */
defineExpose({
  focus,
  blur,
});
</script>

<template>
  <button
    ref="buttonRef"
    :class="buttonClass"
    :autofocus="autofocus"
    :type="nativeType || 'button'"
    @click="handleClick"
  >
    <span v-if="icon" :class="ns.e('icon')">
      <i :class="icon"></i>
    </span>
    <span v-if="$slots.default" :class="ns.e('content')">
      <slot></slot>
    </span>
  </button>
</template>
