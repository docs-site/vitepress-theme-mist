/**
 * @file index.ts
 * @brief DataLoader 组件的入口文件
 * @details 该文件负责导出 DataLoader 组件及其相关类型，提供了多种导入方式以适应不同的使用场景
 */

/**
 * @brief 导入 DataLoader 组件的实现
 * @details 从 Vue 单文件组件中导入 DataLoader 组件的具体实现
 *
 * 导入方式：
 * @code
 * import DataLoader from "./src/DataLoader.vue";
 * @endcode
 */
import DataLoader from "./src/DataLoader.vue";

/**
 * @brief 命名导出 DataLoader 组件
 * @details 将 DataLoader 组件以 MtDataLoader 的别名进行命名导出，便于在批量导入时使用统一的命名空间前缀
 *
 * 使用方式：
 * @code
 * // 在其他模块中导入
 * import { MtDataLoader } from "@docs-site/components";
 *
 * // 在模板中使用
 * // <MtDataLoader />
 * @endcode
 *
 * @export
 */
export { DataLoader as MtDataLoader };

/**
 * @brief 默认导出 DataLoader 组件
 * @details 将 DataLoader 组件作为该模块的默认导出，兼容传统的组件导入方式
 *
 * 使用方式：
 * @code
 * // 在其他模块中导入
 * import DataLoader from "@docs-site/components/common/DataLoader";
 *
 * // 在模板中注册后使用
 * // app.component('DataLoader', DataLoader);
 * // <DataLoader />
 * @endcode
 *
 * @export
 */
export default DataLoader;

/**
 * @brief 从 DataLoader.ts 文件中导入类型定义并重新导出
 * @details 导入 DataLoaderOptions 类型，并以 MtDataLoaderOptions 的别名导出
 *
 * 使用方式：
 * @code
 * // 在其他模块中导入类型
 * import { MtDataLoaderOptions } from "@docs-site/components";
 *
 * // 或者使用解构导入
 * import type { MtDataLoaderOptions } from "@docs-site/components";
 *
 * // 在组件中使用类型
 * const options: MtDataLoaderOptions = {
 *   showSiteData: true,
 *   showPageData: true
 * };
 * @endcode
 *
 * @export
 */
export type { DataLoaderOptions as MtDataLoaderOptions } from "./src/DataLoader";

/**
 * @brief 重新导出 instance.ts 文件中的所有导出
 * @details 主要包含 DataLoaderInstance 类型定义，用于获取组件实例的类型信息
 *
 * 使用方式：
 * @code
 * // 在其他模块中导入类型
 * import type { DataLoaderInstance } from "@docs-site/components";
 *
 * // 在模板引用中使用类型
 * const dataLoaderRef = ref<DataLoaderInstance>();
 * @endcode
 *
 * @export
 */
export * from "./src/instance";
