export const codeBlockConfig = {
  enabled: true,
  collapseHeight: 500,
  copiedDone: (MtMessage: any) => MtMessage.success("复制成功！"),
  overlay: false,
  overlayHeight: 400,
  langTextTransform: "lowercase", // 语言文本显示样式
};
