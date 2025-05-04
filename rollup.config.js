import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "pdf-viewer.mts",
  output: [
    {
      file: "dist/pdf-viewer.bundle.cjs",
      format: "iife",
    },
    {
      file: "dist/pdf-viewer.bundle.min.cjs",
      format: "iife",
      plugins: [terser()],
    },
    {
      file: "dist/pdf-viewer.bundle.mjs",
      format: "es",
    },
    {
      file: "dist/pdf-viewer.bundle.min.mjs",
      format: "es",
      plugins: [terser()],
    },
  ],
  plugins: [
    typescript(), // Use the TypeScript plugin
    nodeResolve(),
  ],
  external: ["pdfjs-dist"],
};
