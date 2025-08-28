import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index"],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    output: {
      exports: "named",
    },
    esbuild: {
      minify: true,
    },
  },
  externals: ["vitepress", "vite"],
  // 钩子函数
  hooks: {
    "build:done": ctx => {
      const pkg = require("./package.json");
      console.log(`✅ Build completed successfully! Package: ${pkg.name}@${pkg.version}`);
    },
  },
});
