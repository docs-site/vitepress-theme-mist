---
title: LV022-Git提交规范与工具集成
date: 2026-09-20 19:28:15
icon: famicons:logo-markdown
permalink: /sdoc/develop/126d5cf36f2f361eeded65d4
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
  detailDate: 2026-09-20 19:28:15.865
  fulluuid: eeded65d495b4775837aa95b4f4a8ef9
  useduuid: eeded65d4
---

在现代前端开发中，规范化的 Git 提交信息对于项目维护和版本管理至关重要。本文将详细介绍 husky、cz-git 和 @commitlint/cli 三个工具的使用方法，以及如何建立一套完整的 Git 提交规范体系。

> 为方便后面演示，可以通过`npm init -y`命令初始化一个测试项目，初始化完成后使用`git init`命令创建版本库。

## 一、Husky - Git 钩子工具

### 1. 简介

[Husky](https://husky.nodejs.cn/) 是一个现代化的 Git 钩子管理工具，它允许我们在 Git 的各个生命周期节点（如 pre-commit、commit-msg 等）执行自定义脚本。通过 Husky，我们可以自动化执行代码检查、测试、提交信息验证等任务。

> Git仓库：[GitHub - typicode/husky: Git hooks made easy 🐶 woof!](https://github.com/typicode/husky)

### 2. 安装与配置

#### 2.1 安装husky

```bash
npx husky-init
```

在 `package.json` 中添加 prepare 脚本以确保 husky 在安装依赖时自动启用：

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

#### 2.2 Prepare 脚本机制

在 Husky v5+ 版本中，通过 `prepare` 脚本实现自动初始化是一种推荐做法。该脚本并非在所有情况下都会执行，而是在特定条件下自动触发：

- **自动执行的情况：**

（1）安装依赖时：运行 `npm install` 或 `pnpm install` 时会自动执行

（2）发布包之前：运行 `npm publish` 等发布命令时会执行

（3）从 Git 仓库安装包：当从 Git 仓库安装依赖时会执行

- **不会自动执行的情况：**

（1）使用 `--ignore-scripts` 参数时：`npm install --ignore-scripts`

（2）生产环境安装：`npm install --production`（可能跳过）

（3）嵌套依赖安装时通常不会执行

> 通过在 `package.json` 中配置 `"prepare": "husky"`，可以确保：
>
> - 新开发者克隆项目后运行 `pnpm install` 时自动初始化 husky
> - Git 钩子路径被正确设置，指向项目中的 .husky 目录
> - 团队成员拥有统一的 Git 钩子配置环境

### 3. 基本用法

#### 3.1 添加 Git 钩子

可以通过命令行添加钩子：

```bash
# 添加 pre-commit 钩子
npx husky add .husky/pre-commit "npm run lint:lint-staged"

# 添加 commit-msg 钩子
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

- pre-commit 钩子在每次执行 `git commit` 命令之前自动触发，用于执行自定义的检查和操作。

- commit-msg钩子是 git commit 命令时自动触发，并将提交信息作为参数传递给它。

#### 3.2 钩子脚本示例

.pre-commit 脚本示例：

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint:lint-staged
```

.commit-msg 脚本示例：

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit $1
```

### 4. 使用实例

#### 4.1 初始化husky

首先安装并初始化husky

```bash
npx husky-init
```

然后`package.json`就会自动更新，添加以下内容：

```json
{
  //...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "prepare": "husky install"
  },
  //...
  "devDependencies": {
    "husky": "^8.0.0"
  }
}
```

并且会生成`.husky`目录

```bash
test
├── .editorconfig
├── .husky
│   ├── pre-commit
│   └── _
│       ├── .gitignore
│       └── husky.sh
└── package.json

2 directories, 5 files
```

#### 4.2 添加钩子脚本

上面创建时已经生成了一个pre-commit:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm test

```

我们再创建一个commit-msg：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "[commit-msg]Commit message: $(cat "$1")"

```

#### 4.3 创建提交

提交前先改掉script中的test:

```json
{
  //...
  "scripts": {
    "test": "echo \"Error: no test specified\"",
    "prepare": "husky install"
  }
  //...
}
```

删掉`&& exit 1`这部分，然后执行提交：

```bash
git add .
git commit -m "commit test!"
```

然后就会看到以下打印信息出现：

```bash
D:\sumu_blog\test [master +3 ~1 -0 | +0 ~1 -0 !]> git add .
D:\sumu_blog\test [master +3 ~1 -0 ~]> git commit -m "commit test!"

> test@1.0.0 test
> echo "Error: no test specified"

"Error: no test specified"
[commit-msg]Commit message: commit test!
[master 91eeebc] commit test!
 4 files changed, 59 insertions(+), 2 deletions(-)
 create mode 100644 .editorconfig
 create mode 100644 .husky/commit-msg
 create mode 100644 .husky/pre-commit
```

## 二、Cz-git - 交互式提交工具

### 1. 简介

[Cz-git](https://cz-git.qbb.sh/zh/)是一个专为 Git 设计的交互式提交工具，它是 commitizen 的适配器之一。它提供了一个友好的命令行界面，引导开发者编写符合规范的提交信息。

> Git仓库：[GitHub - Zhengqbbb/cz-git: cz-git | czg 🛠️ DX first and more engineered, lightweight, customizable, standard output format Commitizen adapter and CLI](https://github.com/Zhengqbbb/cz-git)

在使用 Cz-git 时，我们会涉及到三个核心包，它们各自有不同的作用：

#### 1.1 commitizen

Commitizen 是一个通用的交互式提交工具，它本身不包含具体的提交格式逻辑，而是依赖于适配器来提供具体的提交格式和交互流程。它提供了一个友好的命令行界面，引导开发者编写符合规范的提交信息。

主要特点：

- 作为交互式提交的入口工具
- 支持多种适配器（如 cz-conventional-changelog、cz-git 等）
- 提供统一的交互式提交体验

#### 1.2 cz-git

Cz-git 是 commitizen 的一个适配器，专为 Git 设计的交互式提交工具。它提供了符合 Conventional Commits 规范的交互式提交界面，包括提交类型选择、作用范围输入、提交信息描述等功能。

主要特点：

- 更轻量级、高度可定制
- 支持 Emoji 表情
- 支持智能提示和校验
- 输出标准格式的提交信息

#### 1.3 @commitlint/config-conventional

这是一个共享的 commitlint 配置包，实现了 Conventional Commits 规范。它定义了一套默认规则来校验提交信息是否符合规范，包括提交类型、提交信息格式等。

主要特点：

- 实现了标准的 Conventional Commits 规范
- 提供了一套预定义的校验规则
- 可以与其他 commitlint 规则组合使用
- 确保团队提交信息的一致性

> 没有这个包的话，可能会报错：
>
> ```bash
> (node:17764) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///D:/sumu_blog/test/commitlint.config.js is not specified and it doesn't parse as CommonJS.
> Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
> To eliminate this warning, add "type": "module" to D:\sumu_blog\test\package.json.
> (Use `node --trace-warnings ...` to show where the warning was created)
> Cannot find module "@commitlint/config-conventional" from "D:\sumu_blog\test"
> ```

### 2. 安装与配置

#### 2.1 安装依赖

```bash
# 安装相关依赖
npm i -D commitizen cz-git @commitlint/config-conventional
```

#### 2.2 配置commitizen

在 `package.json` 中配置 commitizen：

```json
{
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  }
}
```

在 `package.json` 中配置 commitizen 路径的原因如下：

Commitizen 是一个通用的交互式提交工具，它本身不包含具体的提交格式逻辑，而是依赖于适配器来提供具体的提交格式和交互流程。

项目中使用的是 `cz-git` 适配器，它提供了符合 Conventional Commits 规范的交互式提交界面。通过在 `package.json` 中配置 `path` 字段，告诉 commitizen 使用 `cz-git` 作为适配器来处理交互式提交。

当运行 `npx cz` 或 `npm run commit` 时，commitizen 会根据这个配置加载 `cz-git` 适配器，`cz-git` 适配器提供了符合项目规范的交互式提交界面，包括：

- 提交类型选择（feat、fix、docs 等）
- 作用范围输入
- 提交信息描述
- 详细变更说明
- 关联 Issue 等

通过这种方式，项目可以确保所有开发者使用统一的提交格式，提供友好的交互式提交体验，减少手动输入错误，为后续的 CHANGELOG 生成和语义化版本管理奠定基础。

如果不配置这个路径，commitizen 将不知道使用哪个适配器，也就无法提供符合项目规范的交互式提交功能。

#### 2.3 commitlint.config.js

`commitlint.config.js` 是 commitlint 工具的配置文件，用于定义 Git 提交信息的校验规则，同时也用于自定义交互界面的一些信息。它的主要作用包括：

（1）**定义校验规则**：通过配置不同的规则来校验提交信息是否符合规范

（2）**继承标准配置**：通过 extends 字段继承 @commitlint/config-conventional 等标准配置

（3）**自定义规则**：可以根据团队需求自定义特定的校验规则

在项目中，我们通常会继承 @commitlint/config-conventional 标准配置，并在此基础上添加自定义规则：

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "revert", "chore"],
    ],
    "subject-full-stop": [0, "never"],
    "subject-case": [0, "never"],
  },
};
```

