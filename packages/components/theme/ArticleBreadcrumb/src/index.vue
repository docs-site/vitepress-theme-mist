<script setup lang="ts" name="ArticleBreadcrumb">
import type { Breadcrumb as BreadcrumbType } from "@mist/config";
import { computed } from "vue";
import { useData, withBase } from "vitepress";
import { useNamespace, useLocale } from "@mist/composables";
import { houseIcon } from "@mist/static";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { MtBreadcrumb, MtBreadcrumbItem } from "@mist/components/common/Breadcrumb";
import { MtIcon } from "@mist/components/common/Icon";

defineOptions({ name: "ArticleBreadcrumb" });

const ns = useNamespace("article-breadcrumb");
const { t } = useLocale();

const { getMistConfigRef } = useMistConfig();
const { localeIndex, theme, page } = useData();

// 面包屑配置项
const breadcrumb = getMistConfigRef<BreadcrumbType>("breadcrumb", {
  enabled: true,
  showCurrentName: false,
  separator: "/",
  homeLabel: t("mt.articleBreadcrumb.home"),
});

const relativePathArr = computed(() => page.value.filePath.split("/") || []);

const breadcrumbList = computed(() => {
  const classifyList: { fileName: string; url: string }[] = [];
  const relativePathArrConst: string[] = relativePathArr.value;

  relativePathArrConst.forEach((item, index) => {
    // 去除「序号.」的前缀，并获取文件名
    const fileName = item.replace(/^\d+\./, "").split(".")?.[0] || "";

    // 兼容国际化功能，如果配置多语言，在面包屑去掉多语言根目录名
    if (
      (index !== relativePathArrConst.length - 1 || breadcrumb.value.showCurrentName) &&
      fileName !== localeIndex.value
    ) {
      classifyList.push({
        fileName,
        url: theme.value.catalogues?.inv[item]?.url || "",
      });
    }
  });
  return classifyList;
});
</script>

<template>
  <div :class="`${ns.b()}`" role="navigation" :aria-label="t('mt.articleBreadcrumb.label')">
    <MtBreadcrumb v-if="breadcrumb?.enabled" :separator="breadcrumb.separator">
      <MtBreadcrumbItem>
        <a
          :href="withBase('/')"
          :title="breadcrumb.homeLabel"
          class="home hover-color"
          :aria-label="breadcrumb.homeLabel"
        >
          <MtIcon :icon="houseIcon" aria-hidden="true" />
        </a>
      </MtBreadcrumbItem>
      <MtBreadcrumbItem v-for="(item, index) in breadcrumbList" :key="index">
        <component
          :is="item.url ? 'a' : 'span'"
          :href="item.url && withBase(`/${item.url}`)"
          :title="item.fileName"
          :class="[item.url ? 'hover-color' : '']"
          :aria-label="item.fileName"
        >
          {{ item.fileName }}
        </component>
      </MtBreadcrumbItem>
    </MtBreadcrumb>
  </div>
</template>
