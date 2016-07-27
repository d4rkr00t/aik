import path from 'path';
import last from 'lodash/last';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import NpmInstallPlugin from 'npm-install-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import autoprefixer from 'autoprefixer';
import precss from 'precss';
import postcssImport from 'postcss-import';

/**
 * Makes absolute path to node_modules for webpack plugins and loaders.
 *
 * @param {String} relativePath
 *
 * @return {String}
 */
export function makeAbsolutePathToNodeModules(relativePath) {
  return path.join(__dirname, '..', 'node_modules', relativePath);
}

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
      path.join(process.cwd(), filename)
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
    path: path.join(process.cwd(), dist, path.dirname(filename)),
    filename: '[name].[hash:8].js',
    hash: true,
    publicPath: '/'
  };
}

/**
 * Setups plugins section for webpack config.
 *
 * @return {Array}
 */
export function setupPlugins() {
  return [
    new HtmlWebpackPlugin({
      title: last(process.cwd().split(path.sep))
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
    makeAbsolutePathToNodeModules('babel-loader'),
    `?presets[]=${makeAbsolutePathToNodeModules('babel-preset-react')}`,
    `,presets[]=${makeAbsolutePathToNodeModules('babel-preset-es2015')}`
  ];
  const jsLoaders = [babelLoader.join('')];
  const cssLoaders = [
    makeAbsolutePathToNodeModules('css-loader') + (cssmodules ? '?modules&importLoaders=1' : ''),
    makeAbsolutePathToNodeModules('postcss-loader')
  ];

  return [
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract(
        makeAbsolutePathToNodeModules('style-loader'),
        cssLoaders.join('!')
      )
    },
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loaders: jsLoaders
    },
    {
      test: /\.json$/,
      loader: makeAbsolutePathToNodeModules('json-loader')
    },
    {
      test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
      loader: makeAbsolutePathToNodeModules('file-loader'),
      query: {
        name: '[name].[hash:8].[ext]'
      }
    },
    {
      test: /\.(mp4|webm)$/,
      loader: `${makeAbsolutePathToNodeModules('url')}?limit=10000`
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
  return {
    entry: setupEntry(filename),
    output: setupOutput(filename, dist),
    debug: false,
    bail: true,
    devtool: 'source-map',
    plugins: setupPlugins(),
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
