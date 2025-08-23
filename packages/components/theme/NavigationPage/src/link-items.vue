<script setup lang="ts" name="NavigationPageLinkItem">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { useNamespace } from '@mist/composables'
import type { NavigationLinkItem } from './types'

const props = defineProps<{
  noIcon?: boolean
  icon?: NavigationLinkItem['icon']
  badge?: NavigationLinkItem['badge']
  title?: NavigationLinkItem['title']
  desc?: NavigationLinkItem['desc']
  link: NavigationLinkItem['link']
}>()

const ns = useNamespace("nav-link")

// 计算图标内容
const svgContent = computed(() =>
  typeof props.icon === 'object' ? props.icon.svg : ''
)

// 格式化徽章数据
const formattedBadge = computed(() =>
  typeof props.badge === 'string'
    ? { text: props.badge, type: 'info' as const }
    : props.badge
)
</script>

<template>
  <a :class="ns.b()" :href="link" target="_blank" rel="noreferrer">
    <article :class="[ns.e('box'), { 'has-badge': formattedBadge }]">
      <div :class="ns.e('box-header')">
        <template v-if="!noIcon && icon">
          <div v-if="svgContent" :class="ns.e('icon')" v-html="svgContent"></div>
          <div v-else-if="typeof icon === 'string'" :class="ns.e('icon')">
            <img :src="withBase(icon)" :alt="title" onerror="this.parentElement.style.display='none'" />
          </div>
        </template>
        <h5 v-if="title" :class="[ns.e('title'), { 'no-icon': noIcon }]">{{ title }}</h5>
      </div>
      <Badge v-if="formattedBadge" :class="ns.e('badge')" :type="formattedBadge.type" :text="formattedBadge.text" />
      <p v-if="desc" :class="ns.e('desc')">{{ desc }}</p>
    </article>
  </a>
</template>
