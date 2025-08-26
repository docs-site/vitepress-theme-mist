import { OutputOptions, RollupBuild } from "rollup";

/**
 * @brief 将 Rollup 构建结果写入到指定的输出选项中
 * @param {RollupBuild} bundle - Rollup 构建对象
 * @param {OutputOptions[]} options - 输出选项数组
 * @returns {Promise<any[]>} 返回一个 Promise，解析为所有写入操作的结果数组
 * @details 该函数接收一个 Rollup 构建对象和一组输出选项，然后并行执行所有输出选项的写入操作
 */
export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map(option => bundle.write(option)));
}

/**
 * @brief 通过提供的函数获取 Rollup 构建对象，并将其写入到指定的输出选项中
 * @param {(format: "esm" | "cjs") => Promise<RollupBuild>} getBundleFn - 返回 Rollup 构建对象的函数
 * @param {OutputOptions[]} options - 输出选项数组
 * @returns {Promise<void[]>} 返回一个 Promise，解析为空数组
 * @details 该函数接收一个返回 Rollup 构建对象的函数和一组输出选项，
 *          然后为每个输出选项调用该函数获取构建对象，并执行写入操作
 *
 */
export function writeBundlesFn(getBundleFn: (format: "esm" | "cjs") => Promise<RollupBuild>, options: OutputOptions[]) {
  return Promise.all(
    options.map(async option => {
      const bundle = await getBundleFn(option.format as "esm" | "cjs");
      await bundle.write(option);
    })
  );
}
