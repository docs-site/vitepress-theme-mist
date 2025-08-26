<script setup lang="ts" name="BackTop">
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { useNamespace } from "@mist/composables";
import type { BackTopOption } from "./BackTop";

/**
 * @brief 使用命名空间工具
 * @details 为组件样式生成BEM规范的命名空间前缀
 */
const ns = useNamespace("back-top");

/**
 * @brief 定义组件选项
 * @details 设置组件名称为"BackTop"
 * @note 注意：prop名称必须与组件定义一致(minScrollY)，Vue会自动将kebab-case转换为camelCase
 * @example
 * // 基本使用
 * <BackTop />
 *
 * // 自定义滚动阈值 (模板中使用kebab-case)
 * // 冒号(:)是v-bind的简写，表示动态绑定属性值
 * <BackTop :min-scroll-y="200" />
 *
 * // 或者在JSX中使用camelCase
 * // JSX中直接使用表达式不需要冒号
 * <BackTop minScrollY={200} />
 *
 * // 在Markdown文档中的使用示例
 * ```html
 * <BackTop :min-scroll-y="300" />  <!-- 正确 -->
 * <BackTop :aaa="300" />           <!-- 错误，不会生效 -->
 * ```
 */
defineOptions({ name: "BackTop" });

/**
 * @brief 定义组件props
 * @details 接收BackTopOption类型的props参数
 * @example
 * // 接收props示例
 * const props = defineProps<{
 *   minScrollY?: number | string
 * }>();
 */
const props = defineProps<BackTopOption>();

/**
 * @brief 计算最小滚动距离
 * @details 处理props.minScrollY的多种输入情况，确保返回数字类型的像素值
 * @param {number|string|undefined} props.minScrollY - 从props接收的滚动距离阈值，可以是数字、字符串或未定义
 * @return {number} 处理后的最小滚动距离(px)，默认值100px
 * @note 当输入为字符串时会尝试转换为数字，无效值会返回默认值
 */
const minScrollY = computed(() => {
  const value = props.minScrollY ?? 100;
  return typeof value === "string" ? parseInt(value, 10) : value;
});

/**
 * @brief 控制返回顶部按钮显示状态
 * @details 当页面滚动超过指定距离时显示按钮
 */
const showBackTop = ref(false);

/**
 * @brief 滚动进度值
 * @details 范围0-1，表示当前滚动位置占总可滚动距离的比例
 */
const scrollProgress = ref(0);

/**
 * @brief 圆形进度条半径
 * @details 用于计算进度条的周长和绘制
 */
const radius = 42;

/**
 * @brief 计算圆形进度条周长
 * @return {number} 圆形进度条的周长
 */
const circumference = computed(() => 2 * Math.PI * radius);

/**
 * @brief 滚动到页面顶部
 * @details 使用平滑滚动效果
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/**
 * @brief 更高效的节流函数
 * @details 限制函数执行频率，避免频繁触发
 * @param {Function} fn - 需要节流的函数
 * @param {number} delay - 节流延迟时间(ms)，默认50ms
 * @return {Function} 节流后的函数
 */
function throttle(fn: Function, delay = 50) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: any[]) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}

/**
 * @brief 更新滚动进度
 * @details 计算当前滚动位置占总可滚动距离的比例
 */
const updateScrollProgress = () => {
  const { scrollY, innerHeight } = window;
  const { scrollHeight } = document.documentElement;
  const totalScroll = scrollHeight - innerHeight;
  scrollProgress.value = totalScroll > 0 ? Math.min(scrollY / totalScroll, 1) : 0;
};

/**
 * @brief 处理滚动事件
 * @details 根据滚动位置决定是否显示返回顶部按钮，并更新进度条
 */
const handleScroll = throttle(() => {
  const shouldShow = window.scrollY > minScrollY.value;
  showBackTop.value = shouldShow;
  updateScrollProgress();
});

/**
 * @brief 组件挂载钩子
 * @details 添加滚动事件监听器，并初始化滚动进度
 */
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  updateScrollProgress();
});

/**
 * @brief 组件卸载钩子
 * @details 移除滚动事件监听器
 */
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <Transition name="back-top-fade">
    <div :class="ns.b()" v-show="showBackTop">
      <svg :class="ns.e('progress-ring')" viewBox="0 0 100 100">
        <circle :class="ns.e('progress-ring-background')" cx="50" cy="50" r="42" />
        <circle
          :class="ns.e('progress-ring-circle')"
          cx="50"
          cy="50"
          r="42"
          :stroke-dashoffset="circumference - scrollProgress * circumference"
          :stroke-dasharray="circumference"
        />
      </svg>
      <div :class="ns.e('main')" title="返回顶部" @click="scrollToTop()">
        <svg :class="ns.e('icon')" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M634.847397 613.032044l-255.376295 0L379.471103 446.11443 181.752995 446.11443 511.080559 56.145741l329.327564 390.023948-205.561749 0L634.846374 613.032044 634.847397 613.032044zM634.847397 613.032044"
            fill="#FFF"
          />
          <path
            d="M379.397425 689.408549c0-22.313192 18.099217-40.399105 40.411385-40.399105l177.258123 0c22.313192 0 40.385802 18.085914 40.385802 40.399105l0 0c0 22.318308-18.072611 40.403199-40.385802 40.403199L419.80881 729.811748C397.495618 729.812771 379.397425 711.726857 379.397425 689.408549L379.397425 689.408549z"
            fill="#FFF"
          />
          <path
            d="M382.052904 817.972647c0-22.312168 18.099217-40.398082 40.411385-40.398082l177.258123 0c22.313192 0 40.385802 18.085914 40.385802 40.398082l0 0c0 22.319331-18.072611 40.404222-40.385802 40.404222L422.464289 858.376868C400.151098 858.376868 382.052904 840.291978 382.052904 817.972647L382.052904 817.972647z"
            fill="#FFF"
          />
        </svg>
      </div>
    </div>
  </Transition>
</template>

<!-- 移动到 packages/theme-chalk/src/components/common/back-top.scss 中实现 -->
<!--
<style scoped>
.back-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  z-index: 999;
}

.back-top__main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #3eaf7c;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: background-color 0.2s ease;
}

.back-top__main:hover {
  background-color: #71cda3;
}

.back-top__progress-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  z-index: 1;
}

.back-top__progress-ring-background {
  fill: none;
  stroke: rgba(62, 175, 124, 0.15);
  stroke-width: 3;
}

.back-top__progress-ring-circle {
  fill: none;
  stroke: #3eaf7c;
  stroke-width: 3;
  stroke-dasharray: 264; /* 2 * π * 42 */
  stroke-linecap: round;
  transition: stroke-dashoffset 0.15s ease-out;
}

.back-top__icon {
  width: 24px;
  height: 24px;
}

.back-top-fade-enter-active,
.back-top-fade-leave-active {
  transition: opacity 0.3s ease;
}

.back-top-fade-enter-from,
.back-top-fade-leave-to {
  opacity: 0;
}
</style>
-->
