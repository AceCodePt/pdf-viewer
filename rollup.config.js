import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "pdf-viewer.ts", // Update input path
  output: [
    {
      file: "dist/pdf-viewer.bundle.js",
      format: "es",
    },
    {
      file: "dist/pdf-viewer.bundle.min.js",
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
