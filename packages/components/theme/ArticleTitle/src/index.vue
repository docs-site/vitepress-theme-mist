<script setup lang="ts" name="ArticleTitle">
import type { MtContentData } from "@mist/config";
import type { MtTitleTagProps } from "@mist/components/common/TitleTag";
import { useNamespace, useLocale } from "@mist/composables";
import { MtTitleTag } from "@mist/components/common/TitleTag";
import { createDynamicComponent } from "./compile";

defineOptions({ name: "ArticleTitle" });

defineProps<{ post: MtContentData; titleTagProps?: MtTitleTagProps }>();

const ns = useNamespace("article-title");
const { t } = useLocale();
</script>

<template>
  <span :class="ns.b()" :aria-label="t('mt.articleTitle.label')">
    <MtTitleTag
      v-if="post.frontmatter.titleTag && titleTagProps?.position === 'left'"
      :text="post.frontmatter.titleTag"
      v-bind="titleTagProps"
      :aria-label="post.frontmatter.titleTag"
    />

    <slot>
      <component v-if="post.title" :is="createDynamicComponent(post.title)" />
    </slot>

    <MtTitleTag
      v-if="post.frontmatter.titleTag && titleTagProps?.position === 'right'"
      :text="post.frontmatter.titleTag"
      v-bind="titleTagProps"
      :aria-label="post.frontmatter.titleTag"
    />
  </span>
</template>