在这个配置中：

- `extends` 字段继承了 @commitlint/config-conventional 标准配置
- `rules` 字段定义了自定义规则，如 type-enum 限制了提交类型只能是数组中的值
- `subject-full-stop` 和 `subject-case` 规则被设置为禁用状态（0表示禁用）

### 3. 基本用法

```bash
# 使用交互式方式提交
npx cz

# 或者添加到 package.json 脚本中
# "scripts": {
#   "commit": "cz"
# }
```

运行后会出现交互式提示，引导用户选择提交类型、填写描述等。

除了使用`cz`命令，还可以用`git-cz` ，这是 commitizen 提供的一个命令行工具，它是 `commitizen` 的别名命令。当安装了 commitizen 后，它会提供两个命令：

- `cz` - 标准的 commitizen 命令

- `git-cz` - git 插件形式的 commitizen 命令，可以直接通过 `git cz` 调用

在实际项目中，通常会在 `package.json` 中配置类似的脚本：

```json
{
  "scripts": {
    "cz": "git add . && git-cz"
  }
}
```

这样配置的好处是可以通过 `npm run cz` 或 `yarn cz` 执行两步操作：

（1）`git add .` - 将所有更改添加到暂存区

（2）`git-cz` - 启动 commitizen 的交互式提交界面

