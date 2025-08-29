import type { DefaultTheme } from "vitepress";
import type { NavOption } from "./types";
import { isSome } from "./utils";
import { readdirSync, statSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

// 默认忽略的文件夹列表
export const DEFAULT_IGNORE_DIR = ["node_modules", "dist", ".vitepress", "public"];

/**
 * @brief 扫描目录并生成导航数据
 * @details 递归扫描指定目录结构，根据目录层级和文件结构生成VitePress导航项
 *          支持最大层级限制、忽略特定目录、自动处理序号前缀等功能
 * @param option 导航侧边栏配置选项
 * @param fullDirPath 要扫描的完整目录路径
 * @param currentLevel 当前扫描的层级（默认为1）
 * @param currentPath 当前相对路径（用于递归构建链接路径）
 *
 * @return DefaultTheme.NavItem[] 生成的导航项数组
 *
 * @note 该函数会递归调用自身处理子目录
 * @warning 注意目录深度限制，避免无限递归
 * 
 * @example
 * [
 *   { "text": "开发", "link": "/sdoc/01-开发/" },
 *   {
 *     "text": "组件",
 *     "items": [
 *       { "text": "公共组件", "link": "/sdoc/02-组件/01-公共组件/" },
 *       { "text": "主题组件", "link": "/sdoc/02-组件/02-主题组件/" }
 *     ],
 *   },
 *   {
 *     "text": "插件",
 *     "link": "/sdoc/03-插件/",
 *   },
 * ],
 */
function scanDirectory(
  option: NavOption,
  fullDirPath: string,
  currentLevel: number = 1,
  currentPath: string = ""
): DefaultTheme.NavItem[] {
  const {
    maxLevel = Infinity,
    ignoreList = [],
  } = option;
  // 最大层级配置，默认为无穷大
  // D:\xxx\vitepress-theme-mist\docs\src\sdoc\lv1
  // D:\xxx\vitepress-theme-mist\docs\src\sdoc\lv1\lv2
  // D:\xxx\vitepress-theme-mist\docs\src\sdoc\lv1\lv2\lv3
  // 如果当前层级已经超过最大层级，则不继续扫描
  if (currentLevel > maxLevel) {
    return [];
  }

  const ignoreListAll = [...DEFAULT_IGNORE_DIR, ...ignoreList];

  const navItems: DefaultTheme.NavItem[] = [];
  // 读取目录名（文件和文件夹） D:\xxx\vitepress-theme-mist\docs\src\sdoc
  let dirOrFilenames = readdirSync(fullDirPath);
  
  // 检查是否只有.md文件而没有子目录
  const hasDirectories = dirOrFilenames.some(dirOrFilename => {
    const filePath = resolve(fullDirPath, dirOrFilename);
    if (!existsSync(filePath)) return false;
    const stat = statSync(filePath);
    return stat.isDirectory();
  });
  
  const hasMdFiles = dirOrFilenames.some(dirOrFilename =>
    dirOrFilename.endsWith('.md')
  );

  // 如果只有.md文件而没有子目录，则生成/option.path/这一项
  if (!hasDirectories && hasMdFiles && currentLevel === 1 && option.path) {
    const navItem: DefaultTheme.NavItem = {
      text: option.path,
      link: `/${option.path}/`
    };
    navItems.push(navItem);
  } else {
    dirOrFilenames.forEach(dirOrFilename => {
      // 在 JavaScript/TypeScript 中，Array.prototype.forEach() 方法会对数组中的每个元素执行一次提供的回调函数。
      // 如果在 forEach 回调函数中使用 return 语句，它只会提前结束当前迭代，而不会终止整个 forEach 循环或其所在的外层函数。
      if (isSome(ignoreListAll, dirOrFilename)) return [];
    
      // 获取文件或者目录路径，判断是否存在
      const filePath = resolve(fullDirPath, dirOrFilename);
      if (!existsSync(filePath)) return;
      
      const stat = statSync(filePath); // 获取文件状态
      if(stat.isDirectory()) {
        // 检查是否存在同名的.md文件，如果是则跳过该目录
        const parentDir = resolve(filePath, "..");
        const dirName = dirOrFilename;
        const mdFileName = `${dirName}.md`;
        const mdFilePath = resolve(parentDir, mdFileName);
        
        if (existsSync(mdFilePath) && statSync(mdFilePath).isFile()) {
          return; // 跳过该目录
        }
        if(option.debugPrint) {
          console.log("Scan Dir: ", filePath);
        }
        // 递归调用时传入选项和下一级层级
        const nextPath = currentPath ? `${currentPath}/${dirName}` : dirName;
        const childNavItems = scanDirectory(option, filePath, currentLevel + 1, nextPath);
        const displayName = dirName.replace(/^\d+-/, '');
        if (childNavItems.length > 0) {
          const navItem: DefaultTheme.NavItem = {
            text: displayName,
            items: childNavItems as unknown as (DefaultTheme.NavItemComponent | DefaultTheme.NavItemWithLink | DefaultTheme.NavItemChildren)[]
          };
          navItems.push(navItem);
        } else {
          const basePath = option.path ? `/${option.path}` : '';
          const fullPath = currentPath ? `${basePath}/${currentPath}/${dirName}/` : `${basePath}/${dirName}/`;
          
          const navItem: DefaultTheme.NavItem = {
            text: displayName,
            link: fullPath
          };
          navItems.push(navItem);
        }
      } else {
        return;
      }
    });
  }

  return navItems;
}

// 获取默认导航数据
function createTestSidebarData(): DefaultTheme.NavItem[] {
  const navDataArray: DefaultTheme.NavItem[] = [];

  // 默认导航数据
  navDataArray.push({ text: 'Guide', link: '/guide' });
  navDataArray.push(
    {
      text: 'Dropdown Menu',
      items: [
        { text: 'Item A', link: '/item-1' },
        { text: 'Item B', link: '/item-2' },
        { text: 'Item C', link: '/item-3' }
      ]
    }
  );
  navDataArray.push(
    {
      text: 'Dropdown Menu',
      items: [
        {
          // 该部分的标题
          text: 'Section A Title',
          items: [
            { text: 'Section A Item A', link: '...' },
            { text: 'Section B Item B', link: '...' }
          ]
        }
      ]
    },
  );

  return navDataArray;
}

export default (option: NavOption, baseDir: string, srcDir: string) => {
  //  export type NavItem = NavItemComponent | NavItemWithLink | NavItemWithChildren
  const navDataArray: DefaultTheme.NavItem[] = [];

  try {
    // 检查 baseDir 路径是否存在
    const stats = statSync(baseDir);
    if (stats.isDirectory()) {
      // 扫描目录并生成导航数据
      const sdocNavItems = scanDirectory(option, baseDir);
      navDataArray.push(...sdocNavItems);
    } else {
      // 使用默认导航数据
      navDataArray.push(...createTestSidebarData());
    }
  } catch (error) {
    // 如果路径不存在或无法访问，则使用默认导航数据
    navDataArray.push(...createTestSidebarData());
  }

  // 如果 debugPrint 为 true，则打印导航数据到控制台
  if (option.debugPrint) {
    console.log("Navigation Data:", JSON.stringify(navDataArray, null, 4));
  }

  // 如果 saveToFile 为 true，则将数据保存到文件中
  if (option.saveToFile) {
    const cacheDir = resolve(srcDir, ".vitepress", "cache");
    // 确保缓存目录存在
    if (!existsSync(cacheDir)) {
      mkdirSync(cacheDir, { recursive: true });
    }
    const filePath = resolve(cacheDir, "navigation-data.json");
    writeFileSync(filePath, JSON.stringify(navDataArray, null, 2));
  }

  return navDataArray;
};
