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
    app: [require.resolve('webpack-dev-server/client') + '?http://' + host + ':' + port + '/', require.resolve('webpack/hot/dev-server'), (0, _webpackConfigCommon.resolveToCwd)(filename)]
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
  return [new _webpack2.default.HotModuleReplacementPlugin(), new _htmlWebpackPlugin2.default({
    title: (0, _last2.default)(process.cwd().split(_path2.default.sep)),
    template: template ? template : require.resolve('../template/index.ejs')
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
  var jsLoaders = [require.resolve('babel-loader') + '?presets[]=' + require.resolve('babel-preset-react') + ',presets[]=' + require.resolve('babel-preset-es2015') + '&cacheDirectory'];

  if (react) {
    jsLoaders.unshift(require.resolve('react-hot-loader'));
  }

  return [{
    test: /\.css$/,
    loaders: [require.resolve('style-loader'), require.resolve('css-loader') + (cssmodules ? '?modules&importLoaders=1' : ''), require.resolve('postcss-loader')]
  }, {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loaders: jsLoaders
  }, {
    test: /\.json$/,
    loader: require.resolve('json-loader')
  }, {
    test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
    loader: require.resolve('file-loader')
  }, {
    test: /\.(mp4|webm)$/,
    loader: require.resolve('url-loader'),
    query: { limit: 1000 }
  }, {
    test: /\.html$/,
    loader: require.resolve('html-loader')
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
    loader: require.resolve('eslint-loader'),
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