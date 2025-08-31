export interface DocFooterCopyright {
  /**
   * 是否启用页脚版权信息
   *
   * @default true
   */
  enabled?: boolean;
  
  /**
   * 文章作者名称
   *
   * @default 'Hyde'
   */
  author?: string;
  
  /**
   * 作者链接
   *
   * @default 'https://teek.seasir.top/'
   */
  authorLink?: string;
  
  /**
   * 路径映射表 - 长路径对应短路径的映射关系
   *
   * @default {}
   */
  pathMapping?: Record<string, string>;
  
  /**
   * 版权声明文本
   *
   * @default '本博客所有文章除特别声明外，均采用 BY-NC-SA 4.0 许可协议。转载请注明来自'
   */
  copyrightText?: string;
  
  /**
   * 许可协议名称
   *
   * @default 'BY-NC-SA 4.0'
   */
  licenseName?: string;
  
  /**
   * 许可协议链接
   *
   * @default 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
   */
  licenseLink?: string;
}
