#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

// 定义路径常量
const PROJECT_ROOT = path.resolve(__dirname, '../../');
const PLUGINS_DIR = path.join(PROJECT_ROOT, 'plugins');
const PNPM_WORKSPACE_FILE = path.join(PROJECT_ROOT, 'pnpm-workspace.yaml');
const PACKAGE_RELEASE_FILE = path.join(PROJECT_ROOT, 'packages/mist/package-release.json');

// 获取所有插件包信息
async function getAllPluginPackages() {
  const pluginPackages = [];
  
  try {
    const pluginDirs = await fs.readdir(PLUGINS_DIR);
    for (const pluginDir of pluginDirs) {
      const pkgPath = path.join(PLUGINS_DIR, pluginDir, 'package.json');
      try {
        const pkgContent = await fs.readFile(pkgPath, 'utf-8');
        const pkg = JSON.parse(pkgContent);
        
        pluginPackages.push({
          name: pkg.name,
          version: pkg.version,
          dir: pluginDir
        });
      } catch (error) {
        // 忽略不是包的目录
      }
    }
  } catch (error) {
    console.warn('Could not read plugins directory:', error.message);
  }
  
  return pluginPackages;
}

// 更新 pnpm-workspace.yaml 中的版本
async function updatePnpmWorkspaceVersions(pluginPackages) {
  try {
    let content = await fs.readFile(PNPM_WORKSPACE_FILE, 'utf-8');
    let updated = false;
    
    for (const pkg of pluginPackages) {
      // 在 catalogs 部分查找当前版本
      const versionRegex = new RegExp(`('${pkg.name.replace(/\//g, '/')}':\\s*\\^?)([0-9.]+)`, 'g');
      let match;
      const matches = [];
      while ((match = versionRegex.exec(content)) !== null) {
        matches.push({
          oldVersion: match[2],
          newVersion: pkg.version,
          index: match.index
        });
      }
      
      // 打印版本变化信息
      for (const m of matches) {
        if (m.oldVersion !== m.newVersion) {
          console.log(`pnpm-workspace.yaml: ${pkg.name} ${m.oldVersion} --> ${m.newVersion}`);
        }
      }
      
      // 执行替换
      const regex = new RegExp(`('${pkg.name.replace(/\//g, '/')}':\\s*\\^?)[0-9.]+`, 'g');
      const newContent = content.replace(regex, `$1${pkg.version}`);
      
      if (newContent !== content) {
        content = newContent;
        updated = true;
      }
    }
    
    if (updated) {
      await fs.writeFile(PNPM_WORKSPACE_FILE, content, 'utf-8');
      console.log('Successfully updated versions in pnpm-workspace.yaml');
    } else {
      console.log('No version updates needed in pnpm-workspace.yaml');
    }
  } catch (error) {
    console.error('Error updating pnpm-workspace.yaml:', error);
  }
}

// 更新 package-release.json 中的版本
async function updatePackageReleaseVersions(pluginPackages) {
  try {
    const content = await fs.readFile(PACKAGE_RELEASE_FILE, 'utf-8');
    const pkg = JSON.parse(content);
    let updated = false;
    
    // 只更新 dependencies 中的插件版本
    for (const pluginPkg of pluginPackages) {
      if (pkg.dependencies && pkg.dependencies[pluginPkg.name]) {
        const oldVersion = pkg.dependencies[pluginPkg.name];
        const newVersion = `^${pluginPkg.version}`;
        
        if (oldVersion !== newVersion) {
          pkg.dependencies[pluginPkg.name] = newVersion;
          updated = true;
          console.log(`package-release.json: ${pluginPkg.name} ${oldVersion} --> ${newVersion}`);
        }
      }
    }
    
    if (updated) {
      await fs.writeFile(PACKAGE_RELEASE_FILE, JSON.stringify(pkg, null, 2), 'utf-8');
      console.log('Successfully updated versions in package-release.json');
    } else {
      console.log('No version updates needed in package-release.json');
    }
  } catch (error) {
    console.error('Error updating package-release.json:', error);
  }
}

// 主函数
async function main() {
  console.log('Running additional version updates after changesets version...');
  
  // 获取所有插件包信息
  const pluginPackages = await getAllPluginPackages();
  
  if (pluginPackages.length === 0) {
    console.log('No plugin packages found, skipping additional updates.');
    return;
  }
  
  console.log(`Found ${pluginPackages.length} plugin packages:`);
  pluginPackages.forEach(pkg => {
    console.log(`  - ${pkg.name}@${pkg.version}`);
  });
  
  console.log('\nChecking for version updates:');
  
  // 更新额外文件中的版本
  await updatePnpmWorkspaceVersions(pluginPackages);
  await updatePackageReleaseVersions(pluginPackages);
  
  console.log('\nAll additional version updates completed successfully!');
}

main().catch(error => {
  console.error('Error in additional version updates:', error);
  process.exit(1);
});
