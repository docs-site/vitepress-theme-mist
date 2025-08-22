export interface ThemeEnhance {
  /**
   * 启用主题增强功能
   *
   * @default true
   * @version 1.4.0
   */
  enabled?: boolean;
  /**
   * 位置，top 为导航栏右侧，bottom 为右下角
   *
   * @default 'top'
   */
  position?: "top" | "bottom";
}
