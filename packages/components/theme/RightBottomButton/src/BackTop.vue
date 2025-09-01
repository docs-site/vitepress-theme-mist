<script setup lang="ts" name="BackTop">
import type { BackTop } from "@mist/config";
import { computed, onMounted, ref } from "vue";
import { isClient } from "@mist/helper";
import { useLocale, useDebounce, useEventListener } from "@mist/composables";
import { rocketIcon } from "@mist/static";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { MtMessage } from "@mist/components/common/Message";
import { MtIcon } from "@mist/components/common/Icon";
import { ns } from "./namespace";

defineOptions({ name: "BackTop" });

const { t } = useLocale();

const { getMistConfigRef } = useMistConfig();
const backTopConfig = getMistConfigRef<BackTop>("backTop", {
  enabled: true,
  content: "progress",
});

// 返回顶部 & 前往评论区
const scrollTop = ref(0);
const showToTop = computed(() => scrollTop.value > 100);
const progress = ref(0);

const scrollToTop = useDebounce(
  () => {
    if (!isClient) return;

    document.querySelector("html")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      backTopConfig.value.done?.(MtMessage);
    }, 600);
  },
  500,
  true
);

const watchScroll = () => {
  scrollTop.value = document.documentElement.scrollTop || document.body.scrollTop || 0;
  updateScrollProgress();
};

/**
 * 更新返回顶部的进度条
 */
const updateScrollProgress = () => {
  const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  progress.value = Math.round(p * 100);
};

onMounted(() => {
  updateScrollProgress();
});

useEventListener(() => window, "scroll", watchScroll);
</script>

<template>
  <Transition :name="ns.join('fade')">
    <slot :show="showToTop" :progress="progress" :icon="rocketIcon" :scrollToTop="scrollToTop">
      <div
        v-show="showToTop"
        :title="t('mt.rightBottomButton.backTopTitle')"
        :class="[ns.e('button'), 'back-top']"
        @click="scrollToTop"
        :style="{ [ns.cssVarName('progress')]: progress }"
        role="button"
        :aria-label="t('mt.rightBottomButton.backTopTitle')"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <template v-if="backTopConfig.content === 'progress'">
          <span class="content">{{ progress }}</span>
        </template>
        <MtIcon v-else-if="backTopConfig.content === 'icon'" :icon="rocketIcon" aria-hidden="true" />
      </div>
    </slot>
  </Transition>
</template>
