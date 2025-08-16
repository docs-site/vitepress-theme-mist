import tasks from "./tasks";
import { copyFile, readFile, writeFile } from "fs/promises";
import { copy } from "fs-extra";
import { resolve } from "path";
import { mtPackage, mtOutput, projectRoot, buildOutput, mtRoot } from "./helper";
import picocolors from "picocolors";

/**
 * @brief 复制 .d.ts 文件到指定目录
 * @returns {Promise<void>}
 * @details 该函数会将类型定义文件从构建输出目录复制到 es 和 lib 目录中
 */
const copyTypesDefinitions = async () => {
  const typesDirSrc = resolve(buildOutput, "types");

  // 复制 .d.ts 到 es
  await copy(typesDirSrc, resolve(mtOutput, "es"));

  // 复制 .d.ts 到 lib
  await copy(typesDirSrc, resolve(mtOutput, "lib"));
};

/**
 * @brief 复制指定的项目文件到打包目录下
 * @returns {Promise<Array<void>>}
 * @details 该函数会将 package.json 和 README.md 文件复制到打包输出目录中
 */
const copyFiles = () =>
  Promise.all([
    copyFile(mtPackage, resolve(mtOutput, "package.json")),
    copyFile(resolve(projectRoot, "README.md"), resolve(mtOutput, "README.md")),
  ]);

/**
 * @brief 在 package.json 更新版本号
 * @returns {Promise<void>}
 * @details 该函数会读取项目根目录的 package.json 文件中的版本号，
 *          并更新打包输出目录中的 package.json 文件版本号
 */
const updateVersionInPackage = async () => {
  const mtOutputPkg = resolve(mtOutput, "package.json");
  const mtOutputPkgContent = await readFile(mtOutputPkg, "utf-8");
  const mtPackageContent = await readFile(resolve(projectRoot, "package.json"), "utf-8");
  const mtOutputPkgInfo = JSON.parse(mtOutputPkgContent);
  const mtPackageInfo = JSON.parse(mtPackageContent);
  mtOutputPkgInfo.version = mtPackageInfo.version;

  await writeFile(mtOutputPkg, JSON.stringify(mtOutputPkgInfo, null, 2) + "\n");
};

/**
 * @brief 在 version.ts 文件更新版本号
 * @returns {Promise<void>}
 * @details 该函数会读取项目根目录的 package.json 文件中的版本号，
 *          并更新 packages/mist/version.ts 文件中的版本号
 */
const updateVersionInTs = async () => {
  const mtPackageContent = await readFile(resolve(projectRoot, "package.json"), "utf-8");
  const mtPackageInfo = JSON.parse(mtPackageContent);

  const versionFile = resolve(mtRoot, "version.ts");
  const versionContent = await readFile(versionFile, "utf-8");
  const newVersion = versionContent.replace(/"([^"]+)"/, `"${mtPackageInfo.version}"`);

  await writeFile(versionFile, newVersion);
};

updateVersionInTs().then(() => {
  console.log(picocolors.green("Successfully updated version"));

  Promise.all(tasks).then(async () => {
    await copyTypesDefinitions();
    console.log(picocolors.green("Successfully copied definition file"));

    await copyFiles();
    console.log(picocolors.green("Successfully copied package.json and README.md"));

    await updateVersionInPackage();
    console.log(picocolors.green("Successfully updated package version"));
  });
});
