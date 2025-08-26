import type MarkdownIt from "markdown-it";
import type { ContainerOption, ContainerLabel } from "../../markdown";

export interface Markdown {
  config?: (md: MarkdownIt) => void; // 注册更多 markdown 插件函数
  // 内置 markdown 容器的 Label 配置
  container?: {
    label?: ContainerLabel; // 自定义容器标题
    config?: () => ContainerOption[]; // 自定义 markdown 容器配置
  };
  demo?: Demo; // demo 插件配置
}

export interface Demo {
  disabled?: boolean; // 是否禁用 demo 插件 @default false
  playgroundUrl?: string; // Playground 链接
  playgroundMainFileName?: string; // Playground 主文件名 @default 'App.vue'
  githubUrl?: string; // Github 链接
  playgroundButtonTip?: string; // 鼠标悬浮 Playground 按钮提示 @default '在 Playground 中编辑'
  githubButtonTip?: string; // 鼠标悬浮 Github 按钮提示 @default '在 Github 中编辑'
  copyButtonTip?: string; // 鼠标悬浮复制代码按钮提示 @default '复制代码'
  collapseSourceButtonTip?: string; // 鼠标悬浮复查看源代码按钮提示（代码块处于折叠状态） @default '查看源代码'
  expandSourceButtonTip?: string; // 鼠标悬浮复查看源代码按钮提示（代码块处于展开状态） @default '隐藏源代码'
}
