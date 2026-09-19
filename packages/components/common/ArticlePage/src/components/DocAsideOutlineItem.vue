<script setup lang="ts" name="DocAsideOutlineItem">
import { inject } from "vue";
import type { MenuItem } from "./outline";
import { outlineExpansionKey } from "./outline";
import { useNamespace } from "@mist/composables";

defineOptions({ name: "DocAsideOutlineItem" });

defineProps<{ headers: MenuItem[]; root?: boolean }>();

const ns = useNamespace("aside-outline-item");

const expansion = inject(outlineExpansionKey);

// 未被 provider 包裹时保持原有全部展开的行为
function isExpanded(link: string) {
  return expansion ? expansion.isExpanded(link) : true;
}

function toggle(link: string) {
  expansion?.toggle(link);
}

function onClick({ target: el }: Event) {
  const id = (el as HTMLAnchorElement).href!.split("#")[1];
  const heading = document.getElementById(decodeURIComponent(id));
  heading?.focus({ preventScroll: true });
}

function onLinkClick(event: Event, item: MenuItem) {
  onClick(event);
  if (item.children?.length) expansion?.expand(item.link);
}
</script>

<template>
  <ul :class="[ns.b(), root ? ns.is('root') : ns.is('nested')]">
    <li v-for="item in headers" :key="item.link">
      <div :class="ns.e('row')">
        <button
          v-if="item.children?.length"
          type="button"
          :class="[ns.e('caret'), ns.is('expanded', isExpanded(item.link))]"
          :aria-expanded="isExpanded(item.link)"
          :title="isExpanded(item.link) ? '折叠' : '展开'"
          @click="toggle(item.link)"
        >
          <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor" aria-hidden="true">
            <path d="M6 3.5 12 8 6 12.5Z" />
          </svg>
        </button>
        <a :class="ns.m('link')" :href="item.link" :title="item.title" @click="onLinkClick($event, item)">
          {{ item.title }}
        </a>
      </div>

      <div v-if="item.children?.length" :class="[ns.e('collapse'), ns.is('expanded', isExpanded(item.link))]">
        <DocAsideOutlineItem :headers="item.children" />
      </div>
    </li>
  </ul>
</template>
