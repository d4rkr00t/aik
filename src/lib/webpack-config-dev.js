import path from 'path';
import last from 'lodash/last';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import NpmInstallPlugin from 'npm-install-webpack-plugin';

import autoprefixer from 'autoprefixer';
import precss from 'precss';
import postcssImport from 'postcss-import';

import { resolveToCwd, getTemplatePath, isTemplateExists } from './webpack-config-common';

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
      `${require.resolve('webpack-dev-server/client')}?http://${host}:${port}/`,
      require.resolve('webpack/hot/dev-server'),
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
    require.resolve('babel-loader')
    + '?presets[]=' + require.resolve('babel-preset-react')
    + ',presets[]=' + require.resolve('babel-preset-es2015')
    + '&cacheDirectory'
  ];

  if (react) {
    jsLoaders.unshift(require.resolve('react-hot-loader'));
  }

  return [
    {
      test: /\.css$/,
      loaders: [
        require.resolve('style-loader'),
        require.resolve('css-loader') + (cssmodules ? '?modules&importLoaders=1' : ''),
        require.resolve('postcss-loader')
      ]
    },
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loaders: jsLoaders
    },
    {
      test: /\.json$/,
      loader: require.resolve('json-loader')
    },
    {
      test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
      loader: require.resolve('file-loader')
    },
    {
      test: /\.(mp4|webm)$/,
      loader: require.resolve('url-loader'),
      query: { limit: 1000 }
    },
    {
      test: /\.html$/,
      loader: require.resolve('html-loader')
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
      loader: require.resolve('eslint-loader'),
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
