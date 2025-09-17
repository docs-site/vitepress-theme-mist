<script setup lang="ts" name="DocFooterCopyright">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vitepress";
// 导入图标组件
import { MtIcon } from "@mist/components/common/Icon";
import { docFooterUserIcon, docFooterLinkIcon, docFooterCopyrightIcon, docFooterCCIcon } from "@mist/static";
import { useNamespace } from "@mist/composables";
import { isClient } from "@mist/helper";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import type { DocFooterCopyright as DocFooterCopyrightType } from "@mist/config";

defineOptions({ name: "DocFooterCopyright" });

const ns = useNamespace("doc-footer-copyright");
const usericon = docFooterUserIcon;
const linkicon = docFooterLinkIcon;
const copyright = docFooterCopyrightIcon;
const cc = docFooterCCIcon;

const { getMistConfigRef } = useMistConfig();

// 页脚版权配置项
const docFooterCopyright = getMistConfigRef<DocFooterCopyrightType>("docFooterCopyright", {
  enabled: true,
  author: "sumu",
  authorLink: "https://docs-site.github.io/vitepress-theme-mist/",
  pathMapping: {},
  copyrightText: "本博客所有文章除特别声明外，均采用",
  licenseName: "BY-NC-SA 4.0",
  licenseLink: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
});

// 设置文档属性
const documentAttribute = "doc-footer-copyright";

// 在组件挂载时设置命名空间属性
onMounted(() => {
  if (!isClient) return;
  document.documentElement.setAttribute(documentAttribute, ns.namespace);
});

// 完整文章链接（用于实际跳转）
const fullArticleUrl = ref("");
// 显示用的文章链接（简洁版）
const displayArticleUrl = ref("");
// 获取当前路由实例
const route = useRoute();

// 计算属性
const author = computed(() => docFooterCopyright.value.author || "sumu");
const authorLink = computed(
  () => docFooterCopyright.value.authorLink || "https://docs-site.github.io/vitepress-theme-mist/"
);
const pathMapping = computed(() => docFooterCopyright.value.pathMapping || {});
const copyrightText = computed(() => docFooterCopyright.value.copyrightText || "本博客所有文章除特别声明外，均采用");
const licenseName = computed(() => docFooterCopyright.value.licenseName || "BY-NC-SA 4.0");
const licenseLink = computed(
  () => docFooterCopyright.value.licenseLink || "https://creativecommons.org/licenses/by-nc-sa/4.0/"
);

// 简化URL获取逻辑
/**
 * 部署后的链接示例：
 *
 * 1. 本地开发环境：
 *    - 实际URL: http://localhost:5173/docs/guide/getting-started.html
 *    - 显示URL: http://localhost:5173/docs/guide/getting-started.html
 *    (如果有路径映射配置：{ "/docs/guide/getting-started.html": "/start" })
 *    - 显示URL: http://localhost:5173/start
 *
 * 2. GitHub Pages 部署：
 *    - 实际URL: https://username.github.io/vitepress-theme-mist/docs/guide/getting-started.html
 *    - 显示URL: https://username.github.io/vitepress-theme-mist/docs/guide/getting-started.html
 *    (如果有路径映射配置)
 *    - 显示URL: https://username.github.io/vitepress-theme-mist/start
 *
 * 3. 自定义域名部署：
 *    - 实际URL: https://your-domain.com/docs/guide/getting-started.html
 *    - 显示URL: https://your-domain.com/docs/guide/getting-started.html
 *    (如果有路径映射配置)
 *    - 显示URL: https://your-domain.com/start
 *
 * 路径映射的作用：
 * - 将长的、复杂的文档路径转换为简短的、易于记忆的路径
 * - 在保持实际链接功能的同时，提供更好的用户体验
 * - 适用于有层级结构的文档站点，可以将深层页面映射到根路径
 */
const updateArticleUrl = () => {
  if (typeof window !== "undefined") {
    // 获取当前完整URL，移除hash部分
    // 例如：https://example.com/docs/guide.html#section1 -> https://example.com/docs/guide.html
    const url = new URL(window.location.href);
    const cleanUrl = `${url.protocol}//${url.host}${url.pathname}`;

    // 查找是否有对应的短路径映射
    // pathMapping 是一个配置对象，用于将长路径映射为短路径，便于显示
    // 例如：{ "/docs/advanced/guide.html": "/guide" }
    // 如果找到映射，则使用映射后的路径，否则使用原路径
    const mappedPath = pathMapping.value[url.pathname] || url.pathname;
    const displayUrl = `${url.protocol}//${url.host}${mappedPath}`;

    // 设置两个URL变量：
    // fullArticleUrl: 用于实际跳转的完整URL，确保链接准确性
    // displayArticleUrl: 用于显示的URL，可能经过路径映射简化，更美观
    fullArticleUrl.value = cleanUrl;
    displayArticleUrl.value = displayUrl;
  }
};

// 初始加载时获取
onMounted(() => {
  // 延迟一点确保页面完全加载
  setTimeout(updateArticleUrl, 100);
});

// 监听路由变化
watch(
  () => route.path,
  () => {
    // 路由变化时更新URL
    setTimeout(updateArticleUrl, 100);
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="docFooterCopyright.enabled" :class="ns.b()">
    <!-- 右上角图标 -->
    <MtIcon :class="ns.e('corner-icon')" :icon="cc" icon-type="svg" size="18px" />

    <p :class="ns.e('line')">
      <MtIcon :icon="usericon" icon-type="svg" size="22px" />
      文章作者：
      <a :href="authorLink" :class="ns.e('author-link')" target="_blank">{{ author }}</a>
    </p>
    <p :class="ns.e('line')">
      <MtIcon :icon="linkicon" icon-type="svg" size="22px" />
      文章链接：
      <a :href="fullArticleUrl" target="_blank" rel="noopener noreferrer" :class="ns.e('url-link')">
        {{ displayArticleUrl }}
      </a>
    </p>
    <p :class="ns.e('line')">
      <MtIcon :icon="copyright" icon-type="svg" size="22px" />
      版权声明：{{ copyrightText }}
      <a :href="licenseLink" target="_blank" rel="noopener noreferrer" :class="ns.e('license-link')">
        {{ licenseName }}
      </a>
      许可协议。 转载请注明来自
      <a :href="authorLink" :class="ns.e('author-link')" target="_blank">{{ author }}</a>
    </p>
  </div>
</template>

<style scoped>
/* 样式已移至独立的 SCSS 文件中，使用命名空间管理 */
</style>
