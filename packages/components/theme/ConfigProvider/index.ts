/**
 * @file ConfigProvider 模块
 * @brief 提供主题配置管理功能，用于创建和配置布局组件。
 */
import type { WindowTransition, MistConfig } from "@mist/config";
import type { PostData } from "@mist/config/post/types";
import { emptyPost } from "@mist/config/post/helper";
import type { Component, Ref, InjectionKey } from "vue";
import { computed, defineComponent, h, inject, unref } from "vue";
import { useData } from "vitepress";
import { isFunction, isObject } from "@mist/helper";
import { useAnchorScroll } from "@mist/composables";
export const mistConfigContext: InjectionKey<MistConfig | Ref<MistConfig>> = Symbol("mistConfig");

/**
 * @brief 创建并返回一个配置好的 Layout 组件，此函数接收一个 Vue 组件作为参数，将其封装成一个新的组件，
 *        并通过 Vue 的 h 函数渲染传入的 layout 组件。
 * @param layout - 要被封装和渲染的 Vue 布局组件
 * @returns 返回一个由 defineComponent 定义的新 Vue 组件
 * @example
 * ```typescript
 * import MyLayout from './MyLayout.vue';
 * const ConfiguredLayout = MistConfigProvider(MyLayout);
 * ```
 * @description defineComponent 函数的返回值还是使用了 h 函数 + .vue 组件，但是这样好处在于可以添加
 * 一些全局逻辑或往所有组件里注入常用数据，因为这是在所有组件加载前执行的逻辑。比如 Mist 注入了文章信息数据、
 * 并开启一些监听器等。相比较直接用 h 函数来构建组件，defineComponent 函数更灵活，多了一个中间层方便实现一些逻辑。
 */
export const MistConfigProvider = (layout: Component) => {
  return defineComponent({
    name: "MistConfigProvider",
    setup(_, { slots }) {
      // 自定义一些全局逻辑
      useAnchorScroll().startWatch(); // 监听浏览器滚动，当滚动到锚点，自动在 URL 后面添加锚点信息
      return () => h(layout, null, slots);
    },
  });
};

/**
 * 获取 Mist 的主题配置数据
 * 支持（优先级） provide > frontmatter.mt.[key] > frontmatter.[key] > theme.[key] 4 种方式进行主题配置
 */
export const useMistConfig = () => {
  const { theme, frontmatter } = useData();
  const mistConfigProvide = inject(mistConfigContext, {});

  /**
   * @brief 获取 Mist 的主题配置数据
   * @param key 配置项 key
   * @param defaultValue 如果读取 key 不存在时，则返回默认值
   */
  const getMistConfig = <T = any>(key?: keyof MistConfig | null, defaultValue?: any): T => {
    let dv = defaultValue;
    if (isFunction(defaultValue)) dv = defaultValue();

    // 返回所有 MistConfig 数据
    if (!key) {
      return { ...dv, ...theme.value, ...frontmatter.value, ...frontmatter.value.mt, ...unref(mistConfigProvide) };
    }

    // 返回指定 key 的 MistConfig 数据
    const valueFromTheme = theme.value[key];
    const valueFromFrontmatter = frontmatter.value.mt?.[key] ?? frontmatter.value[key];
    const valueFromInject = unref(mistConfigProvide)[key];

    // 对象格式，根据优先级合并里面的内容
    if (isObject(valueFromTheme) || isObject(valueFromFrontmatter) || isObject(valueFromInject)) {
      return { ...dv, ...valueFromTheme, ...valueFromFrontmatter, ...(valueFromInject as object) };
    }

    // 非对象格式，则根据优先级返回
    return valueFromInject ?? valueFromFrontmatter ?? valueFromTheme ?? dv;
  };

  /**
   * @brief 获取 Mist 的主题配置数据（响应式）
   * @details 该函数返回一个响应式的 computed 引用，当配置数据发生变化时会自动更新。
   *          支持（优先级） provide > frontmatter.mt.[key] > frontmatter.[key] > theme.[key] 4 种方式进行主题配置。
   *          适用于需要在模板中响应式获取配置数据的场景。
   * @tparam T 返回数据的类型，默认为 any
   * @param key 配置项的键名，可选参数。如果为 null 或 undefined，则返回完整的配置对象
   * @param defaultValue 默认值，当指定的 key 不存在时返回，可选参数。可以是函数，函数返回值将作为默认值
   * @return 返回一个 Vue 的 computed 响应式引用，包含请求的配置数据
   */
  const getMistConfigRef = <T = any>(key?: keyof MistConfig | null, defaultValue?: any) => {
    return computed(() => getMistConfig<T>(key, defaultValue));
  };

  return { getMistConfig, getMistConfigRef };
};
/**
 * @brief 返回功能页面状态
 */
export const usePageState = () => {
  const { frontmatter } = useData();

  // 当前页面是否为首页
  const isHomePage = computed(
    () => !isCategoriesPage.value && !isTagsPage.value && frontmatter.value.layout === "home"
  );
  // 当前页面是否为分类页
  const isCategoriesPage = computed(() => !!frontmatter.value.categoriesPage);
  // 当前页面是否为标签页
  const isTagsPage = computed(() => !!frontmatter.value.tagsPage);
  // 当前页面是否为归档页
  const isArchivesPage = computed(() => !!frontmatter.value.archivesPage);
  // 当前页面是否为目录页
  const isCataloguePage = computed(() => !!frontmatter.value.catalogue);
  // 当前页面是否为文章清单页
  const isArticleOverviewPage = computed(() => !!frontmatter.value.articleOverviewPage);
  // 当前页面是否为登录页
  const isLoginUrl = computed(() => !!frontmatter.value.loginPage);
  // 当前页面是否为风险链接页
  const isRiskLinkPage = computed(() => !!frontmatter.value.riskLinkPage);
  // 当前页面是否为导航页
  const isNavigation = computed(() => !!frontmatter.value.navigation || !!frontmatter.value.Navigation);

  return {
    isHomePage,
    isCategoriesPage,
    isTagsPage,
    isArchivesPage,
    isCataloguePage,
    isArticleOverviewPage,
    isLoginUrl,
    isRiskLinkPage,
    isNavigation,
  };
};

/**
 * 返回全部文章数据
 */
export const useAllPosts = (): PostData => {
  const { theme } = useData();
  const posts = theme.value.posts;

  return posts || emptyPost;
};

/**
 * 返回文章数据，当处于国际化环境时，返回对应语言的 Posts 数据，否则返回全部 Posts 数据
 */
export const usePosts = (): Ref<PostData> => {
  const { localeIndex } = useData();
  const posts = useAllPosts();

  // 兼容国际化功能，先从多语言下获取 posts 数据，获取不到说明没有使用多语言功能，则获取所有 posts 数据。因为多语言可以随时切换，因此使用 computed
  return computed(() => posts.locales?.[localeIndex.value] || posts);
};

export const useWindowTransitionConfig = (condition?: (windowTransition: WindowTransition) => boolean | undefined) => {
  const { getMistConfigRef } = useMistConfig();
  const windowTransitionConfig = getMistConfigRef<WindowTransition>("windowTransition", true);

  return computed(() => {
    const windowTransition = windowTransitionConfig.value;
    if (windowTransition === undefined) return true;

    return isObject(windowTransition) ? (condition?.(windowTransition) ?? true) : windowTransition !== false;
  });
};
