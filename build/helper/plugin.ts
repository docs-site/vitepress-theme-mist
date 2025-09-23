import type { Plugin } from "rollup";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import esbuild from "rollup-plugin-esbuild";
import postcss from "rollup-plugin-postcss";
import vuePlugin from "@vitejs/plugin-vue";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import url from "@rollup/plugin-url";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { pkgName, outputPkgName, target, simplePkgName } from "./constants";

// rollup 插件。rollup 本身只支持原生 JavaScript 文件打包，如果项目包含 vue、json 等非原生 JavaScript 文件，则利用插件来支持打包
export const plugins = [
  vitepressThemeMistClearConsole(),
  VitePressThemeMistStyleAlias(),
  vuePlugin({ isProduction: true }),
  json(),
  // 解析和处理 Node.js 风格的模块导入语句（如 `import something from 'my-package'`），因为 Rollup 本身默认仅支持 ES 模块导入（即通过相对或绝对路径导入本地文件）
  nodeResolve({
    extensions: [".mjs", ".js", ".json", ".ts"],
  }),
  commonjs(),
  url({ include: ["**/*.png", "**/*.jpg"] }),
  postcss({
    namedExports: true,
    extract: "index.css", // 所有样式放到 index.css 下
    plugins: [autoprefixer(), cssnano()],
  }),
  // 利用 esbuild 打包，能提高打包速度
  esbuild({
    sourceMap: false,
    target,
    treeShaking: true,
    loaders: {
      ".vue": "ts",
    },
  }),
];

/**
 * @brief 创建一个 Rollup 插件，用于将组件目录下的 style/*.ts 里的引入替换为实际的样式路径
 * @returns {Plugin} 返回一个 Rollup 插件对象
 * @details 该插件会拦截模块解析过程，将指向 `@{pkgName}/theme-chalk` 的导入语句重定向到实际的打包后路径
 */
export function VitePressThemeMistStyleAlias(): Plugin {
  const themeChalk = "theme-chalk";
  const sourceThemeChalk = `@${pkgName}/${themeChalk}`;
  const bundleThemeChalk = `${outputPkgName}/${themeChalk}`;

  return {
    name: "vitepress-theme-mist-alias-style-plugin",
    resolveId(id) {
      if (!id.startsWith(sourceThemeChalk)) return;

      id = id.replace("vp-plus/", `${simplePkgName}-`).replace("mt-plus/", `${simplePkgName}-`).replace("scss", "css");
      return {
        id: id.replaceAll(sourceThemeChalk, bundleThemeChalk),
        external: "absolute",
      };
    },
  };
}

/**
 * @brief 创建一个 Rollup 插件，用于将组件目录下的 style/*.ts 里的 @element-plus 替换为实际的 element-plus 组件样式路径
 * @param {("esm"|"cjs")} format - 指定模块格式，"esm" 表示 ES 模块，"cjs" 表示 CommonJS 模块
 * @returns {Plugin} 返回一个 Rollup 插件对象
 * @details 该插件会拦截模块解析过程，将指向 `@element-plus` 的导入语句重定向到实际的 element-plus 组件样式路径
 * @deprecated 已不需要，因为 mist 已卸载 element-plus
 */
export function VitePressThemeMistElementPlusAlias(format: "esm" | "cjs"): Plugin {
  const sourceName = `@element-plus`;
  const module = format === "esm" ? "es" : "lib";
  const ext = format === "esm" ? ".mjs" : ".js";
  const bundleStyle = `element-plus/${module}/components`;

  return {
    name: "vitepress-theme-mist-element-plus-alias-plugin",
    resolveId(id) {
      if (!id.startsWith(sourceName)) return;
      return {
        id: id.replaceAll(sourceName, bundleStyle) + ext,
        external: "absolute",
      };
    },
  };
}

/**
 * @brief 创建一个 Rollup 插件，用于清除代码中的 console.log 语句
 * @returns {Plugin} 返回一个 Rollup 插件对象
 * @details 该插件会在代码转换阶段移除所有匹配正则表达式 /console\.log\([^)]*\);?\n?/g 的语句
 */
export function vitepressThemeMistClearConsole(): Plugin {
  const reg = /console\.log\([^)]*\);?\n?/g;
  return {
    name: "vitepress-theme-mist-clear-console-plugin",
    transform(code, id) {
      if (id.endsWith(".ts") || id.endsWith(".vue")) {
        const transformedCode = code.replace(reg, "");
        return transformedCode;
      }
      return code;
    },
  };
}
