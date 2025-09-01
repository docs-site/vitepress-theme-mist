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

// 解析页面文件路径，处理 permalink 的情况
// 示例:
// 1. 普通情况: page.value.filePath = "docs/src/guide/getting-started.md"
//    relativePathArr.value = ["docs", "src", "guide", "getting-started.md"]
//
// 2. 使用 permalink: page.value.filePath = "/guide/getting-started.html"
//    theme.value.permalinks.inv["/guide/getting-started.html"] = "docs/src/guide/getting-started.md"
//    relativePathArr.value = ["docs", "src", "guide", "getting-started.md"]
const relativePathArr = computed(() => {
  let filePath = page.value.filePath;
  
  // 如果存在 permalinks，尝试将 permalink 转换为实际的文件路径
  // 这样可以确保后续的面包屑构建基于实际的文件结构
  if (theme.value.permalinks) {
    const permalinkPath = filePath;
    // permalink 可能以 .html 结尾，需要尝试两种形式
    // 例如: "/guide/getting-started.html" 和 "/guide/getting-started"
    const possiblePaths = [permalinkPath, permalinkPath.replace(/\.html$/, "")];
    
    for (const path of possiblePaths) {
      // 在 permalinks.inv 中查找 permalink 对应的实际文件路径
      // theme.value.permalinks.inv["/guide/getting-started.html"] = "docs/src/guide/getting-started.md"
      const realPath = theme.value.permalinks.inv[path];
      if (realPath) {
        filePath = realPath;
        break;
      }
    }
  }
  
  // 将文件路径按 "/" 分割成数组
  // 例如: "docs/src/guide/getting-started.md" => ["docs", "src", "guide", "getting-started.md"]
  return filePath.split("/") || [];
});

// 构建面包屑列表
// 示例:
// 假设 relativePathArr.value = ["docs", "src", "guide", "getting-started.md"]
// 那么 breadcrumbList 将包含:
// [
//   { fileName: "docs", url: "docs/" },
//   { fileName: "src", url: "docs/src/" },
//   { fileName: "guide", url: "docs/src/guide/" },
//   { fileName: "getting-started", url: "docs/src/guide/getting-started/" }
// ]
const breadcrumbList = computed(() => {
  const classifyList: { fileName: string; url: string }[] = [];
  const relativePathArrConst: string[] = relativePathArr.value;

  relativePathArrConst.forEach((item, index) => {
    // 去除「序号.」的前缀，并获取文件名
    // 例如: "01.guide.md" => "guide"
    const fileName = item.replace(/^\d+\./, "").split(".")?.[0] || "";

    // 兼容国际化功能，如果配置多语言，在面包屑去掉多语言根目录名
    // 同时检查是否需要显示当前页面名称
    if (
      (index !== relativePathArrConst.length - 1 || breadcrumb.value.showCurrentName) &&
      fileName !== localeIndex.value
    ) {
      // 构建路径URL
      let url = "";

      // 如果不是最后一级或者需要显示当前名称，则构建URL
      if (index !== relativePathArrConst.length - 1 || breadcrumb.value.showCurrentName) {
        // 构建到当前层级的路径，去除序号前缀
        // 例如: 当 index=2 时，pathSegments = ["docs", "src", "guide"]
        const pathSegments: string[] = [];
        for (let i = 0; i <= index; i++) {
          // 去除序号前缀
          // 例如: "01.guide" => "guide"
          let segment = relativePathArrConst[i].replace(/^\d+\./, "");
          
          // 如果是最后一级且看起来像文件（包含点号），则去除扩展名
          // 例如: "getting-started.md" => "getting-started"
          if (i === index && segment.includes(".")) {
            segment = segment.replace(/\.[^.]+$/, "");
          }
          pathSegments.push(segment);
        }

        // 构建URL，不以/开头，以/结尾
        // 例如: ["docs", "src", "guide"] => "docs/src/guide/"
        if (pathSegments.length > 0) {
          url = pathSegments.join("/");
          // 确保路径以/结尾
          if (!url.endsWith("/")) {
            url += "/";
          }
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
