<script setup lang="ts" name="FooterGroup">
import type { FooterGroup } from "@mist/config";
import { useNamespace } from "@mist/composables";
import { isExternal } from "@mist/helper";
import { externalLinkIcon } from "@mist/static";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { MtIcon } from "@mist/components/common/Icon";

defineOptions({ name: "FooterGroup" });

const ns = useNamespace("footer-group");

const { getMistConfigRef } = useMistConfig();

const footerGroupConfig = getMistConfigRef<FooterGroup[]>("footerGroup", []);
</script>

<template>
  <div v-if="footerGroupConfig.length" :class="ns.b()">
    <div v-for="(group, index) in footerGroupConfig" :key="(group.title || '') + index">
      <div :class="[ns.e('title'), 'flx-center']">
        <MtIcon v-if="group.icon" :icon="group.icon" style="margin-right: 4px" aria-hidden="true" />
        {{ group.title }}
      </div>

      <ul>
        <li v-for="(link, idx) in group.links || []" :key="(link.name || '') + idx" :class="[ns.e('link')]">
          <MtIcon v-if="link.icon" :icon="link.icon" style="margin-right: 4px" aria-hidden="true" />
          <a
            :name="link.name"
            :href="link.link"
            :title="link.name"
            :target="isExternal(link.link || '') ? '_blank' : '_self'"
            class="hover-color"
            :aria-label="link.name"
            rel="noopener noreferrer"
            :aria-describedby="link.name"
          >
            <span class="sle">{{ link.name }}</span>
            <MtIcon
              v-if="isExternal(link.link || '')"
              :icon="externalLinkIcon"
              :class="ns.e('link__external-icon')"
              aria-hidden="true"
            />
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