### 4. 使用实例

#### 4.1 基本用法

我们先安装依赖：

```bash
npm i -D commitizen cz-git @commitlint/config-conventional
```

然后在`package.json`添加下面命令：

```json
{
  //...
  "scripts": {
    "test": "echo \"Error: no test specified\"",
    "prepare": "husky install",
    "cz": "git add . && git-cz"
  },
  //...
  "devDependencies": {
    "@commitlint/config-conventional": "^19.8.1",
    "commitizen": "^4.3.1",
    "cz-git": "^1.12.0",
    "husky": "^8.0.0"
  }
}
```

然后运行`npm run cz`，就出现了下面的提示信息：

```bash
D:\sumu_blog\test [master +1 ~1 -0 !]> npm run cz

> test@1.0.0 cz
> git add . && git-cz

cz-cli@4.3.1, cz-git@1.12.0

? Select the type of change that you're committing: Use arrow keys or type to search
❯ feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect the meaning of the code
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
  test:     Adding missing tests or correcting existing tests
(Move up and down to reveal more choices)
```

这都是一些默认的，然后跟着提示一步一步操作：

```bash
? Select the type of change that you're committing: feat:     A new feature
? Denote the SCOPE of this change (optional): custom
? Denote the SCOPE of this change: package.json
? Write a SHORT, IMPERATIVE tense description of the change:
 [Infinity more chars allowed]
 cz测试
? Provide a LONGER description of the change (optional). Use "|" to break new line:
 cz工具的使用

? Select the ISSUES type of change (optional): custom
? Input ISSUES prefix: #
? List any ISSUES AFFECTED by this change. E.g.: #31, #34:
 1

###--------------------------------------------------------###
feat(package.json): cz测试

cz工具的使用

# 1
###--------------------------------------------------------###

? Are you sure you want to proceed with the commit above? Yes

> test@1.0.0 test
> echo "Info: No test specified. Please implement your tests." && exit 0

"Info: No test specified. Please implement your tests."
[commit-msg]Commit message: feat(package.json): cz测试

cz工具的使用

# 1
[master 4280900] feat(package.json): cz测试
 2 files changed, 2046 insertions(+), 2 deletions(-)
 create mode 100644 package-lock.json
```

最终会得到这样一条提交：

