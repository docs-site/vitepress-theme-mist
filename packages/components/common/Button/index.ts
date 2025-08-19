/**
 * @file index.ts
 * @brief Button 组件的入口文件
 * @details 该文件负责导出 Button 组件及其相关类型，提供了多种导入方式以适应不同的使用场景
 */

/**
 * @brief 导入 Button 组件的实现
 * @details 从 Vue 单文件组件中导入 Button 组件的具体实现
 *
 * 导入方式：
 * @code
 * import Button from "./src/button.vue";
 * @endcode
 */
import Button from "./src/button.vue";

/**
 * @brief 命名导出 Button 组件
 * @details 将 Button 组件以 MtButton 的别名进行命名导出，便于在批量导入时使用统一的命名空间前缀
 *
 * 使用方式：
 * @code
 * // 在其他模块中导入
 * import { MtButton } from "@docs-site/components";
 *
 * // 在模板中使用
 * // <MtButton />
 * @endcode
 *
 * @export
 */
export { Button as MtButton };

/**
 * @brief 默认导出 Button 组件
 * @details 将 Button 组件作为该模块的默认导出，兼容传统的组件导入方式
 *
 * 使用方式：
 * @code
 * // 在其他模块中导入
 * import Button from "@docs-site/components/common/Button";
 *
 * // 在模板中注册后使用
 * // app.component('Button', Button);
 * // <Button />
 * @endcode
 *
 * @export
 */
export default Button;

/**
 * @brief 从 button.ts 文件中导入类型定义并重新导出
 * @details 导入 ButtonExpose 类型，并以 MtButtonExpose 的别名导出
 *
 * 使用方式：
 * @code
 * // 在其他模块中导入类型
 * import { MtButtonExpose } from "@docs-site/components";
 *
 * // 或者使用解构导入
 * import type { MtButtonExpose } from "@docs-site/components";
 *
 * // 在组件中使用类型
 * const expose: MtButtonExpose = {
 *   focus: () => {},
 *   blur: () => {}
 * };
 * @endcode
 *
 * @export
 */
export type { ButtonExpose as MtButtonExpose } from "./src/button";
export type { ButtonOption as MtButtonOption } from "./src/button";

/**
 * @brief 重新导出 instance.ts 文件中的所有导出
 * @details 主要包含 ButtonInstance 类型定义，用于获取组件实例的类型信息
 *
 * 使用方式：
 * @code
 * // 在其他模块中导入类型
 * import type { ButtonInstance } from "@docs-site/components";
 *
 * // 在模板引用中使用类型
 * const buttonRef = ref<ButtonInstance>();
 * @endcode
 *
 * @export
 */
export * from "./src/instance";
