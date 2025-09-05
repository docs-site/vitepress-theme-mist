import type { DefaultTheme } from "vitepress";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { DirectoryStructure, NavOption } from "./types";
import { isSome } from "./utils";

// 默认忽略的文件夹列表
export const DEFAULT_IGNORE_DIR = ["node_modules", "dist", ".vitepress", "public"];

// 获取默认导航数据
function createTestRewritesNavigation(): DefaultTheme.NavItem[] {
  const navDataArray: DefaultTheme.NavItem[] = [];

  // 默认导航数据
  navDataArray.push({ text: "开发", link: "/sdoc/develop/126b07e425dd1639079fc233" });
  navDataArray.push({
    text: "组件",
    items: [
      { text: "公共组件", link: "/sdoc/component/common-omponent/126b07e426211d981dabe777" },
      { text: "主题组件", link: "/sdoc/component/theme-component/126b07e426261ee5180ba94f" },
    ],
  });
  navDataArray.push({
    text: "插件",
    link: "/sdoc/plugin/126b07e4263338b58be0c6f4",
  });

  return navDataArray;
}

export default (rewrites: Record<string, string> = {}, option: NavOption = {}, prefix: string = "/") => {
  const { path } = option;

  // 如果 path 为 falsy 值 (undefined, null, 空字符串等)，使用测试数据
  if (!path) return [];

  // 使用 fs.existsSync 检查路径在文件系统中是否存在
  if (!existsSync(path)) return createTestRewritesNavigation();

  const navDataArray: DefaultTheme.NavItem[] = [];
  prefix = prefix.replace(/\/$/, "") + "/";

  // 转换 rewrites 为目录结构
  const dirStructure = buildDirectoryStructure(rewrites);
  // console.log("rewrites=",rewrites)
  // console.log("dirStructure=",dirStructure)
  // 使用 createNavigationItems 生成顶级导航项
  const topLevelNavItems = createNavigationItems(dirStructure, path, option, prefix, 1);
  navDataArray.push(...topLevelNavItems);

  // console.log("Navigation Data:", JSON.stringify(navDataArray, null, 4));
  return navDataArray;
};

/**
 * @brief 构建目录结构树
 */
const buildDirectoryStructure = (rewrites: Record<string, string>): DirectoryStructure => {
  const structure: DirectoryStructure = {};

  Object.entries(rewrites).forEach(([key, value]) => {
    const parts = key.split("/");
    let currentLevel = structure;

    // 遍历路径部分，构建嵌套结构
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      // 最后一部分是文件
      if (isLast) currentLevel[part] = value;
      else {
        // 中间部分是目录
        if (!currentLevel[part]) currentLevel[part] = {};
        currentLevel = currentLevel[part] as DirectoryStructure;
      }
    }
  });

  return structure;
};
/**
 * 递归创建导航项 (仅处理目录)
 *
 * @param structure 目录结构
 * @param rootPath 文件系统的根路径
 * @param option 导航配置选项
 * @param prefix URL 前缀
 * @param currentLevel 当前层级
 */
const createNavigationItems = (
  structure: DirectoryStructure,
  rootPath: string,
  option: NavOption,
  prefix: string = "/",
  currentLevel: number = 1
): DefaultTheme.NavItem[] => {
  const { maxLevel = 1 } = option;
  const navItems: DefaultTheme.NavItem[] = [];
  // 合并默认忽略列表和传入的忽略列表
  const combinedIgnoreList = [...DEFAULT_IGNORE_DIR, ...(option.ignoreList || [])];

  Object.entries(structure).forEach(([name, fileInfo]) => {
    // 只处理目录 (对象类型)
    if (typeof fileInfo === "string") return;
    if (isSome(combinedIgnoreList, name)) return;

    const fullPath = join(rootPath, name);
    if (!existsSync(fullPath)) return;

    // 解析目录名，去除序号前缀
    // 使用正则表达式移除序号前缀，支持 . - _ 作为分隔符
    const displayName = name.replace(/^\d+[.\-_]/, "");

    // 查找该目录下的 index.md 作为链接
    let link: string | undefined;
    if (fileInfo["index.md"]) {
      link = `/${fileInfo["index.md"]}`;
    } else if (fileInfo["index.MD"]) {
      link = `/${fileInfo["index.MD"]}`;
    }

    // 如果达到最大层级，则作为简单链接项 (如果有 index.md)
    if (currentLevel >= maxLevel) {
      if (link) {
        navItems.push({ text: displayName, link } as DefaultTheme.NavItemWithLink);
      }
      return;
    }

    // 递归处理子目录
    const subItems = createNavigationItems(fileInfo, fullPath, option, `${prefix}${name}/`, currentLevel + 1);

    // 如果有子项，则作为带下拉菜单的项
    if (subItems.length > 0) {
      // 即使有 link，VitePress 的 NavItemWithChildren 也不能同时有 link 和 items
      // 因此，我们优先显示子项下拉菜单
      navItems.push({
        text: displayName,
        items: subItems,
      } as DefaultTheme.NavItemWithChildren);
    } else if (link) {
      // 如果没有子项但有 index.md，则作为简单链接项
      navItems.push({ text: displayName, link } as DefaultTheme.NavItemWithLink);
    }
  });

  return navItems;
};