```bash
D:\sumu_blog\test [master]> git log -1
commit 42809008b7147aa024b701c264cdccd6b0dfc84a (HEAD -> master)
Author: 苏木 <sumu@example.com>
Date:   Mon Aug 25 13:06:31 2025 +0800

    feat(package.json): cz测试

    cz工具的使用

    # 1
```

#### 4.2 commitlint.config.js

我们再创建一个commitlint.config.js文件来自定义提交信息格式：

```javascript
// docs：https://cz-git.qbb.sh/zh
import { defineConfig } from "cz-git";

export default defineConfig({
  ignores: [commit => commit.includes("init")],
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "revert", "chore"],
    ],
  },
  prompt: {
    messages: {
      type: "选择要提交的类型: ",
      scope: "选择一个提交范围（可选）: ",
      customScope: "请输入自定义的提交范围: ",
      subject: "填写简短精炼的变更描述:\n",
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行:\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行:\n',
      footerPrefixesSelect: "选择关联 Issue 前缀（可选）: ",
      customFooterPrefix: "输入自定义 Issue 前缀: ",
      footer: "列举关联 Issue (可选) 例如: #31, #I3244:\n",
      confirmCommit: "是否提交或修改 commit ?",
    },
    types: [
      { value: "feat", name: "feat:     🚀  新增功能 | A new feature", emoji: "🚀" },
      { value: "fix", name: "fix:      🐞  修复缺陷 | A bug fix", emoji: "🐞" },
      { value: "docs", name: "docs:     📚  文档更新 | Documentation only changes", emoji: "📚" },
      {
        value: "style",
        name: "style:    🎨  代码格式 | Changes that do not affect the meaning of the code",
        emoji: "🎨",
      },
      {
        value: "refactor",
        name: "refactor: ♻️   代码重构 | A code change that neither fixes a bug nor adds a feature",
        emoji: "♻️",
      },
      { value: "perf", name: "perf:     ⚡️  性能优化 | A code change that improves performance", emoji: "⚡️" },
      {
        value: "test",
        name: "test:     ✅  测试相关 | Adding missing tests or correcting existing tests",
        emoji: "✅",
      },
      {
        value: "build",
        name: "build:    📦️  构建相关 | Changes that affect the build system or external dependencies",
        emoji: "📦️",
      },
      { value: "ci", name: "ci:       🎡  持续集成 | Changes to our CI configuration files and scripts", emoji: "🎡" },
      { value: "revert", name: "revert:   ⏪️  回退代码 | Revert to a commit", emoji: "⏪️" },
      {
        value: "chore",
        name: "chore:    🔨  其他修改 | Other changes that do not modify src or test files",
        emoji: "🔨",
      },
    ],
    useEmoji: true, // 是否使用Emoji表情
    emojiAlign: "center", // Emoji对齐方式
    themeColorCode: "", // 自定义主题颜色代码
    useAI: false, // 是否启用AI辅助生成提交信息
    aiNumber: 1, // AI生成提交信息的数量
    scopes: [], // 预定义的作用域列表
    allowCustomScopes: true, // 是否允许自定义作用域
    allowEmptyScopes: true, // 是否允许空作用域
    customScopesAlign: "bottom", // 自定义作用域在列表中的对齐位置
    customScopesAlias: "custom", // 自定义作用域的别名
    emptyScopesAlias: "empty", // 空作用域的别名
    upperCaseSubject: false, // 是否将提交主题首字母大写
    markBreakingChangeMode: false, // 是否标记破坏性变更模式
    allowBreakingChanges: ["feat", "fix"], // 允许标记为破坏性变更的提交类型
    breaklineNumber: 100, // 换行字符数限制
    breaklineChar: "|", // 换行字符
    skipQuestions: [], // 跳过的问题列表
    issuePrefixes: [{ value: "closed", name: "closed:   ISSUES has been processed" }], // Issue前缀选项
    customIssuePrefixAlign: "top", // 自定义Issue前缀对齐方式
    emptyIssuePrefixAlias: "skip", // 空Issue前缀别名
    customIssuePrefixAlias: "custom", // 自定义Issue前缀别名
    allowCustomIssuePrefix: true, // 是否允许自定义Issue前缀
    allowEmptyIssuePrefix: true, // 是否允许空Issue前缀
    confirmColorize: true, // 是否彩色化确认界面
    scopeOverrides: undefined, // 作用域覆盖配置
    defaultBody: "", // 默认的提交正文
    defaultIssues: "", // 默认的Issue引用
    defaultScope: "", // 默认作用域
    defaultSubject: "", // 默认提交主题
  },
});
```

