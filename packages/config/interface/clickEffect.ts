export interface ClickEffect {
  /**
   * 是否开启点击特效功能
   *
   * @default false
   */
  enabled?: boolean;
  /**
   * 显示的文本数组
   *
   * @default ['富强', '民主', '文明', '和谐', '自由', '平等', '公正', '法治', '爱国', '敬业', '诚信', '友善']
   */
  textArray?: string[];
  /**
   * 文本大小
   *
   * @default 16
   */
  fontSize?: number;
  /**
   * 是否随机显示文本
   *
   * @default false
   */
  random?: boolean;
}
