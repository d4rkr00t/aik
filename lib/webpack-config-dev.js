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
 * @param {String} host
 * @param {String} port
 *
 * @return {Object}
 */
function setupEntry(filename, host, port) {
  host = host === '::' ? 'localhost' : host;

  return {
    app: [makeAbsolutePathToNodeModules('webpack-dev-server/client') + '?http://' + host + ':' + port + '/', makeAbsolutePathToNodeModules('webpack/hot/dev-server'), _path2.default.join(process.cwd(), filename)]
  };
}

/**
 * Setups output section of webpack config.
 *
 * @param {String} filename
 *
 * @return {Object}
 */
function setupOutput(filename) {
  return {
    path: _path2.default.join(process.cwd(), _path2.default.dirname(filename)),
    filename: 'index.js',
    hash: true
  };
}

/**
 * Setups plugins section for webpack config.
 *
 * @return {Array}
 */
function setupPlugins() {
  return [new _webpack2.default.HotModuleReplacementPlugin(), new _htmlWebpackPlugin2.default({
    title: (0, _last2.default)(process.cwd().split(_path2.default.sep))
  }), new _npmInstallWebpackPlugin2.default({
    dev: true,
    peerDependencies: true
  }), new _webpack2.default.DefinePlugin({ 'process.env.NODE_ENV': '"development"' })];
}

/**
 * Setups loaders for webpack.
 *
 * @param {Boolean} cssmodules
 * @param {Boolean} react
 *
 * @return {Object[]}
 */
function setupLoaders(cssmodules, react) {
  var jsLoaders = [makeAbsolutePathToNodeModules('babel-loader') + '?presets[]=' + makeAbsolutePathToNodeModules('babel-preset-react') + ',presets[]=' + makeAbsolutePathToNodeModules('babel-preset-es2015') + '&cacheDirectory' // eslint-disable-line
  ];

  if (react) {
    jsLoaders.unshift(makeAbsolutePathToNodeModules('react-hot-loader'));
  }

  return [{
    test: /\.css$/,
    loaders: [makeAbsolutePathToNodeModules('style-loader'), makeAbsolutePathToNodeModules('css-loader') + (cssmodules ? '?modules&importLoaders=1' : ''), makeAbsolutePathToNodeModules('postcss-loader')]
  }, {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loaders: jsLoaders
  }, {
    test: /\.json$/,
    loader: makeAbsolutePathToNodeModules('json-loader')
  }, {
    test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
    loader: makeAbsolutePathToNodeModules('file-loader')
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
 *
 * @return {Object}
 */
function webpackConfigBuilder(filename, flags) {
  return {
    entry: setupEntry(filename, flags.host, flags.port),
    output: setupOutput(filename),
    debug: true,
    devtool: 'eval',
    plugins: setupPlugins(),
    module: {
      loaders: setupLoaders(flags.cssmodules, flags.react)
    },
    postcss: function postcss(wp) {
      return [(0, _postcssImport2.default)({ addDependencyTo: wp }), (0, _autoprefixer2.default)(), (0, _precss2.default)()];
    }
  };
}