export const toCommentConfig = {
  enabled: true, // 是否启动滚动到评论区功能
  done: (MtMessage: any) => MtMessage.success("滚动到评论区成功"), // 滚动到评论区后的回调
};
