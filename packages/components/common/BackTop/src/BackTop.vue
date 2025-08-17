<script setup lang="ts" name="BackTop">
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { useNamespace } from "@mist/composables";

const ns = useNamespace("back-top");

const showBackTop = ref(false); // 初始状态设为false
const scrollProgress = ref(0);

// 圆形进度条计算
const radius = 42;
const circumference = computed(() => 2 * Math.PI * radius);

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// 使用更高效的节流函数
function throttle(fn: Function, delay = 50) {
  let timer: number | null = null;
  return function(this: any, ...args: any[]) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}

const updateScrollProgress = () => {
  const { scrollY, innerHeight } = window;
  const { scrollHeight } = document.documentElement;
  const totalScroll = scrollHeight - innerHeight;
  scrollProgress.value = totalScroll > 0 ? Math.min(scrollY / totalScroll, 1) : 0;
};

const handleScroll = throttle(() => {
  // 当滚动超过100px时显示，否则隐藏
  const shouldShow = window.scrollY > 100;
  showBackTop.value = shouldShow;
  updateScrollProgress();
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  updateScrollProgress();
});

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
          :stroke-dashoffset="circumference - (scrollProgress * circumference)"
          :stroke-dasharray="circumference"
        />
      </svg>
      <div
        :class="ns.e('main')"
        title="返回顶部"
        @click="scrollToTop()"
      >
        <svg :class="ns.e('icon')" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path d="M634.847397 613.032044l-255.376295 0L379.471103 446.11443 181.752995 446.11443 511.080559 56.145741l329.327564 390.023948-205.561749 0L634.846374 613.032044 634.847397 613.032044zM634.847397 613.032044" fill="#FFF"/>
          <path d="M379.397425 689.408549c0-22.313192 18.099217-40.399105 40.411385-40.399105l177.258123 0c22.313192 0 40.385802 18.085914 40.385802 40.399105l0 0c0 22.318308-18.072611 40.403199-40.385802 40.403199L419.80881 729.811748C397.495618 729.812771 379.397425 711.726857 379.397425 689.408549L379.397425 689.408549z" fill="#FFF"/>
          <path d="M382.052904 817.972647c0-22.312168 18.099217-40.398082 40.411385-40.398082l177.258123 0c22.313192 0 40.385802 18.085914 40.385802 40.398082l0 0c0 22.319331-18.072611 40.404222-40.385802 40.404222L422.464289 858.376868C400.151098 858.376868 382.052904 840.291978 382.052904 817.972647L382.052904 817.972647z" fill="#FFF"/>
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
