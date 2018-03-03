/* @flow */

import path from "path";
import aliases from "./aliases";
import entry from "./entry";
import output from "./output";
import plugins from "./plugins";
import { rules } from "./rules";

/**
 * Generates config for webpack.
 */
export default function webpackConfigBuilder(params: AikParams): WebPackConfig {
  return {
    entry: entry(params),
    output: output(params),
    mode: params.isProd ? "production" : "development",
    devtool: !params.isProd && "cheap-module-source-map",
    plugins: plugins(params),
    bail: params.isProd,
    module: { rules: rules(params) },
    resolve: {
      alias: aliases(params),
      extensions: [".wasm", ".mjs", ".js", ".jsx", ".json"],
      modules: [path.dirname(path.resolve(process.cwd(), params.filename)), "web_modules", "node_modules"]
    }
  };
}
