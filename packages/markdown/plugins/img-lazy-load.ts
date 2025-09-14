import type MarkdownIt from "markdown-it";
import type { Token } from "markdown-it";

/**
 * Markdown 插件：自动为 HTML img 标签添加 loading="lazy" 属性
 * 这个插件会处理两种类型的图片：
 * 1. Markdown 语法图片 (![](image.png)) - 由 VitePress 默认处理
 * 2. HTML 标签图片 (<img src="image.png">) - 由本插件处理
 */
export const imgLazyLoadPlugin = (md: MarkdownIt, enabled: boolean = true) => {
  // 如果懒加载未启用，直接返回
  if (!enabled) {
    return;
  }
  // 保存默认的 HTML 块渲染器
  const defaultHtmlBlockRender = md.renderer.rules.html_block!;

  // 处理 HTML 块（包含 <img> 标签的块）
  md.renderer.rules.html_block = (tokens: Token[], idx: number, options, env, self) => {
    const token = tokens[idx];
    let content = token.content;

    // 使用正则表达式匹配 <img> 标签并添加 loading="lazy"
    content = content.replace(
      /<img(\s+[^>]*?)(?:\s+loading\s*=\s*(["'])(?:lazy|eager|auto)\2)?([^>]*?)>/gi,
      (match, before, quote, after) => {
        // 如果已经有 loading 属性，跳过
        if (match.includes("loading=")) {
          return match;
        }

        // 添加 loading="lazy" 属性
        return `<img${before} loading="lazy"${after}>`;
      }
    );

    token.content = content;
    return defaultHtmlBlockRender(tokens, idx, options, env, self);
  };

  // 处理 HTML 内联（包含 <img> 标签的内联内容）
  const defaultHtmlInlineRender = md.renderer.rules.html_inline!;

  md.renderer.rules.html_inline = (tokens: Token[], idx: number, options, env, self) => {
    const token = tokens[idx];
    let content = token.content;

    // 使用正则表达式匹配 <img> 标签并添加 loading="lazy"
    content = content.replace(
      /<img(\s+[^>]*?)(?:\s+loading\s*=\s*(["'])(?:lazy|eager|auto)\2)?([^>]*?)>/gi,
      (match, before, quote, after) => {
        // 如果已经有 loading 属性，跳过
        if (match.includes("loading=")) {
          return match;
        }

        // 添加 loading="lazy" 属性
        return `<img${before} loading="lazy"${after}>`;
      }
    );

    token.content = content;
    return defaultHtmlInlineRender(tokens, idx, options, env, self);
  };
};

export default imgLazyLoadPlugin;
