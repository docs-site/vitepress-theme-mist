<script setup lang="ts" name="DocAsideOutline">
import { onContentUpdated, useData } from "vitepress";
import { onMounted, provide, reactive, ref, shallowRef, watch } from "vue";
import { useNamespace } from "@mist/composables";
import { getHeaders, outlineExpansionKey, resolveTitle, useActiveAnchor } from "./outline";
import type { MenuItem } from "./outline";
import DocAsideOutlineItem from "./DocAsideOutlineItem.vue";

defineOptions({ name: "DocAsideOutline" });

const ns = useNamespace("aside-outline");
const { frontmatter, theme } = useData();

const headers = shallowRef<any[]>([]);

onContentUpdated(() => {
  headers.value = getHeaders(frontmatter.value.outline ?? theme.value.outline);
});

onMounted(() => {
  if (!headers.value?.length) headers.value = getHeaders(frontmatter.value.outline ?? theme.value.outline);
});

const container = ref<HTMLElement | null>(null);
const marker = ref<HTMLElement | null>(null);

// ---- 折叠展开状态：默认全部折叠，展开当前激活标题所在分组 ----
const expandedLinks = reactive(new Set<string>());
// 子标题链接 -> 父分组链接
let parentMap = new Map<string, string>();
// 上一次自动展开的激活 hash，避免滚动时重复展开用户手动折叠的分组
let lastAutoHash: string | null = null;

function buildParentMap(items: MenuItem[], parentLink?: string) {
  for (const item of items) {
    if (parentLink) parentMap.set(item.link, parentLink);
    if (item.children?.length) buildParentMap(item.children, item.link);
  }
}

watch(headers, items => {
  parentMap = new Map();
  expandedLinks.clear();
  lastAutoHash = null;
  if (items?.length) buildParentMap(items);
});

function isExpanded(link: string) {
  return expandedLinks.has(link);
}

function expand(link: string) {
  expandedLinks.add(link);
}

function toggle(link: string) {
  if (expandedLinks.has(link)) expandedLinks.delete(link);
  else expandedLinks.add(link);
}

function expandWithAncestors(link: string) {
  let current: string | undefined = link;
  while (current) {
    expandedLinks.add(current);
    current = parentMap.get(current);
  }
}

// 目标链接被折叠时，回退到最近一个可见的祖先链接
function isVisibleLink(link: string) {
  let current: string | undefined = link;
  while (current) {
    const parent = parentMap.get(current);
    if (parent && !expandedLinks.has(parent)) return false;
    current = parent;
  }
  return true;
}

function resolveAnchor(hash: string): HTMLAnchorElement | null {
  const nav = container.value;
  if (!nav) return null;
  let current: string | undefined = hash;
  while (current) {
    if (isVisibleLink(current)) {
      return nav.querySelector<HTMLAnchorElement>(`a[href="${current}"]`);
    }
    current = parentMap.get(current);
  }
  return null;
}

function onActivate(hash: string | null) {
  if (!hash || hash === lastAutoHash) return;
  lastAutoHash = hash;
  expandWithAncestors(hash);
}

const { refresh } = useActiveAnchor(container, marker, { onActivate, resolveAnchor });

// 折叠动画会改变下方链接位置，动画结束后重新定位指示条
function onTransitionEnd(event: TransitionEvent) {
  if (event.propertyName === "grid-template-rows") refresh();
}

provide(outlineExpansionKey, { isExpanded, toggle, expand });
</script>

<template>
  <nav
    aria-labelledby="doc-outline-aria-label"
    :class="[ns.b(), { 'has-outline': headers.length > 0 }]"
    ref="container"
    @transitionend.capture="onTransitionEnd"
  >
    <div :class="ns.e('content')">
      <div :class="ns.m('marker')" ref="marker" />

      <div id="doc-outline-aria-label" aria-level="2" :class="ns.m('title')" role="heading">
        {{ resolveTitle(theme) }}
      </div>

      <DocAsideOutlineItem :headers="headers" :root="true" />
    </div>
  </nav>
</template>
