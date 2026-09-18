import type { CommentConfig } from "../interface";

// 评论区默认配置，provider 可选值与各提供者的 options 见 interface/comment.ts
export const commentConfig: CommentConfig<"giscus"> = {
  provider: "giscus", // 评论区提供者
  // 评论区配置项，根据 provider 不同而不同，具体看对应官网的使用介绍
  options: {
    // giscus 配置，官网：https://giscus.app/zh-CN
    repo: "docs-site/giscus-discussions",
    repoId: "R_xxxxxxxxxxx",
    // TODO 在 giscus.app 选择讨论分类后，替换为生成的 data-category 与 data-category-id
    category: "[在此输入分类名]",
    categoryId: "[在此输入分类 ID]",
    mapping: "pathname", // 评论与页面的关联方式
    inputPosition: "bottom", // 输入框位置
  },
};

// 其他评论提供者配置示例
// comment: {
//   provider: "twikoo", // 评论区提供者
//   options: {
//     // twikoo 配置，官网：https://twikoo.js.org/
//     envId: "your envId",
//   },
// },
// comment: {
//   provider: "waline", // 评论区提供者
//   options: {
//     // waline 配置，官网：https://waline.js.org/
//     serverURL: "your serverURL",
//   },
// },
// comment: {
//   provider: "artalk", // 评论区提供者
//   options: {
//     // artalk 配置，官网：https://artalk.js.org/
//     server: "your server",
//     site: "site",
//   },
// },
