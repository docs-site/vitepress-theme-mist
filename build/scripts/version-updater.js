// version-updater.js - 自定义的 standard-version updater
// 用于处理 packages/mist/version.ts 文件的版本更新

module.exports.readVersion = function (contents) {
  // 从 export const version = "1.0.7"; 中提取版本号
  const match = contents.match(/export const version = "([^"]+)";/);
  return match ? match[1] : null;
};

module.exports.writeVersion = function (contents, version) {
  // 更新版本号，保持原有格式
  return contents.replace(/export const version = "[^"]+";/, `export const version = "${version}";`);
};
