<script setup lang="ts" name="ToComment">
import type { ToComment } from "@mist/config";
import { computed, ref } from "vue";
import { isClient } from "@mist/helper";
import { useLocale, useDebounce, useEventListener } from "@mist/composables";
import { commentIcon } from "@mist/static";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { MtMessage } from "@mist/components/common/Message";
import { MtIcon } from "@mist/components/common/Icon";
import { ns } from "./namespace";

defineOptions({ name: "ToComment" });

const { t } = useLocale();
const { getMistConfigRef } = useMistConfig();

const toCommentConfig = getMistConfigRef<ToComment>("toComment");

// 前往评论区
const scrollTop = ref(0);

const showToComment = computed(() => {
  if (!isClient) return false;

  const docContentHeight = document.querySelector(".content-container .main")?.getBoundingClientRect().height;
  const docFooterHeight = document.querySelector(".VPDocFooter")?.getBoundingClientRect().height || 200;
  let height = 0;
  if (docContentHeight) height = docContentHeight - docFooterHeight - window.innerHeight / 2;

  return scrollTop.value < height;
});

const scrollToComment = useDebounce(
  () => {
    if (!isClient) return;

    document.querySelector(`#${ns.join("comment")}`)?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      toCommentConfig.value.done?.(MtMessage);
    }, 600);
  },
  500,
  true
);

const watchScroll = () => {
  scrollTop.value = document.documentElement.scrollTop || document.body.scrollTop || 0;
};

useEventListener(() => window, "scroll", watchScroll);
</script>

<template>
  <Transition :name="ns.join('fade')">
    <slot :show="showToComment" :icon="commentIcon" :scrollToComment>
      <div
        v-show="showToComment"
        :title="t('mt.rightBottomButton.toComment')"
        :class="ns.e('button')"
        @click="scrollToComment"
        role="button"
        :aria-label="t('mt.rightBottomButton.toComment')"
      >
        <MtIcon :icon="commentIcon" aria-hidden="true" />
      </div>
    </slot>
  </Transition>
</template>
