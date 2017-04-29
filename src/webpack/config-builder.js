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
export default function webpackConfigBuilder(
  filename: string,
  flags: CLIFlags,
  params: AikParams
): WebPackConfig {
  return {
    entry: entry(filename, flags, params),
    output: output(filename, flags, params),
    devtool: !params.isProd && "cheap-module-source-map",
    plugins: plugins(params),
    bail: params.isProd,
    module: { rules: rules(flags, params) },
    resolve: {
      alias: aliases(filename, flags),
      extensions: [".js", ".jsx", ".json"],
      modules: [
        path.dirname(path.resolve(process.cwd(), filename)),
        "web_modules",
        "node_modules"
      ]
    }
  };
}
