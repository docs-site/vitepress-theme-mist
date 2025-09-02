# @docs-site/vitepress-plugin-permalink

这是一个适用于 `vitepress` 的 Vite 插件，在 `vitepress` 启动后读取 Markdown 文档 `frontmatter` 的 `permalink`。这个permalink可以自己定义，我是自己写了一个cli工具：[GitHub - docs-site/tdoc-cli: sumu's document processing cli tool.](https://github.com/docs-site/tdoc-cli).

## 一、功能说明

### 1. 插件功能

-  支持给 Markdown 文档设置唯一的访问 **永久链接**，不再因为 Markdown 文档路径移动而导致访问地址发生变化
- 读取 Markdown 文档 `frontmatter` 的 `permalink`，挂载到 `themeConfig.permalinks`
- 支持 locales 国际化，自动给 **永久链接** 添加语言前缀，不同语言的永久链接不会重复
- 支持 rewrite 路由重写，最终得到的文档路径是 rewrite 路由重写后的路径
- **永久链接** 支持导航栏激活高亮

### 2. tdoc-cli工具

markdown相关的命令都是`m:cmd`这样的格式，命令说明可以看这里：[tdoc-cli/src/markdown/README.md at master · docs-site/tdoc-cli · GitHub](https://github.com/docs-site/tdoc-cli/blob/master/src/markdown/README.md)

## 二、Install

安装 `@docs-site/vitepress-plugin-permalink` 插件

```bash
# 推荐使用 pnpm
pnpm add @docs-site/vitepress-plugin-permalink
# or yarn
yarn add @docs-site/vitepress-plugin-permalink
# or npm
npm install @docs-site/vitepress-plugin-permalink
```

## 三、实现方式

插件提供两种方式实现永久链接：

（1）`Proxy` 方式

（2）`Rewrites` 方式

> Tips：两者只能二选一，如果都配置，则以 `Rewrites` 方式为主。

### 1. Proxy

`Proxy` 方式**不会影响文件路径**，而是在访问文件路径时，通过代理（拦截）将其转换 `Permalink`，因此既可以通过文件路径访问，也可以通过 `Permalink` 访问。

添加 `@docs-site/vitepress-plugin-permalink` 插件到 `.vitepress/config.ts`

```typescript
import { defineConfig } from "vitepress";
import Permalink from "@docs-site/vitepress-plugin-permalink";

export default defineConfig({
  vite: {
    plugins: [Permalink(/* options */)],
  },
});
```

> 说明：该插件仅限项目启动时生效，已改动或新添加的 Markdown 需要重启项目才能生效。

插件默认忽略 `["node_modules", "dist", ".vitepress", "public"]` 目录下的文件，且只扫描 Markdown 文档。

### 2. Rewrites

插件于提供 `createRewrites` 方法，用于创建 [rewrites](https://vitepress.dev/zh/guide/routing#route-rewrites)，通过该方式可以实现永久链接功能。

> Tips：如果使用该方式，则 `Proxy` 相关功能都失效，如 `usePermalink` 函数。

`Rewrites` 方式在项目运行或者构建时，通过改变文件路径达到永久链接功能，我们可以在构建的 `dist` 文件夹查看修改后的文件路径。

```typescript
import { defineConfig } from "vitepress";
import { createRewrites } from "@docs-site/vitepress-plugin-permalink";

export default defineConfig({
  rewrites: createRewrites(),
});
```

函数原型如下：

```typescript
export const createRewrites = (
  options: PermalinkOption & { srcDir?: string; locales?: Record<string, any> } = {}
)
{
  //...
}
```

`createRewrites` 函数支持除了传入 `@docs-site/vitepress-plugin-permalink` 的[配置项](https://github.com/docs-site/vitepress-theme-mist/blob/master/plugins/vitepress-plugin-permalink/src/types.ts)，也支持额外传入两个配置项：

- `srcDir`：VitePress 的 [srcDir](https://vitepress.dev/zh/reference/site-config#srcdir)，默认为 `.`，即当前项目的绝对目录。

有这样一个目录结构：

```bash
docs
├── package.json
└── src
    ├── .vitepress
    ├── #...
    ├── sdoc
    └── test
```

这个时候，当不传入srcDir的时候，就会从`docs`目录下开始扫描，由于只扫描md文档，再加上一些忽略的目录，最终主要是扫描到sdoc目录，会生成这样的数据：

```typescript
{
  'src/sdoc/01-开发/index.md': 'sdoc/develop/docs/126b07d4240537b222a10546.md',
  'src/sdoc/01-开发/LV01-pnpm工作区.md': 'sdoc/develop/docs/126b07d424270420b8f380cb.md',
}
```

但是这样的数据是无效的，我们访问对应的文档时，还是会显示为目录路径，例如 `src/sdoc/01-开发/index.md`这个文档，访问时就是`http://localhost:5173/vitepress-theme-mist/sdoc/01-开发/LV01-pnpm工作区.html`，但是正常来说应该是`http://localhost:5173/vitepress-theme-mist/sdoc/develop/docs/126b07d424270420b8f380cb.html`这种才对，应该使用映射后的永久链接，具体原因自己也理的不是很清楚，应该是因为这里是以package.json所在目录为基准，`.`就表示docs目录下，而我们的vitepress是位于`docs/src`目录下，所以这里应该配置：

```typescript
rewrites: createRewrites({srcDir: 'src'}),
```

这个时候会得到如下所示的数据：

```typescript
{
  'sdoc/01-开发/index.md': 'sdoc/develop/docs/126b07d4240537b222a10546.md',
  'sdoc/01-开发/LV01-pnpm工作区.md': 'sdoc/develop/docs/126b07d424270420b8f380cb.md',
}
```

这个时候访问时就会变成永久链接啦。

- `locales`：VitePress 的 [locales](https://vitepress.dev/zh/guide/i18n#internationalization)

如果没有传入配置项，则默认为从文档的根目录进行扫描。

> 注意：该方式会打乱原来的文件结构，因此侧边栏不再是基于文件路径配置，而是需要基于 `frontmatter.permalink` 属性配置。

Rewrites 方式推荐和[vitepress-auto-nav-sidebar](https://github.com/docs-site/vitepress-theme-mist/tree/master/plugins/vitepress-auto-nav-sidebar)插件一起使用，`vitepress-plugin-sidebar-resolve` 支持基于 rewrites 生成侧边栏，无需手动配置侧边栏。

## 四、Usage

### 1. 基础使用

在 Markdown 文件的 `frontmatter` 中添加如下内容：

```yaml
---
permalink: /guide/quickstart
---
```

- 当为 `Proxy` 方式时，该文件除了通过 `文件路径` 访问，也可以通过 `permalink` 访问。
- 当为 `Rewrites` 方式时，该文件需要通过 `permalink` 访问，而 `文件路径` 访问将会失效。

### 2. usePermalink 函数

插件已经在 VitePress 的 `layout-bottom` 插槽引入 `usePermalink` 函数来初始化 permalinks 功能，如果因为 VitePress 升版等原因导致没有初始化 permalinks，则可以手动引入该函数进行初始化操作。

> 怎么验证 `usePermalink` 函数初始化是否生效？
>
> 随机访问一个文件路径，如果地址栏变为 permalink，则代表生效，如果地址栏为文件路径，则代表没有生效。

在 `.vitepress/theme/index.ts` 引入 `usePermalink` 函数来初始化 permalinks 功能：

```typescript
import { h, defineComponent } from "vue";
import DefaultTheme from "vitepress/theme";
import usePermalink from "@docs-site/vitepress-plugin-permalink/src/usePermalink";

export default {
  extends: DefaultTheme,
  Layout: defineComponent({
    name: "LayoutProvider",
    setup() {
      // 开启监听 permalink
      usePermalink().startWatch();

      return h(DefaultTheme.Layout, null, {});
    },
  }),
};
```

假设项目的目录结构如下：

```bash
.
├─ docs                # 项目根目录
│  ├─ guide
│  │  └─ api.md
```

`api.md` 内容如下：

```yaml
---
permalink: /guide-api
---
```

- 访问 `/guide/api.html` 可以进入文档页面，这是 vitepress 的自带功能。**如果文件路径发生改变，访问链接也随着改变**。
- 访问 `/guide-api` 可以进入文档页面，这是插件的实现功能。**不会随着文件路径变化而改变**。

永久链接是唯一的，如果出现两个一样的永久链接，则后面的永久链接覆盖前面的，但不影响 vitepress 自带访问路径。

如果永久链接不生效，代表 `usePermalink().startWatch()` 并没有被执行，请在注册 vitepress 或者任意主题前加载该函数，如何注册请看 ([扩展默认主题 | VitePress](https://vitepress.dev/zh/guide/extending-default-theme#layout-slots))

### 3. router.state.permalinkPlugin

如果使用了 `usePermalink` 函数，则会在 `router.state` 中添加 `permalinkPlugin: true`，因此我们可以根据这个来判断是否判断插件生效。

```typescript
import { useRouter } from "vitepress";

const router = useRouter();

console.log(router.state.permalinkPlugin);
```

### 4. router.onAfterUrlLoad

插件提供了 `router.onAfterUrlLoad` 钩子，当浏览器链接发生变化后，触发该钩子，我们可以在参数里接收当前地址栏最新的链接。

`router.onAfterUrlLoad` 钩子在 VitePress 所有的 `router.onAfterXxx` 之后执行，目的是获取本插件提供的永久链接。

```typescript
import { useRouter } from "vitepress";

const router = useRouter();

router.onAfterUrlLoad = (href: string) => {
  console.log(href);
};
```

**使用场景**

在使用访问量插件如不蒜子时，我们需要提供当前的链接来统计其访问量，那么我们可以在该钩子拿到地址栏最终的链接，然后提供给访问量插件。

## 五、Options

| name       | description                           | type       | default                        |
| ---------- | ------------------------------------- | ---------- | ------------------------------ |
| ignoreList | 忽略的文件/文件夹列表，支持正则表达式 | `string[]` | `[]`                           |
| path       | 指定扫描的根目录                      | `string`   | `vitepress` 的 `srcDir` 配置项 |

## 六、Warning

插件的 `usePermalink` 函数使用了 `router.onBeforeRouteChange` 和 `router.onAfterRouteChange` 回调方法。

如果我们也需要使用这些回调函数，请不要直接这样使用：

```typescript
router.onAfterRouteChange = (href: string) => {
  // 我们的逻辑
};
```

`onAfterRouteChange` 是一个函数，我们这样使用将会 **覆盖** 其他代码在该回调函数的逻辑，因此需要这样使用：

```typescript
// 获取可能已有的 onAfterRouteChange
const selfOnAfterRouteChange = router.onAfterRouteChange;

router.onAfterRouteChange = async (href: string) => {
  // 调用可能已有的 onAfterRouteChange
  await selfOnAfterRouteChange?.(href);

  // 调用自己的函数
  myFunction();
};

const myFunction = () => {
  /* */
};
```

`onBeforeRouteChange` 支持返回 false 来阻止路由跳转，因此请这样使用：

```typescript
// 获取可能已有的 onBeforeRouteChange
const selfOnBeforeRouteChange = router.onBeforeRouteChange;

router.onBeforeRouteChange = async (href: string) => {
  // 调用已有的 onBeforeRouteChange
  const selfResult = await selfOnBeforeRouteChange?.(href);
  if (selfResult === false) return false;

  // 调用自己的函数
  myFunction();
};

const myFunction = () => {
  /* */
};
```

## 七、TypeScript

```typescript
export interface PermalinkOption {
  /**
   * 忽略的文件/文件夹列表，支持正则表达式
   *
   * @default []
   */
  ignoreList?: Array<RegExp | string>;
  /**
   * 文章所在的目录，基于 .vitepress 目录层级添加，开头不需要有 /
   * @default 'vitepress 的 srcDir 配置项'
   */
  path?: string;
}

export interface Permalink {
  /**
   * key 为文件相对路径，value 为永久链接
   */
  map: Record<string, string>;
  /**
   * key 为永久链接，value 为文件相对路径
   */
  inv: Record<string, string>;
}
```

## License

[MIT](https://mit-license.org/) License © 2025 [docs-site](https://github.com/docs-site/)
