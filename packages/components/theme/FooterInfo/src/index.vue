<script setup lang="ts" name="FooterInfo">
import type { FooterInfo, Social } from "@mist/config";
import { computed } from "vue";
import { withBase } from "vitepress";
import { useNamespace, useLocale } from "@mist/composables";
import { themeIcon, copyrightIcon, icpRecordIcon } from "@mist/static";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { MtIcon } from "@mist/components/common/Icon";
// @ts-ignore
import securityRecordImg from "@mist/static/img/securityRecord.png";

defineOptions({ name: "FooterInfo" });

const ns = useNamespace("footer-info");
const { t } = useLocale();

const { getMistConfigRef } = useMistConfig();

const footerInfo = getMistConfigRef<FooterInfo>("footerInfo", {});
const social = getMistConfigRef<Social[]>("social", []);

const footerData = computed(() => {
  const { theme = {}, copyright = {}, icpRecord, securityRecord }: FooterInfo = footerInfo.value || {};
  const data: Social[] = [];
  // 1.主题版权
  if (theme.show !== false) {
    data.push({
      name: "Theme By Mist",
      icon: themeIcon,
      link: "https://github.com/docs-site/vitepress-theme-mist",
      // 可覆盖上面的配置项
      ...theme,
    });
  }

  // 2.博客版权
  const { show = true, createYear = "", suffix = "" } = copyright;
  if (show) {
    data.push({
      name: `Copyright ${createYear ? `${createYear}-` : ""}${new Date().getFullYear()} ${suffix}`,
      icon: copyrightIcon,
      ...copyright,
    });
  }

  // 3.ICP 备案信息
  if (icpRecord) data.push({ icon: icpRecordIcon, ...icpRecord });

  // 4.网络安全备案信息
  if (securityRecord) {
    data.push({ icon: securityRecordImg, iconType: "img", imgAlt: "Security Record", ...securityRecord });
  }

  return data;
});
</script>

<template>
  <div
    v-if="footerInfo || social.length"
    :class="[ns.b(), ns.join('wallpaper-outside')]"
    role="contentinfo"
    :aria-label="t('mt.footerInfo.label')"
  >
    <div
      v-if="social.length"
      :class="`${ns.e('icons')} flx-center`"
      role="group"
      :aria-label="t('mt.footerInfo.socialLabel')"
    >
      <a
        v-for="(item, index) in social"
        :key="index"
        :href="item.link && withBase(item.link)"
        :title="item.name"
        target="_blank"
        :aria-label="item.name"
      >
        <template v-if="item.icon">
          <MtIcon
            :iconType="item.iconType"
            :icon="item.icon"
            size="20px"
            color="var(--vp-c-text-2)"
            hover
            :imgAlt="item.imgAlt"
            aria-hidden="true"
          />
        </template>
        <span v-else-if="item.name">{{ item.name }}</span>
      </a>
    </div>

    <template v-if="footerInfo">
      <p v-for="(message, index) in [footerInfo.topMessage || []].flat()" :key="index" v-html="message" />

      <div :class="`${ns.e('list')} flx-wrap-justify-center`" role="list" :aria-label="t('mt.footerInfo.infoLabel')">
        <div
          v-for="item in footerData"
          :key="item.name"
          :class="`${ns.e('list__item')} flx-align-center`"
          role="listitem"
        >
          <template v-if="item.icon">
            <MtIcon
              :iconType="item.iconType"
              :icon="item.icon"
              size="16px"
              color="var(--vp-c-text-2)"
              :imgAlt="item.imgAlt"
              aria-hidden="true"
            />
          </template>

          <a v-if="item.link" :href="withBase(item.link)" target="_blank" :aria-label="item.name">
            {{ item.name }}
          </a>
          <span v-else>{{ item.name }}</span>
        </div>

        <span v-if="footerInfo.customHtml" v-html="footerInfo.customHtml" />
      </div>

      <p v-for="(message, index) in [footerInfo.bottomMessage || []].flat()" :key="index" v-html="message" />
    </template>
  </div>
</template>
