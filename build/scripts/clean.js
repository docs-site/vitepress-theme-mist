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

// 清理操作配置
const CLEAN_OPERATIONS = {
  dist: {
    name: '仅清理dist和cache目录',
    tasks: [
      { type: 'dir', name: 'dist', description: 'dist 目录' },
      { type: 'vitepress-subdir', parent: '.vitepress', name: 'dist', description: '.vitepress/dist 目录' },
      { type: 'vitepress-subdir', parent: '.vitepress', name: 'cache', description: '.vitepress/cache 目录' }
    ]
  },
  all: {
    name: '清理所有目录 (dist、cache、node_modules)',
    tasks: [
      { type: 'dir', name: 'dist', description: 'dist 目录' },
      { type: 'vitepress-subdir', parent: '.vitepress', name: 'dist', description: '.vitepress/dist 目录' },
      { type: 'vitepress-subdir', parent: '.vitepress', name: 'cache', description: '.vitepress/cache 目录' },
      { type: 'dir', name: 'node_modules', description: 'node_modules 目录' }
    ]
  }
};

// 执行清理任务
async function performCleanTask(projectRoot, task, dirsToRemove) {
  console.log(`🔍 搜索 ${task.description}...`);
  
  try {
    let foundDirs = [];
    
    if (task.type === 'dir') {
      foundDirs = findDirs(projectRoot, task.name);
    } else if (task.type === 'vitepress-subdir') {
      const parentDirs = findDirs(projectRoot, task.parent);
      for (const parentDir of parentDirs) {
        const targetDir = path.join(parentDir, task.name);
        if (dirExists(targetDir)) {
          foundDirs.push(targetDir);
        }
      }
    }
    
    console.log(`  找到 ${foundDirs.length} 个 ${task.description}`);
    foundDirs.forEach(dir => {
      dirsToRemove.add(dir);
      console.log(`  📁 ${dir}`);
    });
  } catch (error) {
    console.error(`  搜索 ${task.description} 失败:`, error.message);
  }
}

// 主函数
async function main() {
  // 获取命令行参数
  const args = process.argv.slice(2);
  const cleanMode = args[0] || 'dist'; // 默认清理dist相关目录
  
  console.log(`🔍 开始清理项目 (模式: ${cleanMode})...`);
  
  // 获取当前工作目录
  const cwd = process.cwd();
  console.log(`📂 当前工作目录: ${cwd}`);
  
  // 查找项目根目录
  const projectRoot = findProjectRoot(cwd);
  console.log(`🏠 项目根目录: ${projectRoot}`);
  
  // 存储找到的所有目录
  const dirsToRemove = new Set();
  
  // 检查清理模式是否有效
  if (!CLEAN_OPERATIONS[cleanMode]) {
    console.error(`❌ 未知的清理模式: ${cleanMode}`);
    console.log('支持的清理模式:');
    Object.keys(CLEAN_OPERATIONS).forEach(mode => {
      console.log(`  ${mode}  - ${CLEAN_OPERATIONS[mode].name}`);
    });
    process.exit(1);
  }
  
  const operation = CLEAN_OPERATIONS[cleanMode];
  console.log(`📋 清理模式: ${operation.name}`);
  
  // 执行所有清理任务
  for (const task of operation.tasks) {
    await performCleanTask(projectRoot, task, dirsToRemove);
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