在这个配置文件中，`prompt`字段包含了大量用于自定义交互式提交界面的配置项。

## 三、@commitlint/cli - 提交信息校验工具

### 1. 简介

@commitlint/cli 是一个用于校验 Git 提交信息是否符合规范的命令行工具。它可以与 husky 结合使用，在提交时自动校验提交信息。

> [commitlint 中文网](https://commitlint.nodejs.cn/)

### 2. 安装与配置

```bash
# 安装相关依赖
npm i -D @commitlint/cli @commitlint/config-conventional
```

创建 `commitlint.config.js` 配置文件（前面已经简单了解过了）：

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "revert", "chore"],
    ],
    "subject-full-stop": [0, "never"],
    "subject-case": [0, "never"],
  },
};
```

### 3. 基本用法

#### 3.1 命令行校验

```bash
# 校验最近一次提交
npx commitlint --from HEAD~1 --to HEAD --verbose
```

#### 3.2 与 Husky 集成

通过 Husky 在 commit-msg 钩子中集成 commitlint：

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit $1
```

### 4. 检查规则

#### 4.1 会检查哪些？

Commitlint 会检查提交信息是否符合 Conventional Commits 规范，主要包括以下几个方面：

（1）提交类型(type)检查：提交信息必须以有效的类型开头，项目中配置的有效类型包括：

- `feat`：新增功能
- `fix`：修复缺陷
- `docs`：文档更新
- `style`：代码格式（不影响功能）
- `refactor`：代码重构（不修复缺陷也不新增功能）
- `perf`：性能优化
- `test`：测试相关
- `build`：构建系统或外部依赖变更
- `ci`：持续集成相关
- `revert`：回滚提交
- `chore`：其他不修改源码或测试的变更

（2）提交格式检查：提交信息必须符合 Conventional Commits 规范格式：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

（3）必需部分：

- 提交类型(type)：必须是上述有效类型之一
- 简短描述(description)：对变更的简洁说明

例如，以下提交信息会通过检查：

```bash
feat: 添加用户登录功能
fix(auth): 修复登录验证失败问题
```

而以下提交信息会被拒绝：

```bash
add user login  # 缺少类型
unknown: 添加功能  # 类型不在有效范围内
```

#### 4.2 自定义检查规则

如果需要自定义 commitlint 的检查规则，可以通过修改 `commitlint.config.js` 配置文件实现。配置文件采用以下结构：

```javascript
import { defineConfig } from "cz-git";

export default defineConfig({
  // 继承的规则集
  extends: ["@commitlint/config-conventional"],

  // 自定义规则
  rules: {
    // 规则名称: [等级, 应用条件, 规则值]
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "revert", "chore"],
    ],
  },

  // cz-git 提交交互提示配置
  prompt: {
    // ...
  },
});
```

##### 4.2.1 规则配置说明

每条规则由三个部分组成：

**等级(Level)**：

- `0`：禁用规则
- `1`：警告级别（不会阻止提交）
- `2`：错误级别（会阻止不符合规则的提交）

**应用条件(Condition)**：

- `always`：总是应用规则
- `never`：从不应用规则（即反向规则）

**规则值(Value)**：根据具体规则而定，可能是字符串、数组或正则表达式

##### 4.2.2 常用规则示例

```javascript
rules: {
  // 强制要求提交类型必须在指定范围内
  "type-enum": [2, "always", ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "revert", "chore"]],

  // 提交主题最大长度为100个字符
  "subject-max-length": [2, "always", 100],

  // 提交主题不能为空
  "subject-empty": [2, "never"],

  // 不允许提交主题以句号结尾
  "subject-full-stop": [2, "never", "."],

  // 提交主题必须以小写字母开头
  "subject-case": [2, "always", "lower-case"],

  // 提交正文行最大长度为100个字符
  "body-max-line-length": [2, "always", 100],

  // 要求提交信息包含正文
  "body-empty": [1, "never"],
}
```

#### 4.3 添加新的自定义规则

如果需要添加新的检查规则，可以在 `rules` 对象中添加相应的配置。例如，要强制要求提交主题必须包含至少10个字符：

