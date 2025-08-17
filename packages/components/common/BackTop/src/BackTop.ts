export interface BackTopExpose {
  scrollToTop: () => void // 手动触发滚动到顶部
  getScrollProgress: () => number // 获取当前滚动进度(0-1)
  getVisibility: () => boolean // 获取当前是否显示状态
}
