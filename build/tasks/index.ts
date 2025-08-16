import fullBundle from "./full-bundle";
import modules from "./modules";

/**
 * @brief 导出所有构建任务
 * @details 该文件聚合了所有的构建任务，包括全量打包和模块化构建任务
 * @type {Array<Promise<any>>}
 */
export default [...fullBundle, ...modules];
