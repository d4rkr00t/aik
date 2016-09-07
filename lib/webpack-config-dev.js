'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupEntry = setupEntry;
exports.setupOutput = setupOutput;
exports.setupPlugins = setupPlugins;
exports.setupLoaders = setupLoaders;
exports.setupPreloaders = setupPreloaders;
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

var _webpackConfigCommon = require('./webpack-config-common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    app: [(0, _webpackConfigCommon.resolveToOwnNodeModules)('webpack-dev-server/client') + '?http://' + host + ':' + port + '/', (0, _webpackConfigCommon.resolveToOwnNodeModules)('webpack/hot/dev-server'), (0, _webpackConfigCommon.resolveToCwd)(filename)]
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
    filename: _path2.default.basename(filename),
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
function setupPlugins(template) {
  var htmlPluginOptions = {
    title: (0, _last2.default)(process.cwd().split(_path2.default.sep))
  };

  if (template) {
    htmlPluginOptions.template = template;
  }

  return [new _webpack2.default.HotModuleReplacementPlugin(), new _htmlWebpackPlugin2.default(htmlPluginOptions), new _npmInstallWebpackPlugin2.default({
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
  var jsLoaders = [(0, _webpackConfigCommon.resolveToOwnNodeModules)('babel-loader') + '?presets[]=' + (0, _webpackConfigCommon.resolveToOwnNodeModules)('babel-preset-react') + ',presets[]=' + (0, _webpackConfigCommon.resolveToOwnNodeModules)('babel-preset-es2015') + '&cacheDirectory' // eslint-disable-line
  ];

  if (react) {
    jsLoaders.unshift((0, _webpackConfigCommon.resolveToOwnNodeModules)('react-hot-loader'));
  }

  return [{
    test: /\.css$/,
    loaders: [(0, _webpackConfigCommon.resolveToOwnNodeModules)('style-loader'), (0, _webpackConfigCommon.resolveToOwnNodeModules)('css-loader') + (cssmodules ? '?modules&importLoaders=1' : ''), (0, _webpackConfigCommon.resolveToOwnNodeModules)('postcss-loader')]
  }, {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loaders: jsLoaders
  }, {
    test: /\.json$/,
    loader: (0, _webpackConfigCommon.resolveToOwnNodeModules)('json-loader')
  }, {
    test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
    loader: (0, _webpackConfigCommon.resolveToOwnNodeModules)('file-loader')
  }, {
    test: /\.(mp4|webm)$/,
    loader: (0, _webpackConfigCommon.resolveToOwnNodeModules)('url-loader') + '?limit=10000'
  }, {
    test: /\.html$/,
    loader: (0, _webpackConfigCommon.resolveToOwnNodeModules)('html-loader')
  }];
}

/**
 * Setups pre loaders for webpack.
 *
 * @return {Object[]}
 */
function setupPreloaders() {
  return [{
    test: /\.js$/,
    loader: (0, _webpackConfigCommon.resolveToOwnNodeModules)('eslint-loader'),
    exclude: /node_modules/
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
  var template = (0, _webpackConfigCommon.getTemplatePath)(filename);

  return {
    entry: setupEntry(filename, flags.host, flags.port),
    output: setupOutput(filename),
    debug: true,
    devtool: 'eval',
    plugins: setupPlugins((0, _webpackConfigCommon.isTemplateExists)(template) && template),
    module: {
      preLoaders: setupPreloaders(),
      loaders: setupLoaders(flags.cssmodules, flags.react)
    },
    eslint: {
      configFile: _path2.default.join(__dirname, 'eslint-config.js'),
      useEslintrc: false
    },
    postcss: function postcss(wp) {
      return [(0, _postcssImport2.default)({ addDependencyTo: wp }), (0, _autoprefixer2.default)(), (0, _precss2.default)()];
    }
  };
}