<h1 align="center">vitepress-theme-mist</h1>

<div align="center">

[Github](https://github.com/docs-site/vitepress-theme-mist) ｜ [Preview](https://docs-site.github.io/site-vitepress/)

✨ 在自己什么都不会的情况下开始搞的一个 VitePress 主题。

</div>

<p align="center">
  <a title="Github release" target="_blank" href="https://github.com/docs-site/vitepress-theme-mist/releases">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/docs-site/vitepress-theme-mist?logo=github">
  </a>
  <a title="Npm Version" target="_blank" href="https://www.npmjs.com/package/vitepress-theme-mist">
    <img src="https://img.shields.io/npm/v/vitepress-theme-mist?logo=npm&color=%09%23bf00ff" alt="https://img.shields.io/npm/v/vitepress-theme-mist?color=%09%23bf00ff">
  </a>
  <a title="vitepress" target="_blank" href="https://github.com/vuejs/vitepress/releases/tag/v1.6.4">
    <img src="https://badgen.net/static/vitepress/1.6.4/cyan" alt="vitepress">
  </a>
  <img src="https://img.shields.io/badge/v22.16.x-x?logo=node.js&label=node" alt="node version">
  <img src="https://img.shields.io/badge/v10.14.0-x?logo=node.js&label=PNPM" alt="pnpm version">
  <a title="MIT License" target="_blank" href="https://github.com/docs-site/vitepress-theme-mist/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License">
  </a>
</p>

## 参考说明

自己用c的，这些vue啊、vite啊还有什么vitepress，一开始看到的时候，这都是啥？不是很懂的样子，但还是想折腾一下，主题主要是自己使用，编写的框架主要参考 [vitepress-theme-teek](https://github.com/Kele-Bingtang/vitepress-theme-teek)和 [element-plus](https://github.com/element-plus/element-plus)。

- [vitepress-theme-teek](https://github.com/Kele-Bingtang/vitepress-theme-teek)、[vitepress-theme-teek-docs](https://vp.teek.top/)

<p align="center">
  <a title="Github release" target="_blank" href="https://github.com/Kele-Bingtang/vitepress-theme-teek/releases">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/Kele-Bingtang/vitepress-theme-teek?logo=github">
  </a>
  <a title="Npm Version" target="_blank" href="https://www.npmjs.com/package/vitepress-theme-teek">
    <img src="https://img.shields.io/npm/v/vitepress-theme-teek?logo=npm&color=%09%23bf00ff" alt="https://img.shields.io/npm/v/vitepress-theme-teek?color=%09%23bf00ff">
  </a>
</P>


- [element-plus](https://github.com/element-plus/element-plus)、[element-plus-docs](https://element-plus.org/zh-CN/)

<p align="center">
  <a title="Github release" target="_blank" href="https://github.com/element-plus/element-plus/releases">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/element-plus/element-plus?logo=github">
  </a>
  <a title="Npm Version" target="_blank" href="https://www.npmjs.com/package/element-plus">
    <img src="https://img.shields.io/npm/v/element-plus?logo=npm&color=%09%23bf00ff" alt="https://img.shields.io/npm/v/element-plus?color=%09%23bf00ff">
  </a>
</P>


## 小徽章

>- [badgen.net](https://badgen.net/)
>- [Shields.io | Shields.io](https://shields.io/)
>- [For the Badge](https://forthebadge.com/)

## git提交记录规范

> git 提交信息 emoji： [https://gitmoji.dev/](https://gitmoji.dev/)

遵循以下格式：

```bash
<type>(<scope>): <subject>

# type，表示类型，可选fix、feat等
# scope，影响的范围，看大多数用的都是()
# subject，提交信息
```

- fix：bug修复

```bash
git commmit -m "fix:[devenv] commit-message" # 开发环境 bug 修复
git commmit -m "fix:[theme] commit-message"  # vitepress-theme-mist bug 修复
git commmit -m "fix:[site] commit-message"   # docs目录下site站点 bug 修复
```

- feat：新增功能

```bash
git commmit -m "feat:[devenv] commit-message" # 开发环境新增功能
git commmit -m "feat:[theme] commit-message"  # vitepress-theme-mist 新增功能
git commmit -m "feat:[site] commit-message"   # docs目录下site站点新增功能
```

- perf：优化相关，比如提升性能、体验等

```bash
git commmit -m "perf:[devenv] commit-message" # 开发环境优化
git commmit -m "perf:[theme] commit-message"  # vitepress-theme-mist 优化
git commmit -m "perf:[site] commit-message"   # docs目录下site站点优化
```

- refactor：重构（即不是新增功能，也不是修改bug的代码变动）。

```bash
git commmit -m "refactor:[devenv] commit-message" # 开发环境相关修改
git commmit -m "refactor:[theme] commit-message"  # vitepress-theme-mist 相关修改
git commmit -m "refactor: [site] commit-message"  # docs目录下site站点相关修改
```
- chore：构建过程或辅助工具的变动。

```bash
git commmit -m "chore[release]: commit-message" # 更新版本号
git commmit -m "chore[build]: commit-message"   # 构建流程相关修改(build)
```

- docs：开发文档更新或者新增

```bash
git commmit -m "docs: commit-message" # 开发文档更新
```

## License

[MIT](https://mit-license.org/) License © 2025 [docs-site](https://github.com/docs-site/)
