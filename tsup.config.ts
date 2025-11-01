import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/mcp.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "esnext",
  clean: true,
  sourcemap: true,
  dts: false,
  splitting: false,
});