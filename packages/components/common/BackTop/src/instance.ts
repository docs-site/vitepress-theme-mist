/**
 * @file instance.ts
 * @brief BackTop 组件实例类型定义文件
 * @details 该文件定义了 BackTop 组件的实例类型，用于在引用组件实例时提供类型支持
 */

/**
 * @brief 导入 BackTop 组件的类型信息
 * @details 使用 import type 语法仅导入类型信息，不会产生运行时开销。
 * 这种方式专门用于类型检查和 TypeScript 编译，不会影响最终的 JavaScript 输出。
 *
 * 导入方式：
 * @code
 * import type BackTop from "./BackTop.vue";
 * @endcode
 *
 * @import
 */
import type BackTop from "./BackTop.vue";

/**
 * @brief 定义 BackTop 组件实例类型
 * @details 使用 TypeScript 内置的 InstanceType 工具类型获取 BackTop 组件的实例类型。
 * 该类型主要用于在模板引用（template refs）中获取组件实例时提供类型支持。
 *
 * 使用方式：
 * @code
 * // 在其他模块中导入类型
 * import type { BackTopInstance } from "@docs-site/components";
 *
 * // 在组件中使用类型
 * import { ref } from 'vue';
 * const backTopRef = ref<BackTopInstance>();
 *
 * // 访问组件实例的方法
 * // backTopRef.value?.scrollToTop();
 * // backTopRef.value?.getScrollProgress();
 * @endcode
 *
 * @export
 */
export type BackTopInstance = InstanceType<typeof BackTop>;
