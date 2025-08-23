<script setup lang="ts" name="HomeUnderline">
import { useData } from 'vitepress'
import { homeUnderlineIcon } from '@mist/static'
import { useNamespace, moveDomElements } from '@mist/composables'

const { frontmatter: fm } = useData()
const ns = useNamespace("home-underline");

// 使用 moveDomElements 将 hero-underline-svg 元素追加到 .VPHero .tagline 容器
// heroUnderlineText 是模板中的 ref，用于标识要移动的元素
moveDomElements('heroUnderlineText', '.VPHero .tagline');

</script>

<template>
  <span ref="heroUnderlineText">
    <span :class="ns.e('text')">{{ fm.hero?.tagline }}
      <span :class="ns.e('svg')" v-html="homeUnderlineIcon"></span>
    </span>
  </span>
</template>
