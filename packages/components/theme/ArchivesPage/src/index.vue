<script setup lang="ts" name="ArchivesPage">
import { withBase, useData } from "vitepress";
import { computed, onMounted, ref } from "vue";
import { useNamespace, useLocale, useWindowTransition } from "@mist/composables";
import { useWindowTransitionConfig, usePosts } from "@mist/components/theme/ConfigProvider";
import { MtArticlePage } from "@mist/components/common/ArticlePage";
import { MtArticleTitle } from "@mist/components/theme/ArticleTitle";

defineOptions({ name: "ArchivesPage" });

const ns = useNamespace("archives");
const { t } = useLocale();

const { frontmatter } = useData();

const posts = usePosts();

const defaultLabel = computed(() => {
  const frontmatterConst = frontmatter.value;
  return {
    title: frontmatterConst.title ?? t("mt.archives.title"),
    totalCount: frontmatterConst.totalCount ?? t("mt.archives.totalCount"),
    year: frontmatterConst.year ?? t("mt.archives.year"),
    month: frontmatterConst.month ?? t("mt.archives.month"),
    count: frontmatterConst.count ?? t("mt.archives.count"),
    notFound: frontmatterConst.notFound ?? t("mt.archives.notFound"),
  };
});

// 屏幕加载元素时，开启过渡动画
const windowTransition = useWindowTransitionConfig(config => config.archives);
const timelineItemListInstance = ref<HTMLLIElement[] | null>(null);
const { start } = useWindowTransition(timelineItemListInstance, false);

onMounted(() => {
  windowTransition.value && start();
});
</script>

<template>
  <MtArticlePage :class="ns.b()" :aria-label="t('mt.archives.label')">
    <slot name="mist-archives-top-before" />

    <div :class="`${ns.e('header')} flx-justify-between`">
      <h1>{{ defaultLabel.title }}</h1>
      <div class="count">
        {{ defaultLabel.totalCount.replace("{count}", posts.sortPostsByDate.length) }}
      </div>
    </div>

    <slot name="mist-archives-top-after" />

    <div class="vp-doc">
      <Content />
    </div>

    <div :class="ns.e('timeline')">
      <template v-for="(monthPosts, year) in posts.groupPostsByYearMonth" :key="year">
        <div :class="`${ns.em('timeline', 'year')} flx-justify-between`">
          <div class="year">
            {{ String(year).trim() === "NaN" ? defaultLabel.notFound : String(year).trim() + defaultLabel.year }}
          </div>
          <div class="count">{{ posts.groupPostsByYear[year].length + defaultLabel.count }}</div>
        </div>

        <div :class="ns.e('timeline__m')">
          <template v-for="(p, month) in monthPosts" :key="month">
            <div :class="`${ns.em('timeline__m', 'month')} flx-justify-between`">
              <div class="month">
                {{ String(month) === "NaN" ? defaultLabel.notFound : month + defaultLabel.month }}
              </div>
              <div class="count">{{ p.length + defaultLabel.count }}</div>
            </div>

            <ul>
              <li ref="timelineItemListInstance" v-for="item in p" :key="item.url">
                <a :href="item.url && withBase(item.url)" :aria-label="`${item.title}`">
                  <span class="date">{{ item.date?.slice(5, 10) }}</span>
                  <MtArticleTitle :post="item" :title-tag-props="{ position: 'right', size: 'small' }" />
                </a>
              </li>
            </ul>
          </template>
        </div>
      </template>
    </div>
  </MtArticlePage>
</template>
