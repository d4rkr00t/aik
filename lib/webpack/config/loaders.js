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
  var babelLoader = [require.resolve('babel-loader'), '?presets[]=' + require.resolve('babel-preset-react'), ',presets[]=' + require.resolve('babel-preset-latest')];

  if (!isProd) {
    babelLoader.push('&cacheDirectory');
  }

  var jsLoaders = [babelLoader.join('')];

  if (!isProd && flags.react) {
    jsLoaders.unshift(require.resolve('react-hot-loader'));
  }

  return jsLoaders;
}

/**
 * Creates production loader for CSS files.
 */
function createCSSLoaderProd(flags) {
  var cssLoaders = [require.resolve('css-loader') + (flags.cssmodules ? '?modules&importLoaders=1' : ''), require.resolve('postcss-loader')];

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
  var isProd = params.isProd;

  var jsLoaders = createJSLoader(flags, isProd);

  return [isProd ? createCSSLoaderProd(flags) : createCSSLoaderDev(flags), {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loaders: jsLoaders
  }, {
    test: /\.json$/,
    loader: require.resolve('json-loader')
  }, {
    test: /\.(mp4|webm)$/,
    loader: require.resolve('url-loader'),
    query: { limit: 1000 }
  }, {
    test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
    loader: require.resolve('file-loader'),
    query: isProd && {
      name: '[name].[hash:8].[ext]'
    }
  }, {
    test: /\.html$/,
    loader: require.resolve('html-loader')
  }];
}