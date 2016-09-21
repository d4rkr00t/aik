import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import NpmInstallPlugin from 'npm-install-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import last from '../../utils/last';

export function htmlWebpackPlugin(template) {
  return new HtmlWebpackPlugin({
    title: last(process.cwd().split(path.sep)),
    template: template ? template : require.resolve('../../../template/index.ejs')
  });
}

export function npmInstallPlugin() {
  return new NpmInstallPlugin({
    dev: true,
    peerDependencies: true
  });
}

/**
 * Plugins for production build.
 *
 * @param {String} template
 *
 * @return {Array}
 */
export function pluginsProd(template) {
  return [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
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
    new ExtractTextPlugin('[name].[contenthash:8].css')
  ];
}

/**
 * Plugins for dev server.
 *
 * @param {String} template
 *
 * @return {Array}
 */
export function pluginsDev(template) {
  return [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"' }),
    new webpack.HotModuleReplacementPlugin(),
    htmlWebpackPlugin(template),
    npmInstallPlugin()
  ];
}

/**
 * Setups plugins section for webpack config.
 *
 * @param {String} filename
 * @param {Object} flags
 * @param {Boolean} isProd
 * @param {String} [template]
 *
 * @return {Object}
 */
export default function plugins(filename, flags, isProd, template) {
  return isProd
    ? pluginsProd(template)
    : pluginsDev(template);
}
