import { defineBuildConfig } from "unbuild";

/**
 * @brief unbuild 构建配置
 * @details 该配置文件定义了如何使用 unbuild 工具进行项目构建
 *          配置包括入口文件、清理选项、类型声明生成以及 Rollup 相关设置
 * @type {import("unbuild").BuildConfig}
 */
export default defineBuildConfig({
  entries: ["index"],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
});
