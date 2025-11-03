import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/mcp.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "esnext",
  clean: true,
  sourcemap: false, // 禁用sourcemap以防止逆向工程
  minify: true, // 启用代码压缩
  minifyIdentifiers: true, // 混淆变量名
  minifySyntax: true, // 简化语法结构
  minifyWhitespace: true, // 删除空白字符
  dts: false,
  splitting: false,
  treeshake: true,
});
