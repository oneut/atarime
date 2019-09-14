import babel from "rollup-plugin-babel";
import filesize from "rollup-plugin-filesize";

const resolve = require("rollup-plugin-node-resolve");
const typescript = require("rollup-plugin-typescript2");

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "cjs",
    name: "atarime",
    sourcemap: true
  },
  external: ["history", "path-to-regexp", "react", "rxjs", "rxjs/operators"],
  plugins: [
    resolve(),
    babel(),
    filesize(),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          module: "es2015",
          moduleResolution: "node",
        }
      }
    })
  ]
};
