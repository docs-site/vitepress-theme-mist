export const themeEnhanceConfig = {
  enabled: true, // 启用主题增强功能
  position: "top", // 位置，top 为导航栏右侧，bottom 为右下角
  // 布局切换配置
  layoutSwitch: {
    disabled: false, // 禁用布局切换
    defaultMode: "fullWidth", // 布局切换的默认模式
    disableHelp: false, // 禁用帮助提示
    disableAnimation: false, // 禁用布局切换动画
    defaultDocMaxWidth: 90, // 内容布局最大宽度的默认百分比，仅限 0-100
    disableDocMaxWidthHelp: false, // 禁用帮助提示
    defaultPageMaxWidth: 95, // 页面布局最大宽度的默认百分比，仅限 0-100
    disablePageMaxWidthHelp: false, // 禁用帮助提示
  },
  // 布局主题色配置
  themeColor: {
    // disabled: false, // 禁用布局主题色切换
    // defaultColorName: "vp-default", // 布局默认主题色
    // defaultSpread: false, // 是否将主题色扩散到其他元素（根据主题色计算其他元素需要的颜色）
    // disableHelp: false, // 禁用帮助提示
    // disabledInMobile: false, // 是否在移动端禁用
  },
};
