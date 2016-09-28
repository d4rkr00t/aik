'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.htmlWebpackPlugin = htmlWebpackPlugin;
exports.npmInstallPlugin = npmInstallPlugin;
exports.pluginsProd = pluginsProd;
exports.pluginsDev = pluginsDev;
exports.default = plugins;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _npmInstallWebpackPlugin = require('npm-install-webpack-plugin');

var _npmInstallWebpackPlugin2 = _interopRequireDefault(_npmInstallWebpackPlugin);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _last = require('../../utils/last');

var _last2 = _interopRequireDefault(_last);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function htmlWebpackPlugin(template) {
  return new _htmlWebpackPlugin2.default({
    title: (0, _last2.default)(process.cwd().split(_path2.default.sep)),
    template: template ? template : require.resolve('../../../../template/index.ejs')
  });
}

function npmInstallPlugin() {
  return new _npmInstallWebpackPlugin2.default({
    dev: true,
    peerDependencies: true
  });
}

/**
 * Plugins for production build.
 */
function pluginsProd(template) {
  return [new _webpack2.default.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }), htmlWebpackPlugin(template), npmInstallPlugin(), new _webpack2.default.optimize.OccurrenceOrderPlugin(), new _webpack2.default.optimize.DedupePlugin(), new _webpack2.default.optimize.UglifyJsPlugin({
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
 * Plugins for dev server.
 */
function pluginsDev(template) {
  return [new _webpack2.default.DefinePlugin({ 'process.env.NODE_ENV': '"development"' }), new _webpack2.default.HotModuleReplacementPlugin(), htmlWebpackPlugin(template), npmInstallPlugin()];
}

/**
 * Setups plugins section for webpack config.
 */
function plugins(params) {
  return params.isProd ? pluginsProd(params.template.path) : pluginsDev(params.template.path);
}