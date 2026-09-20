---
title: LV106-自动侧边栏之filePath模式
date: 2026-09-20 19:48:47
icon: famicons:logo-markdown
permalink: /sdoc/plugin/standalone-plugin/126d5cf3771f30f180842827
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
  detailDate: 2026-09-20 19:48:47.783
  fulluuid: 180842827e2342798caefa1dcf46adc4
  useduuid: 180842827
---

<!-- more -->

filePath 模式是自动侧边栏的默认解析规则：不依赖任何路由配置，直接扫描文件系统，**目录怎么长，侧边栏就怎么生成**。当前文档站（未启用 `createRewrites()`）走的就是这条路径。本文自顶向下拆解它的完整生成过程：入口流程、递归算法、文件名解析、标题来源，最后用本站真实目录做一遍全过程模拟。

源码位于 [`plugins/vitepress-auto-nav-sidebar/src/filePathToSidebar.ts`](https://github.com/docs-site/vitepress-theme-mist/blob/main/plugins/vitepress-auto-nav-sidebar/src/filePathToSidebar.ts)（侧边栏）与 [`plugins/vitepress-auto-nav-sidebar/src/filePathToNavigation.ts`](https://github.com/docs-site/vitepress-theme-mist/blob/main/plugins/vitepress-auto-nav-sidebar/src/filePathToNavigation.ts)（导航栏）。

## 一、模式原理

VitePress 默认把文件路径当作页面路径：`sdoc/01-开发/LV001-pnpm工作区.md` 的访问地址就是 `/sdoc/01-开发/LV001-pnpm工作区`。filePath 模式利用这一点，**用文件路径直接拼侧边栏链接**——扫描到什么路径，就生成什么链接，链接天然与路由一致，不需要任何额外配置。

代价是 URL 观感：中文目录名、文件名里的 LV 编号全部进入链接。想获得英文短链接，需要转用 [rewrites 模式](./LV109-自动侧边栏之rewrites模式.md)。

## 二、侧边栏生成流程

### 1. 入口 createFilePathSidebar

入口默认导出函数（[filePathToSidebar.ts](https://github.com/docs-site/vitepress-theme-mist/blob/main/plugins/vitepress-auto-nav-sidebar/src/filePathToSidebar.ts#L63-L170)）接收三个参数：`option`（SidebarOption）、`prefix`（顶层 `path`，即 `"sdoc"`）、`srcDir`。流程分三步：

（1）`scannerRootMd` 分支：扫描 sdoc 根目录下的散装 md 文件（排除根 index.md），生成到 `sidebar["/sdoc/"]` 这个 key 下。本站 sdoc 根目录只有 index.md，所以这个 key 不会出现；

（2）`readDirPaths`：列出 sdoc 下的**一级子目录**绝对路径（过滤默认黑名单 + ignoreList），每个目录对应侧边栏的一个 key；

（3）对每个一级目录调用 `createSidebarItems` 递归生成文件树，写入 `sidebar[`/sdoc/${目录名}/`]`。

```typescript
// plugins/vitepress-auto-nav-sidebar/src/filePathToSidebar.ts
const dirPaths = readDirPaths(path, ignoreList);
dirPaths.forEach(dirPath => {
  const fileName = basename(dirPath); // 如 "03-插件"
  const sidebarItems = createSidebarItems(dirPath, option, `${key}${fileName}/`);
  // initItems: false 时直接挂文件树（mist 默认）
  sidebarObj[`${key}${fileName}/`] = initItems ? [{ ...sidebarItem }] : sidebarItems;
});
```

### 2. 递归核心 createSidebarItems

这是两种模式共用的树构造算法（[filePathToSidebar.ts](https://github.com/docs-site/vitepress-theme-mist/blob/main/plugins/vitepress-auto-nav-sidebar/src/filePathToSidebar.ts#L207-L358)），对目录下每个条目：

（1）命中忽略名单（默认黑名单 + `ignoreList`）则跳过；

（2）**同名 md 抑制**：若目录 `01-开发` 旁边存在同名 `01-开发.md`，该目录不再生成侧边栏节点——文档本身已经覆盖了目录入口。本站没有这种布局，该规则不触发；

（3）`resolveFileName` 解析出序号 `index`、标题 `title`、类型 `type`、去扩展名 `name`；

（4）目录条目：先递归生成子树，组装 `{ text, collapsed, items }`，再挂上排序值；

（5）md 文件条目：`readFileSync` + gray-matter 解析 frontmatter，`sidebar: false` 跳过，否则组装 `{ text, collapsed, link: prefix + name }`。

### 3. 序号稀疏数组与排序

条目不是直接 push 进结果，而是**按下标放进稀疏数组**：

```typescript
// plugins/vitepress-auto-nav-sidebar/src/filePathToSidebar.ts
if (isIllegalIndex(index)) sidebarItemsNoIndex.push(sidebarItem);
else sidebarItems[index] = sidebarItem;
// 收尾：有序号的在前，无序号的垫底
sidebarItems = [...sidebarItems, ...sidebarItemsNoIndex].filter(Boolean);
```

三段式设计：能解析出序号的按下标占位（同序号后者覆盖前者）；解析不出序号的进 `sidebarItemsNoIndex`；最终 `sort` 开启时再按 `sort` 字段（`sidebarSort`，缺省 `defaultSortNum = 9999`）稳定排序，排完删除临时 `sort` 属性。所以最终顺序由 `sidebarSort` 决定，文件序号只有在 `sortNumFromFileName: true` 时才参与。

### 4. 回调钩子的切入时机

- `beforeCreateSidebarItems(dirOrFilenames)`：拿到原始文件名数组，可先过滤；
- `sidebarItemsResolved(items)`：本层 items 排序完毕后，可改写后返回。

## 三、文件名解析 resolveFileName

解析逻辑在 [`nodeHelper.ts`](https://github.com/docs-site/vitepress-theme-mist/blob/main/plugins/vitepress-auto-nav-sidebar/src/nodeHelper.ts#L11-L43)，决定"序号、标题、类型"三个值的来源：

（1）**点分隔（默认）**：`01.简介.md` 解析为 `{ index: "01", title: "简介", type: "md", name: "01.简介" }`；两段式 `简介.md` 解析为 `{ index: "简介", title: "简介", ... }`——index 不是合法数字，进无序号队列；特例 `index.md` 的 index 固定为 `"0"`，永远排在最前；

（2）**自定义分隔符**：`indexSeparator: "_"` 时，`01_简介.md` 也能解析出序号（仍要求以数字开头，且点分隔规则依旧并存）；

（3）**无分隔符**：`简介.md` 之外的如 `assets` 目录，返回空 index。

【**注意**】

序号识别只认 `数字 + .`（或自定义分隔符）格式。mist 文档库的 `LV001-标题.md`、`01-开发/` 这类**连字符**命名不在识别范围内——`LV001-pnpm工作区.md` 的 index 是 `"LV001-pnpm工作区"`（非法数字），标题也是完整的 `LV001-pnpm工作区`。后果与对策见 [LV112-自动侧边栏的限制与避坑](./LV112-自动侧边栏的限制与避坑.md)。

## 四、标题来源

### 1. 文件条目

优先级链为 `frontmatter.title > md 一级标题 > 文件名`，其中 md 一级标题只有 `titleFormMd: true` 才参与：

```typescript
// plugins/vitepress-auto-nav-sidebar/src/filePathToSidebar.ts
const mdTitle = titleFormMd ? getTitleFromMarkdown(mdContent) : "";
const text = finalSidebarPrefix + (frontmatterTitle || mdTitle || title) + finalSidebarSuffix;
```

前后缀取 frontmatter 的 `sidebarPrefix` / `sidebarSuffix`，可被 `prefixTransform` / `suffixTransform` 二次加工。

### 2. 目录条目

`getInfoFromMarkdownDir`（[nodeHelper.ts](https://github.com/docs-site/vitepress-theme-mist/blob/main/plugins/vitepress-auto-nav-sidebar/src/nodeHelper.ts#L111-L139)）按顺序读该目录下的 `index.md`、`index.MD`、`目录名.md`，从它们 frontmatter 里补齐 `title / sidebarSort / sidebarPrefix / sidebarSuffix`。但注意：读到的 `title` 同样只在 `titleFormMd: true` 时生效，默认配置下目录标题就是**去掉序号后的目录名**（前提是序号能被点分隔规则解析；`01-开发` 解析不出，原样保留）。

## 五、导航栏生成

导航栏入口 `createNavigationData`（[filePathToNavigation.ts](https://github.com/docs-site/vitepress-theme-mist/blob/main/plugins/vitepress-auto-nav-sidebar/src/filePathToNavigation.ts#L41-L136)）走另一套更简单的目录树扫描：

（1）递归 `scanDirectory`，目录名经 `/^\d+-/` 正则去掉 `01-` 式前缀后作为显示文本（注意这里支持连字符，与侧边栏的点分隔规则不同）；

（2）某目录下还有子目录时，该目录生成为**下拉组**（`items`）；没有子目录时生成**链接项**，link 为目录路径加尾斜杠；

（3）`maxLevel` 截断递归深度（mist 默认 2：一级链接 + 二级下拉）；

（4）特例：第一层目录下只有 md 没有子目录时，直接生成一条 `/{path}/` 链接项。

侧边栏先处理目录后处理文件，而导航栏**只看目录不看文件**——单篇文档永远不出现在导航栏。

## 六、完整生成过程模拟

以本站 `sdoc/03-插件/` 真实结构为例，跟踪一次侧边栏数据演变（配置取 mist 默认值）。

### 1. 输入：目录与文件

```text
sdoc/03-插件/
├── index.md
├── 01-独立插件包/
│   ├── index.md
│   ├── LV010-file-content-loader.md
│   ├── LV040-catalogue分析文档.md
│   ├── LV070-永久链接.md
│   ├── LV100-自动侧边栏总览.md
│   └── ...
└── 02-内置插件/
    ├── index.md
    └── LV001-img懒加载.md
```

### 2. 第一步：一级目录定位 key

`readDirPaths("…/src/sdoc")` 返回四个一级目录，`03-插件` 对应 `basename = "03-插件"`，侧边栏 key 定为 `/sdoc/03-插件/`。

### 3. 第二步：递归扫描 03-插件

对 `03-插件` 目录调 `createSidebarItems`，读到 `index.md`、`01-独立插件包/`、`02-内置插件/` 三个条目：

（1）`index.md`：mist 默认 `ignoreList: ["index.md", "README.md"]`，命中忽略名单，跳过；

（2）`01-独立插件包`：是目录且无同名 md，递归其内部。`LV010-file-content-loader.md` 解析出 `index = "LV010-file-content-loader"`（非法数字）→ 进无序号队列；title 为文件名全称。同目录其余文件同样处理；内部 `index.md` 命中忽略名单跳过；

（3）`02-内置插件`：同理，收集 `LV001-img懒加载`。

### 4. 第三步：组装目录节点

递归返回后组装成（`sort` 开启，全部条目 sort 值都是缺省 9999，按 readdirSync 的字母序稳定排序——`LV010 < LV040 < LV070 < LV100` 字典序恰好等于数值序）：

```json
[
  {
    "text": "01-独立插件包",
    "collapsed": true,
    "items": [
      {
        "text": "LV010-file-content-loader",
        "collapsed": true,
        "link": "/sdoc/03-插件/01-独立插件包/LV010-file-content-loader"
      },
      {
        "text": "LV040-catalogue分析文档",
        "collapsed": true,
        "link": "/sdoc/03-插件/01-独立插件包/LV040-catalogue分析文档"
      },
      { "text": "LV070-永久链接", "collapsed": true, "link": "/sdoc/03-插件/01-独立插件包/LV070-永久链接" },
      { "text": "LV100-自动侧边栏总览", "collapsed": true, "link": "/sdoc/03-插件/01-独立插件包/LV100-自动侧边栏总览" }
    ]
  },
  {
    "text": "02-内置插件",
    "collapsed": true,
    "items": [{ "text": "LV001-img懒加载", "collapsed": true, "link": "/sdoc/03-插件/02-内置插件/LV001-img懒加载" }]
  }
]
```

### 5. 第四步：写入最终结构

`initItems: false`，文件树直接挂到 key 下：

```json
{
  "/sdoc/03-插件/": [
    /* 上面的数组 */
  ],
  "/sdoc/01-开发/": [
    /* 同流程生成 */
  ],
  "/sdoc/02-组件/": [
    /* 同流程生成 */
  ],
  "/sdoc/04-使用/": [
    /* 同流程生成 */
  ]
}
```

这份 `SidebarMulti` 对象经 `setSideBar` 写入 `themeConfig.sidebar`，交给 VitePress 按路由前缀（`/sdoc/03-插件/`）匹配展示。至此 filePath 模式的一次完整生成结束。
