import type { Plugin } from "vite";
import { DemoOption } from "./types";
import logger from "./log";

export * from "./types";

export default function VitePluginVitePressDemo(option: DemoOption = {}): Plugin & { name: string } {
  return {
    name: "vitepress-plugin-demo",
    config(config: any) {
      // 获取 themeConfig 配置
      const {
        site: { themeConfig = {} },
      } = config.vitepress;

      // 获取传过来的参数 
      const vitepress_str = option.str;

      // 生成要挂载到 themeConfig 的数据
      const data = "hello world!" + vitepress_str;

      themeConfig.demo = data;
      
      logger.info("Injected Demo Data Successfully. 注入Demo数据成功!");
    },
  };
}

