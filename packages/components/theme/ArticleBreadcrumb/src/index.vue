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

  // 获取第一级目录的URL作为基础路径
  const firstLevelItem = relativePathArrConst[0];
  const firstLevelUrl = theme.value.catalogues?.inv[firstLevelItem]?.url;
  let basePath = "";

  if (firstLevelUrl) {
    // 移除第一级URL的文件名部分，只保留目录路径
    basePath = firstLevelUrl.substring(0, firstLevelUrl.lastIndexOf("/") + 1);
  }

  relativePathArrConst.forEach((item, index) => {
    // 去除「序号.」的前缀，并获取文件名
    const fileName = item.replace(/^\d+\./, "").split(".")?.[0] || "";

    // 兼容国际化功能，如果配置多语言，在面包屑去掉多语言根目录名
    if (
      (index !== relativePathArrConst.length - 1 || breadcrumb.value.showCurrentName) &&
      fileName !== localeIndex.value
    ) {
      // 构建路径URL
      let url = "";

      // 首先尝试从catalogues.inv中查找当前项的URL
      const invUrl = theme.value.catalogues?.inv[item]?.url;
      if (invUrl) {
        url = invUrl;
      } else if (basePath && index > 0) {
        // 如果没有找到URL且有基础路径，构建层级URL
        // 构建到当前层级的路径
        const pathSegments: string[] = [];
        for (let i = 1; i <= index; i++) {
          const segment = relativePathArrConst[i].replace(/^\d+\./, "");
          pathSegments.push(segment);
        }

        // 组合基础路径和当前层级路径
        if (pathSegments.length > 0) {
          url = basePath + pathSegments.join("/") + "/";
        }
      }

      classifyList.push({
        fileName,
        url,
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
