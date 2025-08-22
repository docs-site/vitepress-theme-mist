import type {
  LayoutMode,
  LayoutModeVal,
} from "../../components/theme/ThemeEnhance/src/themeEnhance";

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
  /**
   * 布局切换配置
   */
  layoutSwitch?: {
    /**
     * 禁用布局切换
     */
    disabled?: boolean;
    /**
     * 布局切换的默认模式
     *
     * @default LayoutMode.Original
     */
    defaultMode?: LayoutMode | LayoutModeVal;
    /**
     * 切换布局成功后的回调
     *
     * @since 1.3.2
     */
    switchModeDone?: (mode: LayoutMode | LayoutModeVal) => void;
    /**
     * 禁用帮助提示
     *
     * @default false
     */
    disableHelp?: boolean;
    /**
     * 禁用布局切换动画
     */
    disableAnimation?: boolean;
    /**
     * 内容布局最大宽度的默认百分比，仅限 0-100
     *
     * @default 90 (90%)
     */
    defaultDocMaxWidth?: number;
    /**
     * 禁用帮助提示
     *
     * @default false
     */
    disableDocMaxWidthHelp?: boolean;
    /**
     * 页面布局最大宽度的默认百分比，仅限 0-100
     *
     * @default 95 (95%)
     */
    defaultPageMaxWidth?: number;
    /**
     * 禁用帮助提示
     *
     * @default false
     */
    disablePageMaxWidthHelp?: boolean;
  };
}
