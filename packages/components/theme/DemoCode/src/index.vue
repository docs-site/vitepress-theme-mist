<script setup lang="ts" name="DemoCode">
import type { DemoCodeProps } from "./demoCode";
import { ref, computed, defineAsyncComponent } from "vue";
import { useData } from "vitepress";
import { useNamespace, useLocale, useClipboard } from "@mist/composables";
import { playgroundIcon, githubIcon, copyIcon, codeIcon, caretTopIcon } from "@mist/static";
import { MtMessage } from "@mist/components/common/Message";
import { MtTransitionCollapse } from "@mist/components/common/TransitionCollapse";
import { MtIcon } from "@mist/components/common/Icon";

defineOptions({ name: "DemoCode" });

const props = defineProps<DemoCodeProps>();

const ns = useNamespace("demo-code");
const { t } = useLocale();
const { copy, copied, isSupported } = useClipboard();
const { frontmatter, isDark } = useData();

const {
  playgroundUrl = "",
  playgroundMainFileName = "App.vue",
  githubUrl = "",
  playgroundButtonTip = t("mt.demoCode.playground"),
  githubButtonTip = t("mt.demoCode.github"),
  copyButtonTip = t("mt.demoCode.copy"),
  collapseSourceButtonTip = t("mt.demoCode.collapseSource"),
  expandSourceButtonTip = t("mt.demoCode.expandSource"),
} = { ...JSON.parse(decodeURIComponent(props.options)), ...frontmatter.value.demo };

const decodeSource = computed(() => decodeURIComponent(props.source));
const decodeRawSource = computed(() => decodeURIComponent(props.rawSource));
const decodedDescription = computed(() => decodeURIComponent(props.description));
const effect = computed(() => props.effect === "true");

// 预加载 Demo 组件，防止 VitePress 打包时不包含 Demo 组件
// 注意："/test" 是 demo 组件的默认路径前缀，如需修改请同步更新此处
const moduleFiles = (import.meta as any).glob("/test/**/*.vue", { eager: true });

const DemoComponent = defineAsyncComponent(async () => {
  try {
    const key = Object.keys(moduleFiles).find(i => i.endsWith(`/${props.path}`)) as string;
    return moduleFiles[key];
  } catch (error) {
    console.error(`[Mist Error] Failed to load component: '/${props.path}'`, error);
  }
});

const sourceVisible = ref(false);

/**
 * 切换源代码显示状态
 */
const handleToggleSourceVisible = (bol?: boolean) => {
  if (bol !== undefined) sourceVisible.value = bol;
  else sourceVisible.value = !sourceVisible.value;
};

/**
 * 去 Playground 编辑
 */
const handleEditPlayground = () => {
  const encoded = getPlaygroundEncoded(props.source);
  const darkParam = isDark.value ? "?theme=dark" : "";
  const link = playgroundUrl.includes("?")
    ? `${playgroundUrl}${darkParam.replace("?", "&")}`
    : `${playgroundUrl}${darkParam}`;

  const url = `${link.replace(/\/$/, "")}/#${encoded}`;
  window.open(url, "_blank");
};

const getPlaygroundEncoded = (source: string) => {
  const code = decodeURIComponent(source);
  const originCode = {
    [playgroundMainFileName]: code,
  };
  const encoded = btoa(JSON.stringify(originCode));
  return encoded;
};

/**
 * 去 Github 编辑
 */
const handleEditGithub = () => {
  const url = `${githubUrl}/${props.path}`;
  window.open(url, "_blank");
};

/**
 * 复制源代码
 */
const copyCode = async () => {
  if (!isSupported) console.error(t("mt.demoCode.notSupport"));

  await copy(decodeRawSource.value);

  copied.value
    ? MtMessage.success({
        message: t("mt.demoCode.copySuccess"),
        plain: true,
      })
    : MtMessage.error({
        message: t("mt.demoCode.copyFail"),
        plain: true,
      });
};
</script>

<template>
  <div v-if="decodedDescription" :class="ns.b('description')" v-html="decodedDescription" />

  <component v-if="effect" :is="DemoComponent" />

  <div v-else :class="ns.b()">
    <div :class="ns.e('effect')">
      <component :is="DemoComponent" />
    </div>

    <div :class="ns.e('button-group')">
      <slot name="mist-demo-code-button-left" />

      <MtIcon
        v-if="playgroundUrl"
        :title="playgroundButtonTip"
        @click="handleEditPlayground"
        :icon="playgroundIcon"
        role="link"
        :aria-label="playgroundButtonTip"
      />
      <MtIcon
        v-if="githubUrl"
        :title="githubButtonTip"
        @click="handleEditGithub"
        :icon="githubIcon"
        role="link"
        :aria-label="githubUrl"
      />
      <MtIcon :title="copyButtonTip" :icon="copyIcon" @click="copyCode" role="button" :aria-label="copyButtonTip" />
      <MtIcon
        :title="sourceVisible ? expandSourceButtonTip : collapseSourceButtonTip"
        @click="handleToggleSourceVisible()"
        :icon="codeIcon"
        role="button"
        :aria-label="sourceVisible ? expandSourceButtonTip : collapseSourceButtonTip"
      />

      <slot name="mist-demo-code-button-right" />
    </div>

    <MtTransitionCollapse>
      <div v-show="sourceVisible" :class="ns.join('vp-code')" v-html="decodeSource" />
    </MtTransitionCollapse>

    <Transition :name="ns.join('fade-linear')">
      <div
        v-show="sourceVisible"
        :class="ns.e('float-control')"
        @click="handleToggleSourceVisible(false)"
        role="button"
      >
        <MtIcon :icon="caretTopIcon" />
        <span>{{ expandSourceButtonTip }}</span>
      </div>
    </Transition>
  </div>
</template>
