export const backTopConfig = {
  enabled: true, // 是否启动回到顶部功能
  content: "progress", // 回到顶部按钮的显示内容，可选配置 progress | icon
  done: (TkMessage: any) => TkMessage.success("返回顶部成功"), // 回到顶部后的回调
};
