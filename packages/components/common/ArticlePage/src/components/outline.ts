// From https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/composables/outline.ts
import type { Header } from "vitepress";
import type { DefaultTheme } from "vitepress/theme";
import type { InjectionKey, Ref } from "vue";
import { getScrollOffset } from "vitepress";
import { nextTick, onMounted, onUnmounted, onUpdated } from "vue";
import { useMediaQuery, useDebounce } from "@mist/composables";

const ignoreRE = /\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/;

// 滚动激活的可见缓冲区（px）：标题顶部越过判定线（scrollOffset + 4）后，
// 再深入缓冲区内仍会激活对应目录项，避免标题快滚出视口才高亮
const LOOK_AHEAD = 180;

// cached list of anchor elements from resolveHeaders
const resolvedHeaders: { element: HTMLHeadElement; link: string }[] = [];

export type MenuItem = Omit<Header, "slug" | "children"> & {
  element: HTMLHeadElement;
  children?: MenuItem[];
};

export interface OutlineExpansionContext {
  isExpanded: (link: string) => boolean;
  toggle: (link: string) => void;
  expand: (link: string) => void;
}

export const outlineExpansionKey: InjectionKey<OutlineExpansionContext> = Symbol("MtOutlineExpansion");

function safeDecode(hash: string): string {
  try {
    return decodeURIComponent(hash);
  } catch {
    return hash;
  }
}

export function resolveTitle(theme: DefaultTheme.Config): string {
  return (typeof theme.outline === "object" && !Array.isArray(theme.outline) && theme.outline.label) || "On this page";
}

export function getHeaders(range: DefaultTheme.Config["outline"]): MenuItem[] {
  // 兼容两种内容容器：MtArticlePage 与普通文档页的 vp-doc
  const headers = [...document.querySelectorAll(":is(.vp-doc, .mt-article-page) :where(h1,h2,h3,h4,h5,h6)")]
    .filter(el => el.id && el.hasChildNodes())
    .map(el => {
      const level = Number(el.tagName[1]);
      return {
        element: el as HTMLHeadElement,
        title: serializeHeader(el),
        link: "#" + el.id,
        level,
      };
    });

  return resolveHeaders(headers, range);
}

function serializeHeader(h: Element): string {
  let ret = "";
  for (const node of h.childNodes) {
    if (node.nodeType === 1) {
      if (ignoreRE.test((node as Element).className)) continue;
      ret += node.textContent;
    } else if (node.nodeType === 3) {
      ret += node.textContent;
    }
  }
  return ret.trim();
}

export function resolveHeaders(headers: MenuItem[], range?: DefaultTheme.Config["outline"]): MenuItem[] {
  if (range === false) {
    return [];
  }

  const levelsRange = (typeof range === "object" && !Array.isArray(range) ? range.level : range) || 2;

  const [high, low]: [number, number] =
    typeof levelsRange === "number" ? [levelsRange, levelsRange] : levelsRange === "deep" ? [2, 6] : levelsRange;

  return buildTree(headers, high, low);
}

