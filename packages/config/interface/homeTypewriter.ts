export interface HomeTypewriter {
  /**
   * 是否开启首页打字机功能
   *
   * @default false
   */
  enabled?: boolean;
  /**
   * 打字机轮播的文案数组
   *
   * @default []
   */
  texts?: string[];
  /**
   * 打字间隔时间，单位：毫秒
   *
   * @default 200
   */
  inputTime?: number;
  /**
   * 删字间隔时间，单位：毫秒
   *
   * @default 100
   */
  outputTime?: number;
  /**
   * 打完/删完一条文案后到下一条的间隔时间，单位：毫秒
   *
   * @default 800
   */
  nextTime?: number;
  /**
   * 是否随机切换下一条文案
   *
   * @default false
   */
  shuffle?: boolean;
}
