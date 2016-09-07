import path from 'path';
import last from 'lodash/last';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import NpmInstallPlugin from 'npm-install-webpack-plugin';

import autoprefixer from 'autoprefixer';
import precss from 'precss';
import postcssImport from 'postcss-import';

import { resolveToOwnNodeModules, resolveToCwd, getTemplatePath, isTemplateExists } from './webpack-config-common';

/**
 * Setups entry part of webpack config.
 *
 * @param {String} filename
 * @param {String} host
 * @param {String} port
 *
 * @return {Object}
 */
export function setupEntry(filename, host, port) {
  host = host === '::' ? 'localhost' : host;

  return {
    app: [
      `${resolveToOwnNodeModules('webpack-dev-server/client')}?http://${host}:${port}/`,
      resolveToOwnNodeModules('webpack/hot/dev-server'),
      resolveToCwd(filename)
    ]
  };
}

/**
 * Setups output section of webpack config.
 *
 * @param {String} filename
 *
 * @return {Object}
 */
export function setupOutput(filename) {
  return {
    path: path.join(process.cwd(), path.dirname(filename)),
    filename: path.basename(filename),
    hash: true
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
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin(htmlPluginOptions),
    new NpmInstallPlugin({
      dev: true,
      peerDependencies: true
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"' })
  ];
}

/**
 * Setups loaders for webpack.
 *
 * @param {Boolean} cssmodules
 * @param {Boolean} react
 *
 * @return {Object[]}
 */
export function setupLoaders(cssmodules, react) {
  const jsLoaders = [
    `${resolveToOwnNodeModules('babel-loader')}?presets[]=${resolveToOwnNodeModules('babel-preset-react')},presets[]=${resolveToOwnNodeModules('babel-preset-es2015')}&cacheDirectory` // eslint-disable-line
  ];

  if (react) {
    jsLoaders.unshift(resolveToOwnNodeModules('react-hot-loader'));
  }

  return [
    {
      test: /\.css$/,
      loaders: [
        resolveToOwnNodeModules('style-loader'),
        resolveToOwnNodeModules('css-loader') + (cssmodules ? '?modules&importLoaders=1' : ''),
        resolveToOwnNodeModules('postcss-loader')
      ]
    },
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loaders: jsLoaders
    },
    {
      test: /\.json$/,
      loader: resolveToOwnNodeModules('json-loader')
    },
    {
      test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
      loader: resolveToOwnNodeModules('file-loader')
    },
    {
      test: /\.(mp4|webm)$/,
      loader: `${resolveToOwnNodeModules('url-loader')}?limit=10000`
    },
    {
      test: /\.html$/,
      loader: resolveToOwnNodeModules('html-loader')
    }
  ];
}

/**
 * Setups pre loaders for webpack.
 *
 * @return {Object[]}
 */
export function setupPreloaders() {
  return [
    {
      test: /\.js$/,
      loader: resolveToOwnNodeModules('eslint-loader'),
      exclude: /node_modules/
    }
  ];
}

/**
 * Generates config for webpack.
 *
 * @param {String} filename
 * @param {Flags} flags
 *
 * @return {Object}
 */
export default function webpackConfigBuilder(filename, flags) {
  const template = getTemplatePath(filename);

  return {
    entry: setupEntry(filename, flags.host, flags.port),
    output: setupOutput(filename),
    debug: true,
    devtool: 'eval',
    plugins: setupPlugins(isTemplateExists(template) && template),
    module: {
      preLoaders: setupPreloaders(),
      loaders: setupLoaders(flags.cssmodules, flags.react)
    },
    eslint: {
      configFile: path.join(__dirname, 'eslint-config.js'),
      useEslintrc: false
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
