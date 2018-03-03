/* @flow */

import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import last from "../utils/last";

export function htmlWebpackPlugin(template: string | false) {
  return new HtmlWebpackPlugin({
    title: last(process.cwd().split(path.sep)),
    template: template ? template : require.resolve("../../template/index.ejs")
  });
}

/**
 * Plugins for production build.
 */
export function pluginsProd(template: string | false): Array<any> {
  return [
    new webpack.DefinePlugin({ "process.env.NODE_ENV": '"production"' }),
    htmlWebpackPlugin(template),
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
    htmlWebpackPlugin(template)
  ];
}

/**
 * Setups plugins section for webpack config.
 */
export default function plugins({ isProd, template }: AikParams): Array<any> {
  return isProd ? pluginsProd(template.path) : pluginsDev(template.path);
}
