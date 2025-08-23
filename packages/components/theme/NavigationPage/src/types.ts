/**
 * 导航链接项接口
 */
export interface NavigationLinkItem {
  /** 站点图标 */
  icon?: string | { svg: string }
  /** 徽章 */
  badge?:
    | string
    | {
        text?: string
        type?: 'info' | 'tip' | 'warning' | 'danger'
      }
  /** 站点名称 */
  title: string
  /** 站点描述 */
  desc?: string
  /** 站点链接 */
  link: string
}

/**
 * 导航数据接口
 */
export interface NavigationData {
  /** 导航组标题 */
  title: string
  /** 导航链接项列表 */
  items: NavigationLinkItem[]
}
