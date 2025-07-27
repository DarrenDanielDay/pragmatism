import pluginTerser from "rollup-plugin-terser";
import pluginReplace from "@rollup/plugin-replace";
/** @type {import('rollup').RollupOptions} */
const config = {
  input: {
    "core.browser.esm.min": "./dist/core/index.js",
    "web.browser.esm.min": "./dist/core/index.js",
    "index.browser.esm.min": "./dist/index.browser.js",
  },
  external: [],
  plugins: [
    pluginReplace({
      preventAssignment: true,
      "process.env.NODE_ENV": "'production'",
    }),
  ],
  output: {
    format: "esm",
    dir: "dist",
    plugins: [pluginTerser.terser()],
  },
};
export default config;