```javascript
rules: {
  "type-enum": [2, "always", ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "revert", "chore"]],
  "subject-min-length": [2, "always", 10], // 新增规则：提交主题最少10个字符
}
```

#### 4.4 常见规则参考

| 规则名称               | 描述                   | 示例值                                                         |
| ---------------------- | ---------------------- | -------------------------------------------------------------- |
| `type-enum`            | 限制提交类型枚举值     | `["feat", "fix"]`                                              |
| `type-case`            | 提交类型的大小写格式   | `"lower-case"`                                                 |
| `type-empty`           | 是否允许提交类型为空   | `never`                                                        |
| `scope-case`           | 作用域的大小写格式     | `"lower-case"`                                                 |
| `subject-case`         | 提交主题的大小写格式   | `["sentence-case", "start-case", "pascal-case", "upper-case"]` |
| `subject-empty`        | 是否允许提交主题为空   | `never`                                                        |
| `subject-full-stop`    | 提交主题是否以句号结尾 | `"."`                                                          |
| `subject-max-length`   | 提交主题最大长度       | `100`                                                          |
| `subject-min-length`   | 提交主题最小长度       | `10`                                                           |
| `body-leading-blank`   | 正文前是否需要空行     | `always`                                                       |
| `body-max-line-length` | 正文每行最大长度       | `100`                                                          |
| `body-empty`           | 是否允许正文为空       | `never`                                                        |
| `footer-leading-blank` | 页脚前是否需要空行     | `always`                                                       |
| `footer-empty`         | 是否允许页脚为空       | `never`                                                        |

