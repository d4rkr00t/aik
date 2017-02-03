'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preloaders = preloaders;
exports.createJSLoader = createJSLoader;
exports.createCSSLoaderProd = createCSSLoaderProd;
exports.createCSSLoaderDev = createCSSLoaderDev;
exports.loaders = loaders;

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Setups pre loaders for webpack.
 */
function preloaders() {
  return [{
    test: /\.js$/,
    loader: require.resolve('eslint-loader'),
    exclude: /node_modules/
  }];
}

/**
 * Creates loader for JavaScript files and add some extra features for dev server, like hot reloading.
 */


function createJSLoader(flags, isProd) {
  const babelLoader = [require.resolve('babel-loader'), `?presets[]=${require.resolve('babel-preset-react')}`, `,presets[]=${require.resolve('babel-preset-latest')}`];

  if (!isProd) {
    babelLoader.push('&cacheDirectory');
  }

  const jsLoaders = [babelLoader.join('')];

  if (!isProd && flags.react) {
    jsLoaders.unshift(require.resolve('react-hot-loader'));
  }

  return jsLoaders;
}

/**
 * Creates production loader for CSS files.
 */
function createCSSLoaderProd(flags) {
  const cssLoaders = [require.resolve('css-loader') + (flags.cssmodules ? '?modules&importLoaders=1' : ''), require.resolve('postcss-loader')];

  return {
    test: /\.css$/,
    loader: _extractTextWebpackPlugin2.default.extract(require.resolve('style-loader'), cssLoaders.join('!'))
  };
}

/**
 * Creates dev server loader for CSS files.
 */
function createCSSLoaderDev(flags) {
  return {
    test: /\.css$/,
    loaders: [require.resolve('style-loader'), require.resolve('css-loader') + (flags.cssmodules ? '?modules&importLoaders=1' : ''), require.resolve('postcss-loader')]
  };
}

/**
 * Setups loaders for webpack.
 */
function loaders(flags, params) {
  const isProd = params.isProd;

  const jsLoaders = createJSLoader(flags, isProd);

  return [isProd ? createCSSLoaderProd(flags) : createCSSLoaderDev(flags), {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loaders: jsLoaders
  }, {
    test: /\.json$/,
    loader: require.resolve('json-loader')
  }, {
    exclude: [/\/$/, /\.html$/, /\.ejs$/, /\.css$/, /\.jsx?$/, /\.json$/],
    loader: require.resolve('file-loader'),
    query: {
      name: isProd ? '[name].[hash:8].[ext]' : '[name].[ext]'
    }
  }];
}