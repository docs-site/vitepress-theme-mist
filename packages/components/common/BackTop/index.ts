/**
 * @file index.ts
 * @brief BackTop 组件的入口文件
 * @details 该文件负责导出 BackTop 组件及其相关类型，提供了多种导入方式以适应不同的使用场景
 */

/**
 * @brief 导入 BackTop 组件的实现
 * @details 从 Vue 单文件组件中导入 BackTop 组件的具体实现
 *
 * 导入方式：
 * @code
 * import BackTop from "./src/BackTop.vue";
 * @endcode
 */
import BackTop from "./src/BackTop.vue";

/**
 * @brief 命名导出 BackTop 组件
 * @details 将 BackTop 组件以 MtBackTop 的别名进行命名导出，便于在批量导入时使用统一的命名空间前缀
 *
 * 使用方式：
 * @code
 * // 在其他模块中导入
 * import { MtBackTop } from "@docs-site/components";
 *
 * // 在模板中使用
 * // <MtBackTop />
 * @endcode
 *
 * @export
 */
export { BackTop as MtBackTop };

/**
 * @brief 默认导出 BackTop 组件
 * @details 将 BackTop 组件作为该模块的默认导出，兼容传统的组件导入方式
 *
 * 使用方式：
 * @code
 * // 在其他模块中导入
 * import BackTop from "@docs-site/components/common/BackTop";
 *
 * // 在模板中注册后使用
 * // app.component('BackTop', BackTop);
 * // <BackTop />
 * @endcode
 *
 * @export
 */
export default BackTop;

/**
 * @brief 从 BackTop.ts 文件中导入类型定义并重新导出
 * @details 导入 BackTopExpose 类型，并以 MtBackTopExpose 的别名导出
 *
 * 使用方式：
 * @code
 * // 在其他模块中导入类型
 * import { MtBackTopExpose } from "@docs-site/components";
 *
 * // 或者使用解构导入
 * import type { MtBackTopExpose } from "@docs-site/components";
 *
 * // 在组件中使用类型
 * const expose: MtBackTopExpose = {
 *   scrollToTop: () => {},
 *   getScrollProgress: () => 0,
 *   getVisibility: () => false
 * };
 * @endcode
 *
 * @export
 */
export type { BackTopExpose as MtBackTopExpose } from "./src/BackTop";

/**
 * @brief 重新导出 instance.ts 文件中的所有导出
 * @details 主要包含 BackTopInstance 类型定义，用于获取组件实例的类型信息
 *
 * 使用方式：
 * @code
 * // 在其他模块中导入类型
 * import type { BackTopInstance } from "@docs-site/components";
 *
 * // 在模板引用中使用类型
 * const backTopRef = ref<BackTopInstance>();
 * @endcode
 *
 * @export
 */
export * from "./src/instance";
