<script setup lang="ts" name="NavigationPage">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'
import { useNamespace } from '@mist/composables'

// 使用自定义节流函数
const useThrottleFn = (fn: Function, delay: number) => {
  let lastCall = 0
  return (...args: any[]) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      fn(...args)
    }
  }
}

import NavigationPageLinkItem from './link-items.vue'
import type { NavigationLinkItem, NavigationData } from './types'

const props = defineProps<{
  title?: string
  noIcon?: boolean
  items?: NavigationLinkItem[]
}>()

const { frontmatter: fm } = useData()
const ns = useNamespace("navigation-page")

// 检测是否为导航页面
const isNavigationPage = computed(() => fm.value.Navigation === true)

// 获取导航数据
const navigationData = computed<NavigationData[]>(() => {
  if (!isNavigationPage.value) return []
  
  // 直接从 frontmatter 获取 navigationData
  return fm.value.navigationData || []
})

// 获取页面标题
const pageTitle = computed(() => props.title || fm.value.title || '导航')

// 生成section ID（用于跳转）
const generateSectionId = (title: string) =>
  title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-').toLowerCase()

// 当前激活的section
const activeSection = ref('')

// 标记是否刚进行了点击跳转
let isJustScrolled = false

// 跳转到指定section
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = sectionId
    isJustScrolled = true
    
    // 一段时间后清除标记
    setTimeout(() => {
      isJustScrolled = false
    }, 1000)
  }
}

// 监听滚动更新激活的section
onMounted(() => {
  // 初始化时设置第一个section为激活状态
  if (navigationData.value.length > 0) {
    activeSection.value = generateSectionId(navigationData.value[0].title)
  }

  const handleScroll = () => {
    // 如果是刚点击跳转，则不处理滚动事件
    if (isJustScrolled) return
    
    const sections = navigationData.value
      .map(section => {
        const sectionId = generateSectionId(section.title)
        const element = document.getElementById(sectionId)
        if (!element) return null
        
        const rect = element.getBoundingClientRect()
        return { id: sectionId, top: rect.top, bottom: rect.bottom }
      })
      .filter(Boolean)

    if (sections.length === 0) return

    // 找到最接近视窗顶部的section
    const viewportHeight = window.innerHeight
    const currentSection = sections.reduce((prev, current) => {
      const prevDistance = Math.abs(prev.top - viewportHeight * 0.15)
      const currentDistance = Math.abs(current.top - viewportHeight * 0.15)
      
      return current.top < viewportHeight * 0.5 && currentDistance < prevDistance
        ? current
        : prev
    })

    if (currentSection?.id !== activeSection.value) {
      activeSection.value = currentSection.id
    }
  }

  // 使用节流优化滚动事件
  const throttledHandleScroll = useThrottleFn(handleScroll, 100)
  window.addEventListener('scroll', throttledHandleScroll)
  
  // 初始检查
  setTimeout(handleScroll, 200)

  // 清理函数
  onUnmounted(() => {
    window.removeEventListener('scroll', throttledHandleScroll)
  })
})
</script>

<template>
  <!-- 导航页面模式 -->
  <div v-if="isNavigationPage" :class="ns.b()">
    <!-- 页面标题 -->
    <header :class="ns.e('header')">
      <h1 :class="ns.e('title')">{{ pageTitle }}</h1>
    </header>
    
    <!-- 导航内容区域 -->
    <div :class="ns.e('container')">
      <!-- 左侧大纲 -->
      <aside :class="ns.e('sidebar')">
        <div :class="ns.e('sidebar-title')">导航大纲</div>
        <nav :class="ns.e('sidebar-nav')">
          <a
            v-for="section in navigationData"
            :key="section.title"
            :class="[ns.e('sidebar-item'), { active: activeSection === generateSectionId(section.title) }]"
            :href="`#${generateSectionId(section.title)}`"
            @click.prevent="scrollToSection(generateSectionId(section.title))"
          >
            {{ section.title }}
          </a>
        </nav>
      </aside>
      
      <!-- 右侧内容 -->
      <main :class="ns.e('content')">
        <div
          v-for="(section, sectionIndex) in navigationData"
          :key="sectionIndex"
          :class="ns.e('section')"
          :id="generateSectionId(section.title)"
        >
          <h2 v-if="section.title" :class="ns.e('section-title')" tabindex="-1">
            {{ section.title }}
            <a class="header-anchor" :href="`#${generateSectionId(section.title)}`" aria-hidden="true"></a>
          </h2>
          <div :class="ns.e('links')">
            <NavigationPageLinkItem
              v-for="item in section.items"
              :key="item.title"
              v-bind="item"
            />
          </div>
        </div>
        
        <!-- 页面内容插槽 -->
        <div :class="ns.e('page-content')">
          <slot />
        </div>
      </main>
    </div>
  </div>
  
  <!-- 普通组件模式 -->
  <div v-else :class="ns.e('links')">
    <NavigationPageLinkItem v-for="item in items" :noIcon="noIcon" v-bind="item" />
  </div>
</template>
