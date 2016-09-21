'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupEntry = setupEntry;
exports.setupOutput = setupOutput;
exports.setupPlugins = setupPlugins;
exports.setupLoaders = setupLoaders;
exports.default = webpackConfigBuilder;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _last = require('lodash/last');

var _last2 = _interopRequireDefault(_last);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _npmInstallWebpackPlugin = require('npm-install-webpack-plugin');

var _npmInstallWebpackPlugin2 = _interopRequireDefault(_npmInstallWebpackPlugin);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _precss = require('precss');

var _precss2 = _interopRequireDefault(_precss);

var _postcssImport = require('postcss-import');

var _postcssImport2 = _interopRequireDefault(_postcssImport);

var _webpackConfigCommon = require('./webpack-config-common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Setups entry part of webpack config.
 *
 * @param {String} filename
 *
 * @return {Object}
 */
function setupEntry(filename) {
  return {
    app: [(0, _webpackConfigCommon.resolveToCwd)(filename)]
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
function setupOutput(filename, dist, base) {
  var publicPath = base.endsWith('/') ? base : base + '/';

  return {
    path: (0, _webpackConfigCommon.resolveToCwd)(dist),
    filename: _path2.default.basename(filename, '.js') + '.[hash:8].js',
    hash: true,
    publicPath: publicPath
  };
}

/**
 * Setups plugins section for webpack config.
 *
 * @param {String} template file name
 *
 * @return {Array}
 */
function setupPlugins(template) {
  return [new _htmlWebpackPlugin2.default({
    title: (0, _last2.default)(process.cwd().split(_path2.default.sep)),
    template: template ? template : require.resolve('../template/index.ejs')
  }), new _npmInstallWebpackPlugin2.default({
    save: false,
    saveDev: false,
    saveExact: false
  }), new _webpack2.default.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }), new _webpack2.default.optimize.OccurrenceOrderPlugin(), new _webpack2.default.optimize.DedupePlugin(), new _webpack2.default.optimize.UglifyJsPlugin({
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
  }), new _extractTextWebpackPlugin2.default('[name].[contenthash:8].css')];
}

/**
 * Setups loaders for webpack.
 *
 * @param {Boolean} cssmodules
 *
 * @return {Object[]}
 */
function setupLoaders(cssmodules) {
  var babelLoader = [require.resolve('babel-loader'), '?presets[]=' + require.resolve('babel-preset-react'), ',presets[]=' + require.resolve('babel-preset-latest')];
  var jsLoaders = [babelLoader.join('')];
  var cssLoaders = [require.resolve('css-loader') + (cssmodules ? '?modules&importLoaders=1' : ''), require.resolve('postcss-loader')];

  return [{
    test: /\.css$/,
    loader: _extractTextWebpackPlugin2.default.extract(require.resolve('style-loader'), cssLoaders.join('!'))
  }, {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loaders: jsLoaders
  }, {
    test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
    loader: require.resolve('file-loader'),
    query: {
      name: '[name].[hash:8].[ext]'
    }
  }, {
    test: /\.json$/,
    loader: require.resolve('json-loader')
  }, {
    test: /\.(mp4|webm)$/,
    loader: require.resolve('url'),
    query: { limit: 1000 }
  }, {
    test: /\.html$/,
    loader: require.resolve('html-loader')
  }];
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
function webpackConfigBuilder(filename, flags, dist) {
  var template = (0, _webpackConfigCommon.getTemplatePath)(filename);

  return {
    entry: setupEntry(filename),
    output: setupOutput(filename, dist, (0, _isString2.default)(flags.base) ? flags.base : ''),
    debug: false,
    bail: true,
    devtool: 'source-map',
    plugins: setupPlugins((0, _webpackConfigCommon.isTemplateExists)(template) && template),
    module: {
      loaders: setupLoaders(flags.cssmodules)
    },
    postcss: function postcss(wp) {
      return [(0, _postcssImport2.default)({ addDependencyTo: wp }), (0, _autoprefixer2.default)(), (0, _precss2.default)()];
    }
  };
}