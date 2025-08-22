<script setup lang="ts" name="ArticleShare">
import type { ArticleShare } from "@mist/config";
import { computed } from "vue";
import { useClipboard, useNamespace, useLocale } from "@mist/composables";
import { shareIcon, thumbsIcon } from "@mist/static";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { MtIcon } from "@mist/components/common/Icon";

defineOptions({ name: "ArticleShare" });

const ns = useNamespace("article-share");
const { t } = useLocale();

const { getMistConfigRef } = useMistConfig();
const articleShareConfig = getMistConfigRef<ArticleShare>("articleShare", {
  icon: shareIcon,
  text: t("mt.articleShare.text"),
  copiedIcon: thumbsIcon,
  copiedText: t("mt.articleShare.copiedText"),
  query: false,
  hash: false,
});

const shareLink = computed(() => {
  const { hash, query } = articleShareConfig.value;
  const { origin, pathname, search } = location;

  return `${origin}${pathname}${query ? search : ""}${hash ? location.hash : ""}`;
});

const { copy, copied } = useClipboard(2000);
</script>

<template>
  <div :class="ns.b()">
    <button
      :class="[ns.e('button'), { copied }, 'flx-center']"
      :aria-label="copied ? articleShareConfig.copiedText : articleShareConfig.text"
      aria-live="polite"
      @click="copy(shareLink)"
    >
      <div v-if="!copied" class="flx-center">
        <MtIcon :icon="shareIcon" style="margin-right: 4px" />
        {{ articleShareConfig.text }}
      </div>

      <div v-else class="flx-center">
        <MtIcon :icon="thumbsIcon" style="margin-right: 4px" />
        {{ articleShareConfig.copiedText }}
      </div>
    </button>
  </div>
</template>
