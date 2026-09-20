---
title: LV109-自动侧边栏之rewrites模式
date: 2026-09-20 19:48:48
icon: famicons:logo-markdown
permalink: /sdoc/plugin/standalone-plugin/126d5cf377200ebb78685c6c
index: true
tags:
categories:
copyright: false
keywords:
cover:
comments:
mathjax:
top:
description:
tdoc:
  detailDate: 2026-09-20 19:48:48.235
  fulluuid: b78685c6c28946efbfd47a95a9edc97e
  useduuid: b78685c6c
---

<!-- more -->

rewrites 模式解决的是"永久链接与侧边栏脱钩"的问题：文档用 tdoc 配 permalink 之后，访问地址不再是文件路径，如果侧边栏还按文件路径生成链接，点进去就是 404。该模式以 rewrites 重写表为数据源，让侧边栏链接与永久链接始终一致。

本文是自动侧边栏系列第四篇，前置阅读：[LV070-永久链接](./LV070-永久链接.md)（permalink 机制）、[LV100-自动侧边栏总览](./LV100-自动侧边栏总览.md)（模式判定）。源码位于 [`plugins/vitepress-auto-nav-sidebar/src/rewritesToSidebar.ts`](https://github.com/docs-site/vitepress-theme-mist/blob/main/plugins/vitepress-auto-nav-sidebar/src/rewritesToSidebar.ts) 与 [`rewritesToNavigation.ts`](https://github.com/docs-site/vitepress-theme-mist/blob/main/plugins/vitepress-auto-nav-sidebar/src/rewritesToNavigation.ts)。

## 一、为什么需要 rewrites 模式

### 1. permalink 的两种落地方式

VitePress 原生**没有** frontmatter `permalink` 路由功能（全文检索 VitePress 源码没有任何 frontmatter permalink 的路由处理）。`vitepress-plugin-permalink` 提供了两种方式补上这块能力：

（1）**Vite 插件方式**（mist 主题默认注册）：路由仍是文件路径，permalink 靠"访问拦截"实现——dev 环境用中间件把 permalink URL 重写回真实文件路径，build 后靠注入到 404 页的延迟跳转组件兜底。此方式下 `themeConfig.permalinks` 只是一份映射表，页面路由没有变；

（2）**createRewrites 方式**：在站点配置里直接写 `rewrites: createRewrites({ srcDir: "src" })`，把每个文件的 frontmatter permalink 转成 VitePress 原生 `rewrites` 条目，**页面路由真正变成永久链接**。

```typescript
// docs/src/.vitepress/config.mts
import { createRewrites } from "../../../packages/config";

export default defineConfig({
  extends: myThemeConfig,
  rewrites: createRewrites({ srcDir: "src" }), // 启用后路由 = permalink
});
```

### 2. 侧边栏必须跟着路由走

路由一旦变成 permalink（方式二），filePath 模式生成的 `/sdoc/01-开发/LV001-xxx` 链接就全部失效。rewrites 模式的职责就是改用重写表生成链接，保证链接与路由一致。反之，只要没有启用 createRewrites（方式一或完全不用 permalink），就必须用 filePath 模式——两种模式没有优劣，只有与路由配置匹配与否。

## 二、模式自动判定

判定发生在插件 config 钩子里（见 [LV100 总览](./LV100-自动侧边栏总览.md)第四节），条件是 `userConfig.rewrites.__create__ === "vitepress-plugin-permalink"` 且重写表非空。两个细节：

（1）读的是 `userConfig.rewrites`（用户原始配置对象），不是 VitePress 归一化后的 `config.vitepress.rewrites`。归一化后的 rewrites 是 `{ map, inv }` 结构、且不含 `__create__` 标记，所以判定只能在用户层做；

（2）手写 rewrites 不带标记，即使非空也只走 filePath 模式——模式判定与 permalink 插件深度绑定。

`createRewrites()` 的返回值首位就是标记（[`plugins/vitepress-plugin-permalink/src/rewrites.ts`](https://github.com/docs-site/vitepress-theme-mist/blob/main/plugins/vitepress-plugin-permalink/src/rewrites.ts#L47)）：

```typescript
// plugins/vitepress-plugin-permalink/src/rewrites.ts
return { __create__: "vitepress-plugin-permalink", ...pathToPermalink };
```

同一标记还用于 permalink 插件内部的自禁用（方式二启用时，AutoPermalink 跳过生成、UsePermalink 不再注入 404 跳转组件），三方靠这一个标记保持一致。

## 三、数据来源：createRewrites 生成重写表

`createRewrites({ srcDir })` 扫描 srcDir 下所有 md 的 frontmatter permalink，产出的重写表长这样（本站真实数据节选）：

```typescript
{
  __create__: "vitepress-plugin-permalink",
  "sdoc/01-开发/index.md": "sdoc/develop/126d5cf36f2f354aaaf41792.md",
  "sdoc/01-开发/LV001-pnpm工作区.md": "sdoc/develop/126d5cf36f313b46daa8a8ba.md",
  "sdoc/03-插件/01-独立插件包/LV010-file-content-loader.md": "sdoc/plugin/standalone-plugin/126d5cf36f313a80a26194d1.md",
  // ...每篇文档一条
}
```

键是相对 srcDir 的文件路径（补了 `.md` 后缀），值是 permalink 去掉开头 `/` 并统一 `.md` 后缀。注意值的结构是 `sdoc/<一级英文别名>/[<二级英文别名>/]<hex>`——英文别名来自 `sdoc/path-map.js` 里 tdoc 维护的目录映射，这解释了为什么 rewrites 模式下侧边栏 key 能拿到干净的英文段。

VitePress 加载配置后把这张表归一化为 `config.vitepress.rewrites = { map, inv }`，`map` 即上表去掉 `__create__`。

## 四、侧边栏生成流程

### 1. 预处理：剥掉键里的 sdoc 前缀

config 钩子先把 map 的键去掉 `sdoc/` 前缀再传给生成函数（[index.ts](https://github.com/docs-site/vitepress-theme-mist/blob/main/plugins/vitepress-auto-nav-sidebar/src/index.ts#L59-L72)）：

```typescript
// plugins/vitepress-auto-nav-sidebar/src/index.ts
const pathToRemove = option.sideBarOption?.path || "sdoc";
const filteredRewrites = Object.fromEntries(
  Object.entries(rewrites).map(([key, value]) => [key.replace(new RegExp(`^${pathToRemove}/`, "g"), ""), value])
);
```

目的：让 sdoc 成为侧边栏的基准目录。剥掉后 `01-开发` 成为目录树的顶层键，各一级目录才能分别生成自己的侧边栏 key；不剥的话全部条目会聚到同一个 `sdoc` key 下。**值保持原样**（仍带 `sdoc/` 前缀），后面取链接时再利用它。

### 2. buildDirectoryStructure：扁平表变目录树

把 `"01-开发/LV001-xxx.md": "sdoc/develop/<hex>.md"` 逐条按 `/` 切分、逐层下钻建树，最终每片叶子是"文件名 → 重写后路径"的键值对：

```json
{
  "01-开发": {
    "index.md": "sdoc/develop/126b07e425dd1639079fc233.md",
    "LV001-pnpm工作区.md": "sdoc/develop/126d5cf36f313b46daa8a8ba.md"
  },
  "03-插件": {
    "01-独立插件包": {
      "index.md": "sdoc/plugin/standalone-plugin/126d5cf36f2a30b61f1eb182.md",
      "LV010-file-content-loader.md": "sdoc/plugin/standalone-plugin/126d5cf36f313a80a26194d1.md"
    }
  }
}
```

### 3. 递归 createSidebarItems

与 filePath 模式共用同一套"序号稀疏数组 + 排序"算法（见 [LV106 第三节](./LV106-自动侧边栏之filePath模式.md)），差别只有两处：

（1）遍历的不是 `readdirSync` 的文件名数组，而是目录树的 `Object.entries`；叶子节点的类型来自目录树值（字符串）而非文件扩展名；

（2）**叶子链接直接取重写表的值**：`link: /${dirOrFileInfo}`，即 permalink 加 `.md`（VitePress 会自动处理 `.md` 后缀）。

同时它仍会做 `existsSync` 文件系统校验——重写表里有、磁盘上没有的条目会被丢弃，所以重写表与实际文件必须同步。

### 4. 组装侧边栏 key

一级目录处理完文件树后，key 取自重写表值的第一段（[rewritesToSidebar.ts](https://github.com/docs-site/vitepress-theme-mist/blob/main/plugins/vitepress-auto-nav-sidebar/src/rewritesToSidebar.ts#L107-L117)）：

```typescript
// plugins/vitepress-auto-nav-sidebar/src/rewritesToSidebar.ts
if (isSidebarObject) {
  // 值形如 sdoc/develop/<hex>.md，取第二段 develop（第一段固定是 sdoc）
  const path = rewrites[key].split("/")[1];
  sidebarObj[`/${docRootDir}/${path}/`] = initItems
    ? [
        /* 包一层 */
      ]
    : sidebarItems;
}
```

一级目录下任取一条重写规则，值的 `split("/")[1]` 就是该目录的英文别名（`develop`、`plugin`...），最终 key 形如 `/sdoc/plugin/`。这意味着**同一目录下的 rewrites 前缀必须一致**，否则后处理的 key 会覆盖先处理的——`checkRewritesPrefix` 配置项就是校验这件事的（但注意它在 auto-nav-sidebar 里未被接线，见 [LV112](./LV112-自动侧边栏的限制与避坑.md)）。

## 五、导航栏生成

[`rewritesToNavigation.ts`](https://github.com/docs-site/vitepress-theme-mist/blob/main/plugins/vitepress-auto-nav-sidebar/src/rewritesToNavigation.ts#L91-L149) 同样基于目录树递归，规则与 filePath 版导航栏不同：

（1）目录文本用 `/^\d+[.\-_]/` 去序号前缀（点、连字符、下划线都认）；

（2）**链接只来自 index.md**：目录树里有 `index.md` 条目才有 `link`（取其 permalink）；

（3）`maxLevel` 截断处的目录必须有 index.md 才显示——没有目录页的目录在到达层级上限时直接消失（未达上限还能作为下拉组存活）；

（4）有子目录时优先做下拉组（VitePress 的 NavItemChildren 不允许同时有 link 和 items）。

本站每级目录都有 tdoc 生成的 index.md，所以导航栏完整：一级四项，"组件""插件"带下拉。

## 六、完整生成过程模拟

沿用《侧边栏的 rewrite 模式》一文的经典教学示例（`01.指南` 结构，文件名带点分序号）来完整走一遍生成过程。与旧篇相比只有一处调整：永久链接的值换成 mist 现行的 `sdoc/<英文别名>/<24 位 hex>` 形态，使每一步都与当前源码的行为严格对应；处理逻辑本身与源码逐行吻合。

### 1. 输入：目录结构与永久链接

假设文档库结构如下（每个目录都有 index.md 目录页，是 mist 的固定约定）：

```text
docs/src/sdoc/
├── index.md
├── 01.指南/
│   ├── index.md
│   ├── 目录.md
│   ├── 01.简介/
│   │   ├── index.md
│   │   ├── 01.简介.md
│   │   └── 10.快速开始.md
│   └── 10.使用/
│       ├── index.md
│       ├── 05.Markdown 拓展.md
│       └── 10.摘要与封面.md
└── 15.主题开发/
    ├── index.md
    ├── 01.开发思路.md
    └── 10.主题配置.md
```

每篇文档的 frontmatter 里带 permalink（tdoc 生成），以 `01.简介.md` 为例：

```yaml
---
title: 简介
permalink: /sdoc/guide/intro/126b07e425dd1660d3e4f5a
---
```

### 2. 第一步：createRewrites 生成重写表

`createRewrites({ srcDir })` 扫描全部 md 的 permalink，产出"文件相对路径（补 `.md`）→ 永久链接（去开头 `/`、统一 `.md`）"的键值对：

```typescript
{
  __create__: "vitepress-plugin-permalink",
  "sdoc/index.md": "sdoc/126b07e425dd100a1b2c3d4.md",
  "sdoc/01.指南/index.md": "sdoc/guide/126b07e425dd1639079fc233.md",
  "sdoc/01.指南/目录.md": "sdoc/guide/126b07e425dd1640b1c2d3e.md",
  "sdoc/01.指南/01.简介/index.md": "sdoc/guide/intro/126b07e425dd1650c2d3e4f.md",
  "sdoc/01.指南/01.简介/01.简介.md": "sdoc/guide/intro/126b07e425dd1660d3e4f5a.md",
  "sdoc/01.指南/01.简介/10.快速开始.md": "sdoc/guide/intro/126b07e425dd1670e4f5a6b.md",
  "sdoc/01.指南/10.使用/index.md": "sdoc/guide/use/126b07e425dd1680f5a6b7c.md",
  "sdoc/01.指南/10.使用/05.Markdown 拓展.md": "sdoc/guide/use/126b07e425dd1690a6b7c8d.md",
  "sdoc/01.指南/10.使用/10.摘要与封面.md": "sdoc/guide/use/126b07e425dd16a0b7c8d9e.md",
  "sdoc/15.主题开发/index.md": "sdoc/develop/126b07e425dd16b0c8d9e0f.md",
  "sdoc/15.主题开发/01.开发思路.md": "sdoc/develop/126b07e425dd16c0d9e0f1a.md",
  "sdoc/15.主题开发/10.主题配置.md": "sdoc/develop/126b07e425dd16d0e0f1a2b.md"
}
```

这个对象被用户写进 `rewrites` 配置后，VitePress 归一化为 `config.vitepress.rewrites = { map, inv }`：`map` 即上表去掉 `__create__`，`inv` 是键值互换的反查表。插件里 `userConfig.rewrites` 指用户原始对象（带标记，用于模式判定），`rewritesObj.map` 指归一化结果（用于生成数据）。

### 3. 第二步：模式判定与 sdoc 前缀剥离

（1）模式判定：`userConfig.rewrites.__create__ === "vitepress-plugin-permalink"` 成立且 map 非空 → `createRule = "rewrites"`；

（2）前缀剥离：把 map 每个键开头的 `sdoc/` 去掉（值不动），得到 `filteredRewrites`。对比效果：

```text
前: "sdoc/01.指南/01.简介/01.简介.md": "sdoc/guide/intro/126b07e425dd1660d3e4f5a.md"
后:    "01.指南/01.简介/01.简介.md": "sdoc/guide/intro/126b07e425dd1660d3e4f5a.md"
```

剥掉后 `01.指南`、`15.主题开发` 成为目录树的顶层键，各一级目录才能分别生成自己的侧边栏 key；**值保留 `sdoc/` 前缀**，供第七步提取 key 使用。

### 4. 第三步：buildDirectoryStructure 逐条建树

对 `filteredRewrites` 逐条处理：按 `/` 切分路径，前 N-1 段是目录、最后一段是文件；用 `currentLevel` 指针逐层下钻，目录不存在则创建空对象，最后把值挂到叶子键上。

#### 4.1 处理 "01.指南/01.简介/01.简介.md"

（1）`parts = ["01.指南", "01.简介", "01.简介.md"]`，`currentLevel = structure`（空对象）；

（2）处理 `"01.指南"`（目录段）：不存在 → 创建 `{}` 并下钻。此时 `structure = { "01.指南": {} }`；

（3）处理 `"01.简介"`（目录段）：不存在 → 创建并下钻。此时 `structure = { "01.指南": { "01.简介": {} } }`；

（4）处理 `"01.简介.md"`（最后一段，文件）：`currentLevel["01.简介.md"] = "sdoc/guide/intro/126b07e425dd1660d3e4f5a.md"`。最终：

```json
{ "01.指南": { "01.简介": { "01.简介.md": "sdoc/guide/intro/126b07e425dd1660d3e4f5a.md" } } }
```

#### 4.2 处理 "01.指南/01.简介/10.快速开始.md"

（1）`parts = ["01.指南", "01.简介", "10.快速开始.md"]`；

（2）处理 `"01.指南"`：已存在 → 直接复用，`currentLevel` 下钻，结构不变；

（3）处理 `"01.简介"`：已存在 → 直接复用，下钻，结构不变；

（4）处理 `"10.快速开始.md"`（文件）：挂值。`01.简介` 下多出一个叶子：

```json
{
  "01.指南": {
    "01.简介": {
      "01.简介.md": "sdoc/guide/intro/126b07e425dd1660d3e4f5a.md",
      "10.快速开始.md": "sdoc/guide/intro/126b07e425dd1670e4f5a6b.md"
    }
  }
}
```

#### 4.3 处理 "01.指南/10.使用/05.Markdown 拓展.md"

（1）`parts = ["01.指南", "10.使用", "05.Markdown 拓展.md"]`；

（2）处理 `"01.指南"`：已存在复用；

（3）处理 `"10.使用"`：不存在 → 在 `01.指南` 下新建 `{}` 并下钻；

（4）处理 `"05.Markdown 拓展.md"`（文件）：挂值：

```json
{
  "01.指南": {
    "01.简介": { "01.简介.md": "...", "10.快速开始.md": "..." },
    "10.使用": { "05.Markdown 拓展.md": "sdoc/guide/use/126b07e425dd1690a6b7c8d.md" }
  }
}
```

#### 4.4 处理 "01.指南/10.使用/10.摘要与封面.md"

与 4.2 同构：前两段目录均已存在直接复用，`10.使用` 下追加叶子 `10.摘要与封面.md`。

#### 4.5 处理 "01.指南/目录.md"

`parts = ["01.指南", "目录.md"]` 只有两段：`"01.指南"` 是目录段（已存在复用），`"目录.md"` 是最后一段直接挂到 `01.指南` 层。**目录树里"子目录"与"文件"靠值的类型区分**——子目录的值是对象，文件的值是字符串。

#### 4.6 处理 index.md 与 15.主题开发 各条

（1）`"01.指南/index.md"`、`"01.指南/01.简介/index.md"` 等各层目录页：与上述同构，在各自层级挂出字符串叶子；

（2）`"15.主题开发/index.md"`、`"15.主题开发/01.开发思路.md"`、`"15.主题开发/10.主题配置.md"`：在根层创建 `15.主题开发` 节点并挂三个叶子；

（3）`"index.md"`（sdoc 根目录页）：`parts = ["index.md"]` 单段，直接挂到树根，值为字符串。

#### 4.7 建树完成

`dirStructure` 的最终形态：

```json
{
  "index.md": "sdoc/126b07e425dd100a1b2c3d4.md",
  "01.指南": {
    "index.md": "sdoc/guide/126b07e425dd1639079fc233.md",
    "目录.md": "sdoc/guide/126b07e425dd1640b1c2d3e.md",
    "01.简介": {
      "index.md": "sdoc/guide/intro/126b07e425dd1650c2d3e4f.md",
      "01.简介.md": "sdoc/guide/intro/126b07e425dd1660d3e4f5a.md",
      "10.快速开始.md": "sdoc/guide/intro/126b07e425dd1670e4f5a6b.md"
    },
    "10.使用": {
      "index.md": "sdoc/guide/use/126b07e425dd1680f5a6b7c.md",
      "05.Markdown 拓展.md": "sdoc/guide/use/126b07e425dd1690a6b7c8d.md",
      "10.摘要与封面.md": "sdoc/guide/use/126b07e425dd16a0b7c8d9e.md"
    }
  },
  "15.主题开发": {
    "index.md": "sdoc/develop/126b07e425dd16b0c8d9e0f.md",
    "01.开发思路.md": "sdoc/develop/126b07e425dd16c0d9e0f1a.md",
    "10.主题配置.md": "sdoc/develop/126b07e425dd16d0e0f1a2b.md"
  }
}
```

注意：对象的键插入顺序等于 rewrites 的遍历顺序，原样传递给下一步的 `Object.entries`。

### 5. 第四步：处理一级目录 "01.指南"

外层 `Object.entries(dirStructure)` 依次拿到 `["index.md", "..."]`、`["01.指南", {...}]`、`["15.主题开发", {...}]`：

（1）`"index.md"`：值是字符串 → `typeof === "string"` 直接 return，根目录页不参与侧边栏；

（2）`"01.指南"`：值是对象 → 是目录，继续。`dirPath = "sdoc/01.指南/"`（prefix 是顶层 `path` 配置 `"sdoc"`），`dirRelativePath = join(baseDir, dirPath)` 拼出绝对路径，`existsSync` 验证磁盘上确实存在（重写表里的脏数据在这里被丢弃）；

（3）`key = Object.keys(rewrites).find(item => item.startsWith("01.指南"))` → 命中 `"01.指南/index.md"`，其值留到第七步提取侧边栏 key；

（4）调 `createSidebarItems(dirOrFileInfo, dirRelativePath, option, dirPath)` 递归生成子树（第五步）；

（5）返回非空后组装壳节点：`resolveFileName("01.指南")` 点分隔解析出 `{ index: "01", title: "指南" }`；`getInfoFromMarkdownDir(baseDir, "01.指南")` 读 `01.指南/index.md` 的 frontmatter（title 为"指南"），但 `titleFormMd: false` 使其不生效，text 仍取 `"指南"`（这里两处来源恰好一致）；

（6）得到 `sidebarItem = { text: "指南", collapsed: true, items: [...子树] }`——注意 `initItems: false` 时这个壳最终被丢弃，只有 items 进入最终数据（见第七步）。

### 6. 第五步：递归处理目录内容

`createSidebarItems` 拿到 `01.指南` 的四个条目：`index.md`、`目录.md`、`01.简介`、`10.使用`。

#### 6.1 处理 "01.简介"（目录条目）

（1）`isSome(ignoreListAll, "01.简介")`：mist 默认 `ignoreList: ["index.md", "README.md"]` 不含它，通过；

（2）`resolveFileName("01.简介")`：名字含 `.`，两段式 `["01", "简介"]` → `{ index: "01", title: "简介", type: "", name: "01" }`（目录的 title 取第二段），`parseInt("01") = 1` 是合法序号；

（3）`statSync` 是目录且树值是对象 → 走目录分支；

（4）`getInfoFromMarkdownDir` 读 `01.简介/index.md` 的 frontmatter，无 `sidebarSort / sidebarPrefix / sidebarSuffix`（title 同样因 `titleFormMd: false` 不采用）；

（5）text = `"简介"`——点分序号在这里被剥掉，这就是带序号命名的预期效果；

（6）递归其三个叶子（见 6.2）；

（7）组装 `{ text: "简介", collapsed: true, items: [子树] }`，`sort` 取 `info.sort`（undefined，排序时按 `defaultSortNum = 9999`），挂到 `sidebarItems[1]`（序号 1 的下标位）。

#### 6.2 处理 01.简介 下的叶子

（1）`"index.md"`：命中 mist 默认 ignoreList → 跳过，目录页不进侧边栏；

（2）`"01.简介.md"`：`resolveFileName` 三段式 `["01", "简介", "md"]` → `{ index: "01", title: "简介", type: "md", name: "01.简介" }`；`matter()` 解析 frontmatter 取到 `frontmatterTitle: "简介"`、`sidebar: true`、无 sidebarSort；text = frontmatter.title = `"简介"`；**link 直接取目录树叶子的值** `"/sdoc/guide/intro/126b07e425dd1660d3e4f5a.md"`——这是该文件的 permalink，也是与 filePath 模式的本质区别；`sort` 为 undefined（按 9999），挂到 `sidebarItems[1]`；

（3）`"10.快速开始.md"`：同构，`{ text: "快速开始", link: "/sdoc/guide/intro/126b07e425dd1670e4f5a6b.md" }` 挂到 `sidebarItems[10]`；

（4）本层收尾：`sidebarItems = [...sidebarItems.filter(Boolean), ...sidebarItemsNoIndex]` = `[简介@1, 快速开始@10]`（稀疏数组过滤后顺序即序号顺序，无序号队列为空）；`sort` 全部按 9999 稳定排序，顺序不变，删除临时 sort 属性后返回。

#### 6.3 处理 "10.使用" 与 "目录.md"

（1）`"10.使用"` 与 6.1 同构：text `"使用"`，挂到 `sidebarItems[10]`；内部产出 `[Markdown 拓展@5, 摘要与封面@10]`；

（2）`"目录.md"`：两段式解析 `{ index: "目录", title: "目录", type: "md", name: "目录" }`，`parseInt("目录") = NaN` → 无序号；无 frontmatter title → text 取文件名 `"目录"`；`{ text: "目录", link: "/sdoc/guide/126b07e425dd1640b1c2d3e.md" }` 进 `sidebarItemsNoIndex`；

（3）本层收尾：有序号在前 `[01.简介@1, 10.使用@10]`，无序号垫底 `[目录]`，合并后按 9999 稳定排序 → `[简介分组, 使用分组, 目录]`，即 `01.指南` 的最终子树。

### 7. 第六步：key 提取与最终侧边栏组装

（1）取第四步保存的 key `"01.指南/index.md"`，对应值 `"sdoc/guide/126b07e425dd1639079fc233.md"`；

（2）`value.split("/") = ["sdoc", "guide", "126b07e425dd1639079fc233.md"]`。第一段固定是 `sdoc`（前缀剥离只动了键没动值），**取第二段 `"guide"`** 作为侧边栏 key 的别名段；

（3）`sidebarObj["/sdoc/guide/"] = initItems ? [壳节点] : sidebarItems`：mist 默认 `initItems: false`，直接挂子树，第四步组装的 `{ text: "指南" }` 壳被丢弃；

（4）`"15.主题开发"` 同流程：`find` 命中 `"15.主题开发/index.md"`，值第二段 `"develop"` → `/sdoc/develop/`；其子树只有文件（`01.开发思路.md` 序号 1、`10.主题配置.md` 序号 10，index.md 被忽略）→ 直接是两个链接项。最终注入 `themeConfig.sidebar` 的数据：

```json
{
  "/sdoc/guide/": [
    {
      "text": "简介",
      "collapsed": true,
      "items": [
        { "text": "简介", "collapsed": true, "link": "/sdoc/guide/intro/126b07e425dd1660d3e4f5a.md" },
        { "text": "快速开始", "collapsed": true, "link": "/sdoc/guide/intro/126b07e425dd1670e4f5a6b.md" }
      ]
    },
    {
      "text": "使用",
      "collapsed": true,
      "items": [
        { "text": "Markdown 拓展", "collapsed": true, "link": "/sdoc/guide/use/126b07e425dd1690a6b7c8d.md" },
        { "text": "摘要与封面", "collapsed": true, "link": "/sdoc/guide/use/126b07e425dd16a0b7c8d9e.md" }
      ]
    },
    { "text": "目录", "collapsed": true, "link": "/sdoc/guide/126b07e425dd1640b1c2d3e.md" }
  ],
  "/sdoc/develop/": [
    { "text": "开发思路", "collapsed": true, "link": "/sdoc/develop/126b07e425dd16c0d9e0f1a.md" },
    { "text": "主题配置", "collapsed": true, "link": "/sdoc/develop/126b07e425dd16d0e0f1a2b.md" }
  ]
}
```

### 8. 第七步：导航栏生成过程

导航栏走 `createRewritesNavigation(filteredRewrites, ...)`，同一份 filteredRewrites 先经同一个 `buildDirectoryStructure` 建树（树完全相同，省略），然后 `createNavigationItems` 从顶层递归，`maxLevel: 2`：

（1）第一层遍历到 `["index.md", "..."]`：值是字符串 → 只处理目录，直接跳过；

（2）第一层遍历到 `["01.指南", {...}]`：`displayName = "01.指南".replace(/^\d+[.\-_]/, "")` = `"指南"`（点、连字符、下划线分隔的序号都认）；`fileInfo["index.md"]` 存在 → 备用 link 为 `"/sdoc/guide/126b07e425dd1639079fc233.md"`；`currentLevel 1 < maxLevel 2` → 继续下钻；

（3）第二层遍历 `01.指南` 的子目录：`"01.简介"` → displayName `"简介"`，link 取自其 index.md（`"/sdoc/guide/intro/126b07e425dd1650c2d3e4f.md"`）；`currentLevel 2 >= maxLevel 2` 到达层级上限，**有 link 才生成为链接项**；`"10.使用"` 同理；层内的 `"目录.md"`、`"index.md"` 是字符串值 → 跳过，md 文件永远不进导航栏；

（4）第二层返回 `[简介链接项, 使用链接项]` 非空 → 第一层的 `"指南"` 放弃自己的 link，改为**下拉组** `{ text: "指南", items: [...] }`（VitePress 不允许 NavItem 同时有 link 和 items，有子项时 items 优先）；

（5）`"15.主题开发"`：第二层只有字符串叶子（两篇文章 + index.md）→ 返回空；子项为空但自己有 link → 以链接项输出。最终导航栏：

```json
[
  {
    "text": "指南",
    "items": [
      { "text": "简介", "link": "/sdoc/guide/intro/126b07e425dd1650c2d3e4f.md" },
      { "text": "使用", "link": "/sdoc/guide/use/126b07e425dd1680f5a6b7c.md" }
    ]
  },
  { "text": "主题开发", "link": "/sdoc/develop/126b07e425dd16b0c8d9e0f.md" }
]
```

注意导航栏与侧边栏的链接分工：导航栏链接的是各目录 index.md 的 permalink（目录页），侧边栏链接的是文章本身的 permalink。

### 9. 与 filePath 模式的行为差异对照

| 环节                | filePath 模式                 | rewrites 模式                                      |
| ------------------- | ----------------------------- | -------------------------------------------------- |
| 目录树来源          | `readdirSync` 实时扫描        | 重写表按 `/` 切分建树（`buildDirectoryStructure`） |
| 条目可信度          | 磁盘上一定存在                | 重写表可能有脏数据，需 `existsSync` 过滤           |
| 文章 link           | `prefix + 文件名`（中文路径） | 重写表的值（permalink）                            |
| 目录 link（导航栏） | 目录路径 + 尾斜杠             | 仅当目录有 index.md 时取其 permalink               |
| 侧边栏 key          | `/sdoc/<中文一级目录名>/`     | `/sdoc/<重写值第二段英文别名>/`                    |
| 前置条件            | 无                            | `createRewrites()` 生成的重写表非空                |

两条模式的共同底座（序号排序、标题来源、frontmatter 定制、回调钩子）完全一致，差异收敛在"树从哪来、链接取什么"这两点上。
