/** @type {import('@babel/core').TransformOptions} */
export default {
  presets: ["@babel/preset-typescript"],
  sourceMaps: false,
  targets: {
    esmodules: true,
    node: "current",
  },
};
