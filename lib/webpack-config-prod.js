'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeAbsolutePathToNodeModules = makeAbsolutePathToNodeModules;
exports.setupEntry = setupEntry;
exports.setupOutput = setupOutput;
exports.setupPlugins = setupPlugins;
exports.setupLoaders = setupLoaders;
exports.default = webpackConfigBuilder;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _last = require('lodash/last');

var _last2 = _interopRequireDefault(_last);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Makes absolute path to node_modules for webpack plugins and loaders.
 *
 * @param {String} relativePath
 *
 * @return {String}
 */
function makeAbsolutePathToNodeModules(relativePath) {
  return _path2.default.join(__dirname, '..', 'node_modules', relativePath);
}

/**
 * Setups entry part of webpack config.
 *
 * @param {String} filename
 *
 * @return {Object}
 */
function setupEntry(filename) {
  return {
    app: [_path2.default.join(process.cwd(), filename)]
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
function setupOutput(filename, dist) {
  return {
    path: _path2.default.join(process.cwd(), dist, _path2.default.dirname(filename)),
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
function setupPlugins() {
  return [new _htmlWebpackPlugin2.default({
    title: (0, _last2.default)(process.cwd().split(_path2.default.sep))
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
  var babelLoader = [makeAbsolutePathToNodeModules('babel-loader'), '?presets[]=' + makeAbsolutePathToNodeModules('babel-preset-react'), ',presets[]=' + makeAbsolutePathToNodeModules('babel-preset-es2015')];
  var jsLoaders = [babelLoader.join('')];
  var cssLoaders = [makeAbsolutePathToNodeModules('css-loader') + (cssmodules ? '?modules&importLoaders=1' : ''), makeAbsolutePathToNodeModules('postcss-loader')];

  return [{
    test: /\.css$/,
    loader: _extractTextWebpackPlugin2.default.extract(makeAbsolutePathToNodeModules('style-loader'), cssLoaders.join('!'))
  }, {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loaders: jsLoaders
  }, {
    test: /\.json$/,
    loader: makeAbsolutePathToNodeModules('json-loader')
  }, {
    test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
    loader: makeAbsolutePathToNodeModules('file-loader'),
    query: {
      name: '[name].[hash:8].[ext]'
    }
  }, {
    test: /\.(mp4|webm)$/,
    loader: makeAbsolutePathToNodeModules('url') + '?limit=10000'
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
    postcss: function postcss(wp) {
      return [(0, _postcssImport2.default)({ addDependencyTo: wp }), (0, _autoprefixer2.default)(), (0, _precss2.default)()];
    }
  };
}