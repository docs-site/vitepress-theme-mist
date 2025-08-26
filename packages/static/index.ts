/**
 * @file @mist/static 静态资源库
 * @brief 该库提供了一些静态资源，主要包括 SVG 图标、Iconfont 字体图标和图片资源
 * @section svg_icons SVG 图标资源 (./icons/)
 * - 基础功能图标：如箭头、关闭、复制、代码、日历等
 * - 社交媒体图标：如 GitHub、微信、支付宝等
 * - 主题增强图标：布局、全屏、缩放等功能图标
 * - 状态指示图标：成功、警告、错误、信息等
 * @section iconfont_icons Iconfont 字体图标 (./iconfont/)
 * - 社交平台图标集：包含豆瓣、知乎、微博、微信、QQ等20+社交平台图标
 * - 提供多种字体格式：.ttf、.woff、.woff2等，支持不同浏览器
 * - 包含 CSS 和 JS 引用文件，便于在项目中使用
 * @section img_resources 图片资源 (./img/)
 * - 备案相关图片等静态图片资源
 * @section usage 基本用法
 *
 * @subsection svg_usage SVG 图标使用
 *
 * @code{.vue} 主体内部使用，外部使用时 从 vitepress-theme-mist 导入
 * <template>
 *   <!-- 导入图标 -->
 *   <script setup>
 *   import { githubIcon, arrowDownIcon } from '@mist/static';        // 工作区内使用
 *   import { githubIcon, arrowDownIcon } from 'vitepress-theme-mist';// 工作区外使用
 *   </script>
 *
 *   <!-- 使用 MtIcon 组件显示 SVG 图标 -->
 *   <MtIcon :icon="githubIcon" size="24px" color="#333" />
 *   <MtIcon :icon="arrowDownIcon" size="20px" hover :hoverColor="#409EFF" />
 * </template>
 * @endcode
 *
 * @subsection iconfont_usage Iconfont 图标使用
 *
 * @code{.vue}
 * <template>
 *   <!-- 使用 MtIcon 组件显示 iconfont 图标 -->
 *   <MtIcon icon="icon-github" iconType="iconfont" size="24px" />
 *   <MtIcon icon="icon-weixin" iconType="iconfont" size="20px" color="#07C160" />
 * </template>
 * @endcode
 *
 * @note 使用 iconfont 图标前，需要先在项目中引入对应的 CSS 文件：
 * @code{.js}
 * import '@mist/static/iconfont/social/iconfont.css';
 * @endcode
 */
export * from "./icons";
