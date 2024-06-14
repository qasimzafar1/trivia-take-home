import swc from "@rollup/plugin-swc";
import json from "@rollup/plugin-json";
import pluginNodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import run from "@rollup/plugin-run";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";

const NODE_ENV = process.env.NODE_ENV || "production";

/**
 * @type {import('rollup').Plugin[]}
 */
const plugins = [
  json(),
  pluginNodeResolve({
    preferBuiltins: true,
    exportConditions: ["node"],
    resolveOnly: [""],
  }),
  // Using swc instead of esbuild due to esbuild not supporting experimental
  // decorators features, see https://github.com/evanw/esbuild/issues/104.
  swc({
    swc: {
      sourceMaps: true,
    },
  }),
  commonjs({ include: "node_modules/**" }),
  replace({
    preventAssignment: true,
    "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
  }),
];

const warnFilter =
  /contains an annotation that Rollup cannot interpret due to the position of the comment./;

function onWarn(warning, next) {
  const str = warning.toString();

  if (warnFilter.test(str)) return;
  next(warning);
}

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "./src/server.ts",
  watch: {
    include: ["src/**", ".env"],
  },
  output: {
    dir: "dist",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    ...plugins,
    run({
      allowRestarts: true,
    }),
  ],
  onwarn: onWarn,
};

export default config;
