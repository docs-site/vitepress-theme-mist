export const vitePluginsConfig = {
  enabled: true,
  docAnalysis: true,
  fileContentLoaderIgnore: [],
  demoOption: {
    str: "mist",
  },
  navSidebarOption: {
    path: "sdoc",
    debugInfo: false,
    navOption: {
      maxLevel: 2,
      debugPrint: false,
      saveToFile: false
    },
    sideBarOption: {
      type: "object",
      ignoreList: ["index.md", "README.md"],
      initItems: false, // 这个设置为true的话进入某个导航栏路径时可能不显示侧边栏
      collapsed: true,
      debugPrint: false,
      saveToFile: false,
    }
  }
};
