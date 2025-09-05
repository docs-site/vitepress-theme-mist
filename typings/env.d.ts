/**
 * @file env.d.ts
 * @brief TypeScript 声明文件，用于声明模块类型
 * @author Your Name
 * @date 2025-09-05
 */

/**
 * @brief 声明所有以 .data.ts 结尾的模块
 * @details 这个声明告诉 TypeScript 编译器，所有以 .data.ts 结尾的文件都导出一个名为 data 的常量，
 *          其类型为 any。这通常用于数据文件，允许 TypeScript 正确处理这些模块的导入。
 */
declare module "*.data.ts" {
  export const data: any;
}

/**
 * @brief 声明所有以 .vue 结尾的模块
 * @details 这个声明告诉 TypeScript 编译器，所有以 .vue 结尾的文件都导出一个 Vue 组件。
 *          它导入 Vue 的 DefineComponent 类型，并声明一个组件默认导出。
 */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, any>;
  export default component;
}
