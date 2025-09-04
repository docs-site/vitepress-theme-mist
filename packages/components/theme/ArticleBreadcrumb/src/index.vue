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
const { localeIndex, theme, page, frontmatter } = useData();

// 面包屑配置项
const breadcrumb = getMistConfigRef<BreadcrumbType>("breadcrumb", {
  enabled: true,
  showCurrentName: false,
  separator: "/",
  homeLabel: t("mt.articleBreadcrumb.home"),
});

/**
 * @brief 解析页面文件路径
 * 1. Proxy 方式使用 permalinks 时,其实这种情况和正常情况一样，因为还是实际文件路径，但是vitepress代理把文件路径转为永久链接了
 *     vitepress下的路径: src/sdoc/01-开发/LV07-Vite插件.md
 *     dev模式下访问路径: http://localhost:5173/vitepress-theme-mist/sdoc/develop/126b07e425dd1846daae8bc9.html
 *     page.value.filePath = sdoc/01-开发/LV07-Vite插件.md
 *     frontmatter.value.permalink: /sdoc/develop/126b07e425dd1846daae8bc9
 * 2. rewrites 模式
 *     vitepress下的路径: src/sdoc/01-开发/LV07-Vite插件.md
 *     dev模式下访问路径: http://localhost:5173/vitepress-theme-mist/sdoc/develop/126b07e425dd1846daae8bc9.html
 *     page.value.filePath = sdoc/01-开发/LV07-Vite插件.md
 *     frontmatter.value.permalink: /sdoc/develop/126b07e425dd1846daae8bc9
 * 其实这两种模式都是一样的，获取到的还是基于文件路径的一个路径主要是后面的处理
 */

const relativePathArr = computed(() => {
  const filePath = page.value.filePath;
  const permalink = frontmatter.value.permalink;
  
  // 将文件路径按 "/" 分割成数组
  // 例如: "sdoc/01-开发/LV07-Vite插件.md" => [ "sdoc", "01-开发", "LV07-Vite插件.md" ]
  const splitFilePath = filePath.split("/") || [];
  const splitPermalink = permalink ? permalink.split("/") || [] : [];
  
  return {
    filePath,
    splitFilePath,
    permalink,
    splitPermalink
  };
});

/**
 * @brief 构建面包屑列表
 * 以 "sdoc/01-开发/LV07-Vite插件.md" 为例，详细分析每次循环的过程：
 * 输入数据: relativePathArrConst = ["sdoc", "01-开发", "LV07-Vite插件.md"]
 * 假设: breadcrumb.value.showCurrentName = false, localeIndex.value = "zh"
 *    第1次循环 (index = 0, item = "sdoc")             结果: { fileName: "sdoc", url: "sdoc/" }
 *    第2次循环 (index = 1, item = "01-开发")          结果: { fileName: "-开发", url: "sdoc/-开发/" }
 *    第3次循环 (index = 2, item = "LV07-Vite插件.md") 结果: 不添加到 classifyList 中
 * 最终结果：
 *    classifyList = [
 *      { fileName: "sdoc", url: "sdoc/" },
 *      { fileName: "-开发", url: "sdoc/-开发/" }
 *    ]
 * 如果 breadcrumb.value.showCurrentName = true，那么第3次循环也会执行：
 *    第3次循环结果: { fileName: "LV07-Vite插件", url: "sdoc/-开发/LV07-Vite插件/" }
 *    classifyList = [
 *      { fileName: "sdoc", url: "sdoc/" },
 *      { fileName: "-开发", url: "sdoc/-开发/" }
 *      { fileName: "LV07-Vite插件", url: "sdoc/-开发/LV07-Vite插件/" }
 *    ]
 */
// 检查是否使用了 vitepress-plugin-permalink 的 rewrite 模式
const isRewriteMode = computed(() => {
  // 确保所有需要的数据结构都存在
  if (!theme.value || !theme.value.catalogIndex || !theme.value.catalogIndex.arr) {
    return false;
  }
  
  // 检查 catalogIndex.arr 是否是对象，并且有 create 属性等于 vitepress-plugin-permalink
  if (typeof theme.value.catalogIndex.arr === 'object' &&
      theme.value.catalogIndex.arr.create === 'vitepress-plugin-permalink') {
    return true;
  }
  
  // 如果是数组，检查其中是否有 create 等于 vitepress-plugin-permalink 的项
  if (Array.isArray(theme.value.catalogIndex.arr)) {
    return theme.value.catalogIndex.arr.some((item: any) =>
      item && item.create === 'vitepress-plugin-permalink'
    );
  }
  
  return false;
});

const breadcrumbList = computed(() => {
  const classifyList: { fileName: string; url: string }[] = [];
  const relativePathArrConst = relativePathArr.value.splitFilePath;
  // "sdoc/01-开发/LV07-Vite插件.md" => [ "sdoc", "01-开发", "LV07-Vite插件.md" ]
  // item会从[ "sdoc", "01-开发", "LV07-Vite插件.md" ]中取,index取值为 0 1 ...
  relativePathArrConst.forEach((item, index) => {
    // 去除「序号-」的前缀，并获取文件名，例如: "01-开发" => "guide"
    const fileName = item.replace(/^\d+\-/, "").split(".")?.[0] || "";
  
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
        const pathSegments: string[] = [];
        // 遍历从路径开始到当前层级的所有片段。// 例如: 当item=01-开发 index=1 时，pathSegments = ["sdoc", "01-开发"]
        for (let i = 0; i <= index; i++) {
          let segment = relativePathArrConst[i];// 这里是构建路径的，要保证完整路径
          
          // 如果是最后一级且看起来像文件（包含点号），则去除扩展名
          // 例如: "getting-started.md" => "getting-started"
          if (i === index && segment.includes(".")) {
            segment = segment.replace(/\.[^.]+$/, "");
          }
          pathSegments.push(segment);
        }

        // 构建URL，不以/开头，以/结尾
        // 例如: ["sdoc", "01-开发"] => "sdoc/01-开发/"
        if (pathSegments.length > 0) {
          url = pathSegments.join("/");
          if (!url.endsWith("/")) {
            url += "/";
          }
        }
        if(isRewriteMode.value && theme.value.catalogIndex?.map) {
          // 在 rewrite 模式下，构建完整的 index.md 路径作为键
          // 注意：pathSegments 包含的是带序号的原始路径片段，需要构建完整的文件路径
          const indexMdKey = pathSegments.join('/') + '/index.md';
          
          // 在 catalogIndex.map 中查找对应的重写路径
          const rewrittenPath = theme.value.catalogIndex.map[indexMdKey];
          
          if (rewrittenPath) {
            // 如果找到重写路径，使用重写后的路径作为 URL
            url = rewrittenPath.replace(/\.md$/, '');
          }
        }
      }
      classifyList.push({
        fileName: fileName,
        url: url,
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
