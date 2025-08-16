import { sep } from "node:path";
import { pkgName, outputPkgName } from "./constants";
import { pkgRoot } from "./path";

/**
 * @brief dts 插件生成 .d.ts 文件时，默认会把组件目录下的 styles/*.ts 内容去掉，这里让插件保留
 * @type {any}
 * @details 逻辑与 VitePressThemeMistAlias 方法一样（位于 ./plugin）。
 *          该 resolver 会处理样式文件的路径替换，包括：
 *          1. 将 @${pkgName}/theme-chalk 替换为 ${outputPkgName}/theme-chalk
 *          2. 将 @${pkgName}/components/base/style/css 替换为 ${outputPkgName}/theme-chalk/base.css
 *          3. 将 @${pkgName}/components/base/style/index 替换为 ${outputPkgName}/theme-chalk/src/base.scss
 *          4. 移除 "use strict"; 声明和换行符
 *          5. 生成正确的 .d.ts 文件路径
 */
export const cssResolver: any = {
  name: "vitepress-theme-mist-css-resolver",
  supports: (id: string) => id.includes("/style/css.ts") || id.includes("/style/index.ts"),
  transform: ({ id, code }: { id: string; code: string }) => {
    // 逻辑与 VitePressThemeMistAlias 方法一样（位于 ./plugin）
    const sourceThemeChalk = `@${pkgName}/theme-chalk`;
    const sourceBaseCssChalk = `@${pkgName}/components/base/style/css`;
    const sourceBaseIndexChalk = `@${pkgName}/components/base/style/index`;
    const bundleThemeChalk = `${outputPkgName}/theme-chalk`;

    code = code.replaceAll(sourceThemeChalk, bundleThemeChalk);
    code = code.replaceAll(sourceBaseCssChalk, `${bundleThemeChalk}/base.css`);
    code = code.replaceAll(sourceBaseIndexChalk, `${bundleThemeChalk}/src/base.scss`);
    // 移除 `"use strict";` 和换行符
    code = code.replace(/"use strict";\s*/g, "");

    return [
      {
        path: id.replaceAll("/", sep).replace(pkgRoot, "./types").replace(".ts", ".d.ts"), // 替换为 ./types/**/xx.d.ts，即在 dist/types 目录生成 .d.ts 文件
        content: JSON.stringify(code),
      },
    ];
  },
};
