<script setup lang="ts" name="CataloguePage">
import { computed } from "vue";
import { useData } from "vitepress";
import { useNamespace, useLocale } from "@mist/composables";
import { MtArticlePage } from "@mist/components/common/ArticlePage";
import CatalogueItem from "./CatalogueItem.vue";

defineOptions({ name: "CataloguePage" });

const ns = useNamespace("catalogue");
const { t } = useLocale();

const { theme, frontmatter } = useData();

// 目录列表
const catalogues = computed(() => theme.value.catalogues?.inv[frontmatter.value.path]?.catalogues);
</script>

<template>
  <MtArticlePage :class="ns.b()" :aria-label="t('mt.catalogue.label')">
    <slot name="mist-catalogue-top-before" />

    <div :class="ns.e('header')" role="group" aria-labelledby="catalogue-header-title">
      <h2 id="catalogue-header-title">{{ frontmatter.title }}</h2>
      <div class="description">{{ frontmatter.desc || frontmatter.description }}</div>
    </div>

    <slot name="mist-catalogue-top-after" />

    <div :class="ns.e('wrapper')" aria-labelledby="catalogue-list-title">
      <div id="catalogue-list-title" class="title">{{ frontmatter.pageTitle || t("mt.catalogue.title") }}</div>
      <ul class="flx-wrap-between">
        <template v-for="(item, index) in catalogues" :key="index">
          <CatalogueItem :item :index="index + 1" />
        </template>
      </ul>
    </div>

    <div class="vp-doc">
      <Content />
    </div>
  </MtArticlePage>
</template>
