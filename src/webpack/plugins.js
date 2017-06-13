/* @flow */

import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import NpmInstallPlugin from "npm-install-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import last from "../utils/last";

export function htmlWebpackPlugin(template: string | false) {
  return new HtmlWebpackPlugin({
    title: last(process.cwd().split(path.sep)),
    template: template ? template : require.resolve("../../template/index.ejs")
  });
}

export function npmInstallPlugin(options?: Object = {}) {
  return new NpmInstallPlugin(
    Object.assign({ dev: true, peerDependencies: true }, options)
  );
}

/**
 * Plugins for production build.
 */
export function pluginsProd(template: string | false): Array<any> {
  return [
    new webpack.DefinePlugin({ "process.env.NODE_ENV": '"production"' }),
    htmlWebpackPlugin(template),
    npmInstallPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    new ExtractTextPlugin("[name].[contenthash:8].css")
  ];
}

/**
 * Plugins for dev server.
 */
export function pluginsDev(template: string | false): Array<any> {
  return [
    new webpack.LoaderOptionsPlugin({ debug: true }),
    new webpack.DefinePlugin({ "process.env.NODE_ENV": '"development"' }),
    new webpack.HotModuleReplacementPlugin(),
    htmlWebpackPlugin(template),
    npmInstallPlugin({
      quiet: true
    })
  ];
}

/**
 * Setups plugins section for webpack config.
 */
export default function plugins(params: AikParams): Array<any> {
  return params.isProd
    ? pluginsProd(params.template.path)
    : pluginsDev(params.template.path);
}
