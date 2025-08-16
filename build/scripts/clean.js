#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 删除目录的异步函数
async function removeDir(dirPath) {
  try {
    await fs.promises.rm(dirPath, { recursive: true, force: true });
    console.log(`✅ 已删除: ${dirPath}`);
  } catch (error) {
    console.error(`❌ 删除失败 ${dirPath}:`, error.message);
  }
}

// 检查目录是否存在
function dirExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
}

// 递归查找目录
function findDirs(rootDir, targetDirName) {
  const results = [];
  
  function walk(dir) {
    try {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        
        // 检查是否是目录
        if (dirExists(filePath)) {
          // 如果目录名匹配目标名称，则添加到结果中
          if (file === targetDirName) {
            results.push(filePath);
          }
          
          // 递归搜索（但跳过node_modules以提高性能）
          if (file !== 'node_modules') {
            walk(filePath);
          }
        }
      }
    } catch (error) {
      // 忽略无法访问的目录
    }
  }
  
  walk(rootDir);
  return results;
}

// 查找项目根目录
function findProjectRoot(startDir) {
  // 获取当前脚本所在的目录
  const scriptDir = __dirname;
  
  // 计算项目根目录（假设脚本在 build/scripts 下）
  // 我们需要向上两级：scripts -> build -> project_root
  const projectRoot = path.resolve(scriptDir, '../..');
  
  // 验证项目根目录是否存在 package.json
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      // 验证是否是正确的项目根目录
      if (packageJson.private === true) {
        return projectRoot;
      }
    } catch (error) {
      // 解析失败，使用原来的搜索方法
    }
  }
  
  // 如果上面的方法失败，回退到原来的搜索方法
  let currentDir = startDir;
  
  // 向上搜索直到找到package.json或到达根目录
  while (currentDir !== path.dirname(currentDir)) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      // 检查是否是项目根目录的package.json
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (packageJson.name === "vitepress-theme-mist" || packageJson.private === true) {
          return currentDir;
        }
      } catch (error) {
        // 解析失败，继续向上搜索
      }
    }
    currentDir = path.dirname(currentDir);
  }
  
  // 如果没找到，返回起始目录
  return startDir;
}

// 主函数
async function main() {
  console.log('🔍 开始清理项目...');
  
  // 获取当前工作目录
  const cwd = process.cwd();
  console.log(`📂 当前工作目录: ${cwd}`);
  
  // 查找项目根目录
  const projectRoot = findProjectRoot(cwd);
  console.log(`🏠 项目根目录: ${projectRoot}`);
  
  // 存储找到的所有目录
  const dirsToRemove = new Set();
  
  // 查找node_modules目录,这个目录暂不清理
  // console.log('🔍 搜索 node_modules 目录...');
  // const nodeModulesDirs = findDirs(projectRoot, 'node_modules');
  // console.log(`  找到 ${nodeModulesDirs.length} 个 node_modules 目录`);
  // nodeModulesDirs.forEach(dir => {
  //   dirsToRemove.add(dir);
  //   console.log(`  📁 ${dir}`);
  // });
  
  // 查找dist目录
  console.log('🔍 搜索 dist 目录...');
  const distDirs = findDirs(projectRoot, 'dist');
  console.log(`  找到 ${distDirs.length} 个 dist 目录`);
  distDirs.forEach(dir => {
    dirsToRemove.add(dir);
    console.log(`  📁 ${dir}`);
  });
  
  // 查找.vitepress/dist目录
  console.log('🔍 搜索 .vitepress/dist 目录...');
  try {
    const vitepressDirs = findDirs(projectRoot, '.vitepress');
    const vitepressDistDirs = [];
    
    for (const vpDir of vitepressDirs) {
      const distDir = path.join(vpDir, 'dist');
      if (dirExists(distDir)) {
        vitepressDistDirs.push(distDir);
      }
    }
    
    console.log(`  找到 ${vitepressDistDirs.length} 个 .vitepress/dist 目录`);
    vitepressDistDirs.forEach(dir => {
      dirsToRemove.add(dir);
      console.log(`  📁 ${dir}`);
    });
  } catch (error) {
    console.error('  搜索 .vitepress/dist 失败:', error.message);
  }
  
  // 查找.vitepress/cache目录
  console.log('🔍 搜索 .vitepress/cache 目录...');
  try {
    const vitepressDirs = findDirs(projectRoot, '.vitepress');
    const vitepressCacheDirs = [];
    
    for (const vpDir of vitepressDirs) {
      const cacheDir = path.join(vpDir, 'cache');
      if (dirExists(cacheDir)) {
        vitepressCacheDirs.push(cacheDir);
      }
    }
    
    console.log(`  找到 ${vitepressCacheDirs.length} 个 .vitepress/cache 目录`);
    vitepressCacheDirs.forEach(dir => {
      dirsToRemove.add(dir);
      console.log(`  📁 ${dir}`);
    });
  } catch (error) {
    console.error('  搜索 .vitepress/cache 失败:', error.message);
  }
  
  // 删除所有找到的目录
  if (dirsToRemove.size > 0) {
    console.log(`\n🗑️  总共找到 ${dirsToRemove.size} 个目录需要删除:`);
    for (const dir of dirsToRemove) {
      console.log(`  - ${dir}`);
    }
    
    console.log('\n🔄 开始删除...');
    for (const dir of dirsToRemove) {
      await removeDir(dir);
    }
    console.log('\n🎉 清理完成!');
  } else {
    console.log('\n✅ 没有找到需要删除的目录');
  }
}

// 执行主函数
main().catch(error => {
  console.error('❌ 脚本执行出错:', error);
  process.exit(1);
});
