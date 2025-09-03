import { version } from "../../../packages/mist/version";
// 页脚信息组配置
export const FooterInfoConfig = {
  // 页脚信息，支持 HTML 格式（位于主题版权上方）
  topMessage: ["莫道桑榆晚, 为霞尚满天"],
  // 页脚信息，支持 HTML 格式（位于主题版权下方）
  bottomMessage: [""],
  // 主题版权配置
  theme: {
    show: true, // 是否显示主题版权，建议显示
    name: `mist@${version}`, // 自定义名称
    link: "https://github.com/docs-site/vitepress-theme-mist", // 自定义链接
  },
  // 博客版权配置
  copyright: {
    show: true, // 是否显示博客版权
    createYear: 2025, // 创建年份
    suffix: "苏木", // 后缀
  }
};
