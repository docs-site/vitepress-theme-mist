export interface ButtonExpose {
  focus: () => void // 聚焦按钮
  blur: () => void  // 失焦按钮
}

export interface ButtonOption {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default' // 按钮类型
  size?: 'large' | 'default' | 'small' // 按钮尺寸
  icon?: string       // 图标类名
  autofocus?: boolean // 是否自动聚焦
  nativeType?: 'button' | 'submit' | 'reset' // 原生按钮类型
}
