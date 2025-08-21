/**
 * @file ConfigProvider 模块
 * @brief 提供主题配置管理功能，用于创建和配置布局组件。
 */
import type { Component } from "vue";
import { defineComponent, h} from "vue";

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
 * 一些全局逻辑或往所有组件里注入常用数据，因为这是在所有组件加载前执行的逻辑。比如 Teek 注入了文章信息数据、
 * 并开启一些监听器等。相比较直接用 h 函数来构建组件，defineComponent 函数更灵活，多了一个中间层方便实现一些逻辑。
 */
export const MistConfigProvider = (layout: Component) => {
  return defineComponent({
    name: "MistConfigProvider",
    setup(_, { slots }) {
      // 自定义一些全局逻辑
      return () => h(layout, null, slots);
    },
  });
};