export const useActiveAnchor = (
  container: Ref<HTMLElement>,
  marker: Ref<HTMLElement>,
  hooks?: {
    /** 激活锚点变化时回调（hash 已解码），用于展开当前标题所在分组 */
    onActivate?: (hash: string | null) => void;
    /** 解析当前可见的锚点元素，目标被折叠时可回退到最近可见的祖先 */
    resolveAnchor?: (hash: string) => HTMLAnchorElement | null;
  }
) => {
  const is1280 = useMediaQuery("(min-width: 1280px)");
  const onScroll = useDebounce(setActiveLink, 100);

  let prevActiveLink: HTMLAnchorElement | null = null;

  onMounted(() => {
    requestAnimationFrame(setActiveLink);
    window.addEventListener("scroll", onScroll);
    // 锚点导航（点击目录/标题锚点、前进后退）时立即以 hash 为准高亮，
    // 不等滚动判定（VitePress 在拦截同页锚点点击后会派发 hashchange 事件）
    window.addEventListener("hashchange", onHashChange);
  });

  onUpdated(() => {
    // sidebar update means a route change
    activateLink(location.hash);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("hashchange", onHashChange);
  });

  function onHashChange() {
    activateLink(location.hash);
  }

  function setActiveLink() {
    if (!is1280.value) return;

    const scrollY = window.scrollY;
    const innerHeight = window.innerHeight;
    const offsetHeight = document.body.offsetHeight;
    const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1;

    // resolvedHeaders may be repositioned, hidden or fix positioned
    const headers = resolvedHeaders
      .map(({ element, link }) => ({
        link,
        top: getAbsoluteTop(element),
      }))
      .filter(({ top }) => !Number.isNaN(top))
      .sort((a, b) => a.top - b.top);

    // no headers available for active link
    if (!headers.length) {
      activateLink(null);
      return;
    }

    // page top
    if (scrollY < 1) {
      activateLink(null);
      return;
    }

    // page bottom - highlight last link
    if (isBottom) {
      activateLink(headers[headers.length - 1].link);
      return;
    }

    // find the last header above the top of viewport; 额外预留一段可见缓冲区，
    // 让标题一滚动到顶部附近（仍可见）就切换高亮，而不是几乎滚出视口才切换
    const threshold = scrollY + getScrollOffset() + 4 + LOOK_AHEAD;
    let activeLink: string | null = null;
    for (const { link, top } of headers) {
      if (top > threshold) break;
      activeLink = link;
    }
    activateLink(activeLink);
  }

  function activateLink(hash: string | null) {
    if (prevActiveLink) prevActiveLink.classList.remove("active");

    hooks?.onActivate?.(hash == null ? null : safeDecode(hash));

    const decoded = hash == null ? null : safeDecode(hash);
    if (decoded) {
      prevActiveLink = hooks?.resolveAnchor
        ? hooks.resolveAnchor(decoded)
        : container.value.querySelector(`a[href="${decoded}"]`);
    } else {
      prevActiveLink = null;
    }

    const activeLink = prevActiveLink;

    if (activeLink) {
      activeLink.classList.add("active");
      // 等待折叠分组展开导致的 DOM 更新完成后再定位指示条
      void nextTick(() => {
        if (!marker.value || !activeLink.isConnected || !activeLink.classList.contains("active")) return;
        marker.value.style.top = activeLink.offsetTop + 39 + "px";
        marker.value.style.opacity = "1";
      });
    } else {
      marker.value.style.top = "33px";
      marker.value.style.opacity = "0";
    }
  }

  function refresh() {
    // 重新按滚动位置计算，而不是沿用可能已过期的 URL hash：
    // hash 只在 hashchange（用户点击锚点/前进后退）时作为唯一依据
    setActiveLink();
  }

  return { refresh };
};

function getAbsoluteTop(element: HTMLElement): number {
  let offsetTop = 0;
  while (element !== document.body) {
    if (element === null) {
      // child element is:
      // - not attached to the DOM (display: none)
      // - set to fixed position (not scrollable)
      // - body or html element (null offsetParent)
      return NaN;
    }
    offsetTop += element.offsetTop;
    element = element.offsetParent as HTMLElement;
  }
  return offsetTop;
}

function buildTree(data: MenuItem[], min: number, max: number): MenuItem[] {
  resolvedHeaders.length = 0;

  const result: MenuItem[] = [];
  const stack: (MenuItem | { level: number; shouldIgnore: true })[] = [];

  data.forEach(item => {
    const node = { ...item, children: [] };
    let parent = stack[stack.length - 1];

    while (parent && parent.level >= node.level) {
      stack.pop();
      parent = stack[stack.length - 1];
    }

    if (node.element.classList.contains("ignore-header") || (parent && "shouldIgnore" in parent)) {
      stack.push({ level: node.level, shouldIgnore: true });
      return;
    }

    if (node.level > max || node.level < min) return;
    resolvedHeaders.push({ element: node.element, link: node.link });

    if (parent) parent.children!.push(node);
    else result.push(node);

    stack.push(node);
  });

  return result;
}
