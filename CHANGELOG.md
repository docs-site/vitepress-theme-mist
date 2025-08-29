# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.0.9](https://github.com/docs-site/vitepress-theme-mist/compare/v1.0.8...v1.0.9) (2025-08-29)


### Features

* **plugins:** 🚀 添加@docs-site/vitepress-auto-nav-sidebar插件 ([3fc1262](https://github.com/docs-site/vitepress-theme-mist/commit/3fc1262ca787d0ffeafd5394efdb1a17257dc155))
* **plugins:** 🚀 添加@docs-site/vitepress-plugin-sidebar-resolve自动侧边栏插件 ([86c3377](https://github.com/docs-site/vitepress-theme-mist/commit/86c3377ae987417950ac98092d0b56dfec5b402a))
* **plugins:** 🚀 添加一个vite插件示例 ([2faddd6](https://github.com/docs-site/vitepress-theme-mist/commit/2faddd6a03b5788b1507f491ed2413b938ff4654))


### Bug Fixes

* **theme:** 🐞 修复项目启动后终端打印 Scss 的废弃警告 ([4080cfb](https://github.com/docs-site/vitepress-theme-mist/commit/4080cfbfa08e2be00dc3deca2de9166bb0818d08))


### Code Refactoring

* **plugins:** ♻️ 挂载nav数据到themeConfig ([7a98e64](https://github.com/docs-site/vitepress-theme-mist/commit/7a98e643ef854e97bf184b05d8996fedf33ac080))
* **plugins:** ♻️ 挂载sidebar数据到themeConfig ([e40c757](https://github.com/docs-site/vitepress-theme-mist/commit/e40c7571a1fc7ba5aad17ddb20c20b644e5a7760))
* **plugins:** ♻️ 优化@docs-site/vitepress-auto-nav-sidebar功能 ([cfbfb0b](https://github.com/docs-site/vitepress-theme-mist/commit/cfbfb0b07158520e3eec9f82bc6546b486f3d6b3))
* **plugins:** ♻️ 优化自动导航栏的接口 ([5f91e32](https://github.com/docs-site/vitepress-theme-mist/commit/5f91e32085cce35bff11fa439d8445ffeb350965))
* **theme:** ♻️ 把@docs-site/vitepress-auto-nav-sidebar添加到主题(本地添加) ([66e0ec9](https://github.com/docs-site/vitepress-theme-mist/commit/66e0ec906601e6f213324ab4e80e3edc91ee0494))
* **theme:** ♻️ 调整aside和sidebar的悬停样式和动画 ([c94126f](https://github.com/docs-site/vitepress-theme-mist/commit/c94126fcf5a3c2d09242cf651a5981816e6e90d8))
* **theme:** ♻️ 主题中@docs-site/vitepress-auto-nav-sidebar插件改为在线包 ([fa477ce](https://github.com/docs-site/vitepress-theme-mist/commit/fa477ceca105d5785b72ccbf60bfb26ccf35199d))
* **theme:** ♻️ 注册插件demo到主题中 ([58f4563](https://github.com/docs-site/vitepress-theme-mist/commit/58f456303fca90195cefb18e5b1a2d058dbfe1b1))

### [1.0.8](https://github.com/docs-site/vitepress-theme-mist/compare/v1.0.7...v1.0.8) (2025-08-27)


### Features

* **theme:** 🚀 滚动到锚点,自动在 URL 后面添加锚点信息 ([0331d2b](https://github.com/docs-site/vitepress-theme-mist/commit/0331d2b86f3685188d9394efb28308dc390083a6))


### Bug Fixes

* **theme:** 🐞 修复代码块样式异常问题 ([1624659](https://github.com/docs-site/vitepress-theme-mist/commit/16246592b7afb3649200a2e0cc9d87b31659e8e5))


### Styling

* **eslint:** 🎨 添加eslint代码检查相关依赖 ([4735343](https://github.com/docs-site/vitepress-theme-mist/commit/47353433990b6d8d57f5623efd6f01a83e04976e))
* **format:** 🎨 添加代码格式化依赖和脚本 ([ed60596](https://github.com/docs-site/vitepress-theme-mist/commit/ed6059632aad601692d3adba530eca11c5202273))
* **format:** 🎨 prettier格式化代码 ([c115bb0](https://github.com/docs-site/vitepress-theme-mist/commit/c115bb0de3ec6c925ba5f79c943972be0181b356))


### Others

* **release:** 🔨 release @docs-site/vitepress-plugin-doc-analysis@1.0.1 ([9c9c4b9](https://github.com/docs-site/vitepress-theme-mist/commit/9c9c4b97a01533b75b7f81ed39bfe697975dafcb))


### Build System

* **release:** 📦️ 删除.versionrc中template字段、添加skip字段并跳过打tag步骤 ([b5ab9af](https://github.com/docs-site/vitepress-theme-mist/commit/b5ab9affe06b37d1200a47f4b4d9ba9b8b975c3d))
* **release:** 📦️ 添加changeset相关依赖和脚本 ([acb361b](https://github.com/docs-site/vitepress-theme-mist/commit/acb361b9bff311ac3116a29eff606c0417e54b0c))
* **release:** 📦️ 添加standard-version工具和脚本 ([df9fefe](https://github.com/docs-site/vitepress-theme-mist/commit/df9fefec86f6336b5ce2c6518141179bbeb3395b))
* **release:** 📦️ 自定义standard-version提交记录格式 ([34bbd49](https://github.com/docs-site/vitepress-theme-mist/commit/34bbd491346a8d8d92835768722dc82bf3d8839e))
* **release:** 📦️ changeset更新版本后更新依赖此包的包中的版本 ([186dd08](https://github.com/docs-site/vitepress-theme-mist/commit/186dd08e0c275567d57c39acc428f772f92dd47c))
* **release:** 📦️ standard-version同时更新version.ts ([4e3194f](https://github.com/docs-site/vitepress-theme-mist/commit/4e3194f632f76988e9135ec84fd4cb0b4efe01a5))


### Docs

* 📚 更新开发文档 ([5022a93](https://github.com/docs-site/vitepress-theme-mist/commit/5022a93a4c123aee8bbde2b92f574feaac0e92ae))


### Code Refactoring

* **site:** ♻️ 工作区内站点更新自动侧边栏使用方式 ([fb4885a](https://github.com/docs-site/vitepress-theme-mist/commit/fb4885a829c9920f17088d2aebd9bee1f7d7d35d))
* **site:** ♻️ 修改工作区站点中vue实例中组件导入来源 [deploy] ([b90d9d2](https://github.com/docs-site/vitepress-theme-mist/commit/b90d9d25b5c62b820945e06bc10dde736766ec6f))
* **theme:** ♻️ 将vitepress-nav-sidebar内置 ([49ebe2d](https://github.com/docs-site/vitepress-theme-mist/commit/49ebe2d8253c9be2ea2c787140f16d51769991f9))
* **theme:** ♻️ 优化侧边栏、添加首页彩虹动画 ([2a493fa](https://github.com/docs-site/vitepress-theme-mist/commit/2a493fa67555e7d545132a2eb385d82de317d52c))
* **theme:** ♻️ 优化相关功能、修改一些变量命名、修复语法错误、添加工具函数 ([3e16b9b](https://github.com/docs-site/vitepress-theme-mist/commit/3e16b9b61d8e0dcae1a988770c0ee15b60018754))
