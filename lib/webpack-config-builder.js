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

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _npmInstallWebpackPlugin = require('npm-install-webpack-plugin');

var _npmInstallWebpackPlugin2 = _interopRequireDefault(_npmInstallWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeAbsolutePathToNodeModules(relativePath) {
  return _path2.default.join(__dirname, '..', 'node_modules', relativePath);
}

function setupEntry(filename, host, port) {
  host = host === '::' ? 'localhost' : host;

  return {
    app: [makeAbsolutePathToNodeModules('webpack-dev-server/client') + '?http://' + host + ':' + port + '/', makeAbsolutePathToNodeModules('webpack/hot/only-dev-server'), _path2.default.join(process.cwd(), filename)]
  };
}

function setupOutput(filename) {
  return {
    path: _path2.default.join(process.cwd(), _path2.default.dirname(filename)),
    filename: 'index.js',
    hash: true
  };
}

function setupPlugins() {
  return [new _webpack2.default.HotModuleReplacementPlugin(), new _htmlWebpackPlugin2.default(), new _npmInstallWebpackPlugin2.default({
    save: false,
    saveDev: false,
    saveExact: false
  })];
}

function setupLoaders(cssmodules) {
  return [{
    test: /\.css$/,
    loaders: [makeAbsolutePathToNodeModules('style-loader'), makeAbsolutePathToNodeModules('css-loader') + (cssmodules ? '?modules' : '')]
  }, {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loaders: [makeAbsolutePathToNodeModules('react-hot-loader'), makeAbsolutePathToNodeModules('babel-loader') + '?presets[]=react,presets[]=es2015']
  }];
}

function webpackConfigBuilder(filename, flags) {
  return {
    entry: setupEntry(filename, flags.host, flags.port),
    output: setupOutput(filename),
    debug: true,
    devtool: 'source-map',
    plugins: setupPlugins(),
    module: {
      loaders: setupLoaders(flags.cssmodules)
    }
  };
}