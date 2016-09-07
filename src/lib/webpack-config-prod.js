import path from 'path';
import last from 'lodash/last';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import NpmInstallPlugin from 'npm-install-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import autoprefixer from 'autoprefixer';
import precss from 'precss';
import postcssImport from 'postcss-import';

import { resolveToOwnNodeModules, resolveToCwd, getTemplatePath, isTemplateExists } from './webpack-config-common';

/**
 * Setups entry part of webpack config.
 *
 * @param {String} filename
 *
 * @return {Object}
 */
export function setupEntry(filename) {
  return {
    app: [
      resolveToCwd(filename)
    ]
  };
}

/**
 * Setups output section of webpack config.
 *
 * @param {String} filename
 * @param {String} dist
 *
 * @return {Object}
 */
export function setupOutput(filename, dist) {
  return {
    path: resolveToCwd(dist),
    filename: `${path.basename(filename, '.js')}.[hash:8].js`,
    hash: true,
    publicPath: '/'
  };
}

/**
 * Setups plugins section for webpack config.
 *
 * @param {String} template file name
 *
 * @return {Array}
 */
export function setupPlugins(template) {
  const htmlPluginOptions = {
    title: last(process.cwd().split(path.sep))
  };

  if (template) {
    htmlPluginOptions.template = template;
  }

  return [
    new HtmlWebpackPlugin(htmlPluginOptions),
    new NpmInstallPlugin({
      save: false,
      saveDev: false,
      saveExact: false
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
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
 * Setups loaders for webpack.
 *
 * @param {Boolean} cssmodules
 *
 * @return {Object[]}
 */
export function setupLoaders(cssmodules) {
  const babelLoader = [
    resolveToOwnNodeModules('babel-loader'),
    `?presets[]=${resolveToOwnNodeModules('babel-preset-react')}`,
    `,presets[]=${resolveToOwnNodeModules('babel-preset-es2015')}`
  ];
  const jsLoaders = [babelLoader.join('')];
  const cssLoaders = [
    resolveToOwnNodeModules('css-loader') + (cssmodules ? '?modules&importLoaders=1' : ''),
    resolveToOwnNodeModules('postcss-loader')
  ];

  return [
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract(
        resolveToOwnNodeModules('style-loader'),
        cssLoaders.join('!')
      )
    },
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loaders: jsLoaders
    },
    {
      test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
      loader: resolveToOwnNodeModules('file-loader'),
      query: {
        name: '[name].[hash:8].[ext]'
      }
    },
    {
      test: /\.json$/,
      loader: resolveToOwnNodeModules('json-loader')
    },
    {
      test: /\.(mp4|webm)$/,
      loader: `${resolveToOwnNodeModules('url')}?limit=10000`
    },
    {
      test: /\.html$/,
      loader: resolveToOwnNodeModules('html-loader')
    }
  ];
}

/**
 * Generates config for webpack.
 *
 * @param {String} filename
 * @param {Flags} flags
 * @param {String} dist
 *
 * @return {Object}
 */
export default function webpackConfigBuilder(filename, flags, dist) {
  const template = getTemplatePath(filename);

  return {
    entry: setupEntry(filename),
    output: setupOutput(filename, dist),
    debug: false,
    bail: true,
    devtool: 'source-map',
    plugins: setupPlugins(isTemplateExists(template) && template),
    module: {
      loaders: setupLoaders(flags.cssmodules)
    },
    postcss: function (wp) {
      return [
        postcssImport({ addDependencyTo: wp }),
        autoprefixer(),
        precss()
      ];
    }
  };
}
