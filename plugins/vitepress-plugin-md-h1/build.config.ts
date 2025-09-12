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
  },
  externals: ["vite"],
  // 钩子函数
  hooks: {
    "build:done": async () => {
      const { name, version } = await import("./package.json");
      console.log(`✅ Build completed successfully! Package: ${name}@${version}`);
    },
  },
});
