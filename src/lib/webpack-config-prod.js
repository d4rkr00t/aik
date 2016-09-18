import path from 'path';
import last from 'lodash/last';
import isString from 'lodash/isString';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import NpmInstallPlugin from 'npm-install-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import autoprefixer from 'autoprefixer';
import precss from 'precss';
import postcssImport from 'postcss-import';

import { resolveToCwd, getTemplatePath, isTemplateExists } from './webpack-config-common';

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
 * @param {String} [base]
 *
 * @return {Object}
 */
export function setupOutput(filename, dist, base) {
  const publicPath = base.endsWith('/') ? base : base + '/';

  return {
    path: resolveToCwd(dist),
    filename: `${path.basename(filename, '.js')}.[hash:8].js`,
    hash: true,
    publicPath
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
  return [
    new HtmlWebpackPlugin({
      title: last(process.cwd().split(path.sep)),
      template: template ? template : require.resolve('../template/index.ejs')
    }),
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
    require.resolve('babel-loader'),
    `?presets[]=${require.resolve('babel-preset-react')}`,
    `,presets[]=${require.resolve('babel-preset-es2015')}`
  ];
  const jsLoaders = [babelLoader.join('')];
  const cssLoaders = [
    require.resolve('css-loader') + (cssmodules ? '?modules&importLoaders=1' : ''),
    require.resolve('postcss-loader')
  ];

  return [
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract(
        require.resolve('style-loader'),
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
      loader: require.resolve('file-loader'),
      query: {
        name: '[name].[hash:8].[ext]'
      }
    },
    {
      test: /\.json$/,
      loader: require.resolve('json-loader')
    },
    {
      test: /\.(mp4|webm)$/,
      loader: require.resolve('url'),
      query: { limit: 1000 }
    },
    {
      test: /\.html$/,
      loader: require.resolve('html-loader')
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
    output: setupOutput(filename, dist, isString(flags.base) ? flags.base : ''),
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
