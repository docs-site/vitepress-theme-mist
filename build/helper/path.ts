/// <reference types="node" />
// 显式引入 Node.js 类型定义。
// 虽然项目可能已在 tsconfig 中配置了 Node.js 类型，
// 但在此文件中显式声明可确保 TypeScript 正确识别 __dirname、process 等 Node.js 全局变量及 path 等模块的类型，
// 提供更可靠的类型检查和开发体验。

import { resolve } from "path";
import { pkgName, outputPkgName } from "./constants";

/** 项目根目录 `/`  */
export const projectRoot = resolve(__dirname, "..", "..");
/** `/packages` */
export const pkgRoot = resolve(projectRoot, "packages");
/** `/packages/mist` (基于 pkgName = "mist") */
export const mtRoot = resolve(pkgRoot, pkgName);

/** `docs` */
export const docsDirName = "docs";
export const docRoot = resolve(projectRoot, docsDirName);
export const vpRoot = resolve(docRoot, ".vitepress");

/** `/dist` */
export const buildOutput = resolve(projectRoot, "dist");
/** `/dist/vitepress-theme-mist` (基于 outputPkgName = "vitepress-theme-mist") */
export const mtOutput = resolve(buildOutput, outputPkgName);
/** `/dist/types` */
export const tsOutput = resolve(buildOutput, "types");

/** `/packages/mist/package.json` (基于 mtRoot) */
export const mtPackage = resolve(mtRoot, "package-release.json");
/** `/package.json` */
export const projectPackage = resolve(projectRoot, "package.json");
/** `/docs/package.json` */
export const docPackage = resolve(docRoot, "package.json");

/** `/tsconfig.web.json` */
export const webTsConfig = resolve(projectRoot, "tsconfig.web.json");

/** `/dist/vitepress-theme-mist/theme-chalk` (基于 mtOutput) */
export const tcOutput = resolve(mtOutput, "theme-chalk");
