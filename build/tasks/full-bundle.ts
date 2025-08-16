import { resolve } from "path";
import { readFileSync } from "fs";
import { rollup } from "rollup";
import { minify as minifyPlugin } from "rollup-plugin-esbuild";
import banner2 from "rollup-plugin-banner2";
import picocolors from "picocolors";
import {
  projectPackage,
  target,
  mtOutput,
  mtRoot,
  writeBundles,
  outputPkgName,
  pkgCamelCaseName,
  plugins as commonPlugins,
  external,
  globals,
} from "../helper";

const pkg = JSON.parse(readFileSync(projectPackage, "utf-8"));

// 在 Rollup 中，banner 用于在打包生成的输出文件顶部添加一段文本。这段文本可以是版权声明、警告信息、版本号等任何你希望在文件开头显示的内容。
const banner = `/*! ${outputPkgName} v${pkg.version} */\n`;

/**
 * @brief 构建全量包（umd 和 esm 格式）
 * @param {boolean} [minify] - 是否压缩输出文件
 * @returns {Promise<void>}
 * @details 该函数会根据传入的参数决定是否压缩输出文件，并生成相应格式的全量包。
 *          支持两种格式：UMD（Universal Module Definition）和 ESM（ECMAScript Modules）。
 *          如果 minify 为 true，则会生成压缩版本的文件，文件名会带有 .min 后缀。
 */
const buildAll = async (minify?: boolean) => {
  const plugins = [...commonPlugins, banner2(() => banner)];
  if (minify) {
    plugins.push(
      minifyPlugin({
        target,
        sourceMap: false,
      })
    );
  }

  console.log(picocolors.cyan(`Starting build ${minify ? "compressed " : ""}full-bundle`));

  // 配置详情地址：https://cn.rollupjs.org/configuration-options/
  const bundle = await rollup({
    input: resolve(mtRoot, "index.ts"), // 打包入口文件
    plugins,
    external, // 指定外部依赖，Rollup 不会将这些依赖代码打包进去
    treeshake: true, // 允许移除未使用的导出和代码
  });

  await writeBundles(bundle, [
    {
      format: "umd",
      file: resolve(mtOutput, `index${minify ? ".min" : ""}.js`), // 打包后的文件路径
      exports: "named",
      name: pkgCamelCaseName, // 全局变量名称，通过这个变量名来访问打包后的入口文件，如浏览器端如果 window.${PKG_CAMEL_CASE_NAME} 访问
      sourcemap: false,
      globals, // 指定外部依赖: 当你将某些模块标记为 external 时，Rollup 不会将它们打包进最终的输出文件中。为了确保这些模块在运行时能够被正确引用，通过 globals 来指定这些模块对应的全局变量名称
    },
    {
      format: "esm",
      file: resolve(mtOutput, `index${minify ? ".min" : ""}.mjs`),
      sourcemap: false,
    },
  ]);

  const msg = minify
    ? "Successfully build compressed full-bundle for umd and esm"
    : "Successfully build full-bundle for umd and esm";

  console.log(picocolors.green(msg));
};

export default [buildAll(false), buildAll(true)];