更多规则请参考 [commitlint 官方文档](https://commitlint.js.org/#/reference-rules)。

## 四、Lint-staged - 提交前代码检查工具

### 1. 简介

[Lint-staged](https://github.com/okonet/lint-staged) 是一个用于在 Git 暂存文件上运行 linters 的工具。它可以帮助我们在代码提交前自动检查和修复代码质量问题，确保只有符合规范的代码才能被提交到版本库中。

主要特点：

- **仅检查暂存文件**：只对 Git 暂存区中的文件运行 linters，提高效率
- **可配置性强**：支持针对不同文件类型配置不同的 linter 命令
- **与 Husky 集成良好**：可以轻松地与 Husky 配合使用，在 pre-commit 钩子中运行
- **支持修复功能**：可以自动修复发现的问题并重新添加到暂存区

> [LintStaged 中文网](https://lint-staged.nodejs.cn/)

### 2. 安装与配置

#### 2.1 安装 lint-staged

```bash
# 安装 lint-staged
npm i -D lint-staged
```

#### 2.2 配置 lint-staged

lint-staged 的配置可以通过多种方式进行，最常见的方式是在 `package.json` 中添加配置或者创建单独的配置文件。

##### 方式一：在 package.json 中配置

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "!(package)*.json": ["prettier --write --parser json"],
    "package.json": ["prettier --write"],
    "*.vue": ["eslint --fix", "prettier --write"],
    "*.{vue,css,scss,postcss,less}": ["prettier --write"],
    "*.md": ["prettier --write"]
  }
}
```

- `*.{js,jsx,ts,tsx}`：JavaScript/TypeScript 文件先用 ESLint 检查并修复，再用 Prettier 格式化
- `!(package)*.json` 和 `package.json`：JSON 文件使用 Prettier 格式化
- `*.vue`：Vue 文件先用 ESLint 检查并修复，再用 Prettier 格式化
- `*.{vue,css,scss,postcss,less}`：样式文件使用 Prettier 格式化
- `*.md`：Markdown 文件使用 Prettier 格式化

##### 方式二：创建独立配置文件

可以创建 `.lintstagedrc`、`.lintstagedrc.js` 或 `lint-staged.config.js` 等配置文件。

`.lintstagedrc.js` 示例：

```js
export default {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "!(package)*.json": ["prettier --write --parser json"],
  "package.json": ["prettier --write"],
  "*.vue": ["eslint --fix", "prettier --write"],
  "*.{vue,css,scss,postcss,less}": ["prettier --write"],
  "*.md": ["prettier --write"],
};
```

### 3. 基本用法

#### 3.1 命令行使用

可以直接通过命令行运行 lint-staged：

```bash
# 运行 lint-staged
npx lint-staged
```

lint-staged 会自动将格式化工具（如 Prettier、ESLint 等）修改后的文件重新添加到 Git 暂存区，这样在同一次提交中就能包含这些格式化的更改。

例如，当使用 Prettier 格式化 Markdown 文档时，如果文档被修改，lint-staged 会自动执行 `git add` 将修改后的文件重新添加到暂存区，确保这些格式化更改会包含在当前提交中。

#### 3.2 与 Husky 集成

最常见的用法是将 lint-staged 与 Husky 结合，在 pre-commit 钩子中运行：

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "lint:lint-staged": "lint-staged"
  }
}
```

配置 Husky 的 pre-commit 钩子：

```bash
# 添加 pre-commit 钩子
npx husky add .husky/pre-commit "npm run lint:lint-staged"
```

这样，每次执行 `git commit` 时都会自动运行 lint-staged 来检查暂存区的文件。

#### 3.3 独立配置文件的执行方式

当创建独立的 lint-staged 配置文件后，有几种方式来执行配置中的命令：

##### 3.3.1 直接运行 lint-staged 命令

当创建了独立的配置文件（如 `.lintstagedrc.js`、`.lintstagedrc` 或 `lint-staged.config.js`）后，可以直接运行：

```bash
npx lint-staged
```

lint-staged 会自动查找项目根目录下的配置文件，查找顺序如下：

（1）`.lintstagedrc` 文件

（2）`lint-staged.config.js` 文件

（3）`package.json` 中的 `lint-staged` 字段

##### 3.3.2 指定配置文件运行

如果想明确指定使用哪个配置文件，可以使用 `-c` 或 `--config` 参数：

```bash
npx lint-staged -c .lintstagedrc.js
```

或者在 package.json 中定义脚本时指定配置文件：

```json
{
  "scripts": {
    "lint:lint-staged": "lint-staged -c .lintstagedrc.js"
  }
}
```

在的项目中，已经有一个 `.husky/lintstagedrc.js` 配置文件，并且在 package.json 中应该有类似这样的配置：

```json
"lint:lint-staged": "lint-staged -c .husky/lintstagedrc.js"
```

所以可以通过运行 `npm run lint:lint-staged` 来执行配置中的命令。

### 4. 配置详解

lint-staged 的配置对象以 glob 模式作为键，对应的 linter 命令数组作为值。

#### 4.1 配置语法

```js
{
  "glob pattern": ["command 1", "command 2"],
  "another pattern": ["command 3"]
}
```

#### 4.2 常用配置示例

```js
export default {
  // JavaScript/TypeScript 文件使用 ESLint 检查并修复，然后用 Prettier 格式化
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],

  // JSON 文件使用 Prettier 格式化（排除 package-lock.json 等）
  "!(package)*.json": ["prettier --write --parser json"],

  // package.json 文件使用 Prettier 格式化
  "package.json": ["prettier --write"],

  // Vue 文件使用 ESLint 检查并修复，然后用 Prettier 格式化
  "*.vue": ["eslint --fix", "prettier --write"],

  // 样式文件使用 Prettier 格式化
  "*.{vue,css,scss,postcss,less}": ["prettier --write"],

  // Markdown 文件使用 Prettier 格式化
  "*.md": ["prettier --write"],
};
```

#### 4.3 高级配置选项

除了简单的命令数组外，lint-staged 还支持更复杂的配置：

```js
export default {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    // 只有在前两个命令都成功时才运行测试
    () => "npm test",
  ],

  // 使用函数动态生成命令
  "*.js": filenames => [`eslint --fix ${filenames.join(" ")}`, `prettier --write ${filenames.join(" ")}`],

  // 条件执行
  "*.{ts,tsx}": filenames => (filenames.length > 10 ? "tsc --noEmit --skipLibCheck" : []),
};
```

### 5. 使用实例

#### 5.1 基本配置和使用

假设我们有一个项目，需要对不同类型的文件进行不同的代码检查和格式化：

安装必要的依赖：

```bash
npm install --save-dev lint-staged eslint prettier
```

创建 .lintstagedrc.js 配置文件：

```js
export default {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "!(package)*.json": ["prettier --write --parser json"],
  "package.json": ["prettier --write"],
  "*.vue": ["eslint --fix", "prettier --write"],
  "*.{vue,css,scss,postcss,less}": ["prettier --write"],
  "*.md": ["prettier --write"],
};
```

在 package.json 中添加脚本：

```json
{
  "scripts": {
    "lint:lint-staged": "lint-staged"
  }
}
```

配置 Husky 钩子：

```bash
npx husky add .husky/pre-commit "npm run lint:lint-staged"
```

#### 5.2 实际提交过程

当我们修改了一些文件并尝试提交时：

```bash
# 修改文件
echo 'console.log("Hello World");' > index.js
echo '# Test Document' > README.md

# 添加到暂存区
git add .

# 提交代码
git commit -m "feat: 添加新功能"
```

此时，lint-staged 会自动运行配置的命令：

（1）对 index.js 文件运行 ESLint 检查和修复

（2）对 index.js 和 README.md 文件运行 Prettier 格式化

（3）如果所有检查都通过，提交将继续；如果有错误，提交将被阻止

#### 5.3 错误处理

如果 lint-staged 发现问题并且无法自动修复，它会显示错误信息并阻止提交：

```bash
✔ Preparing lint-staged...
⚠ Running tasks for staged files...
  ❯ .lintstagedrc — 1 file
    ↓ *.{js,jsx,ts,tsx} — 1 file
      ✖ eslint --fix [FAILED]
      ◼ prettier --write
↓ Skipped because of errors from tasks.
✔ Reverting to original state because of errors...
✔ Cleaning up temporary files...

✖ eslint --fix found some errors. Please fix them and try committing again.
```

在这种情况下，我们需要手动修复问题后再尝试提交。

## 五、Git 提交规范

### 1. Conventional Commits 规范

一般采用 Conventional Commits 规范，提交信息格式如下：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 2. 提交类型说明

| 类型     | 描述                               | Emoji |
| -------- | ---------------------------------- | ----- |
| feat     | 新功能                             | 🚀    |
| fix      | 修复缺陷                           | 🐞    |
| docs     | 文档更新                           | 📚    |
| style    | 代码格式（不影响功能）             | 🎨    |
| refactor | 代码重构（不修复缺陷也不新增功能） | ♻️    |
| perf     | 性能优化                           | ⚡️   |
| test     | 测试相关                           | ✅    |
| build    | 构建系统或外部依赖变更             | 📦️   |
| ci       | 持续集成相关                       | 🎡    |
| revert   | 回滚提交                           | ⏪️   |
| chore    | 其他不修改源码或测试的变更         | 🔨    |

### 3. 提交信息示例

```bash
# 简单提交
feat: 添加用户登录功能

# 带范围的提交
fix(auth): 修复登录验证失败问题

# 带有详细描述的提交
perf(router): 优化路由匹配算法
- 使用缓存减少重复计算
- 简化匹配逻辑提升性能

Closes #123
```

## 六、工具集成工作流

### 1. 完整配置示例

#### 1.1 `package.json` 配置：

```json
{
  "scripts": {
    "prepare": "husky",
    "commit": "cz",
    "lint:lint-staged": "lint-staged"
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "commitizen": "^4.2.4",
    "cz-git": "^1.3.9",
    "@commitlint/cli": "^17.0.0",
    "@commitlint/config-conventional": "^17.0.0",
    "lint-staged": "^13.0.0"
  }
}
```

#### 1.2 husky配置

- `.husky/pre-commit` 钩子：

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint:lint-staged
```

- `.husky/commit-msg` 钩子：

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit $1
```

- `.husky/lintstagedrc.js` 配置：

```js
export default {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "!(package)*.json": ["prettier --write--parser json"],
  "package.json": ["prettier --write"],
  "*.vue": ["eslint --fix", "prettier --write"],
  "*.{vue,css,scss,postcss,less}": ["prettier --write"],
  "*.md": ["prettier --write"],
};
```

### 2. 日常使用流程

编写代码并添加到暂存区：

```bash
git add .
```

使用交互式方式提交（推荐）：

```bash
npm run commit
```

或者直接提交（需手动遵循规范）：

```bash
git commit -m "feat: 添加新功能"
```

推送代码：

```bash
git push
```

在整个过程中，Husky 会自动触发以下检查：

- pre-commit 阶段：运行 lint-staged 对暂存文件进行代码检查和格式化
- commit-msg 阶段：使用 commitlint 验证提交信息是否符合规范
