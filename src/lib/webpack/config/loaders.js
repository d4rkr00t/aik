import ExtractTextPlugin from 'extract-text-webpack-plugin';

/**
 * Setups pre loaders for webpack.
 *
 * @return {Object[]}
 */
export function preloaders() {
  return [
    {
      test: /\.js$/,
      loader: require.resolve('eslint-loader'),
      exclude: /node_modules/
    }
  ];
}

/**
 * Creates loader for JavaScript files and add some extra features for dev server, like hot reloading.
 *
 * @param {Object} flags
 * @param {Boolean} isProd
 *
 * @return {String[]}
 */
export function createJSLoader(flags, isProd) {
  const babelLoader = [
    require.resolve('babel-loader'),
    `?presets[]=${require.resolve('babel-preset-react')}`,
    `,presets[]=${require.resolve('babel-preset-latest')}`
  ];

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
 *
 * @param {Object} flags
 *
 * @return {String[]}
 */
export function createCSSLoaderProd(flags) {
  const cssLoaders = [
    require.resolve('css-loader') + (flags.cssmodules ? '?modules&importLoaders=1' : ''),
    require.resolve('postcss-loader')
  ];

  return {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract(
      require.resolve('style-loader'),
      cssLoaders.join('!')
    )
  };
}

/**
 * Creates dev server loader for CSS files.
 *
 * @param {Object} flags
 *
 * @return {String[]}
 */
export function createCSSLoaderDev(flags) {
  return {
    test: /\.css$/,
    loaders: [
      require.resolve('style-loader'),
      require.resolve('css-loader') + (flags.cssmodules ? '?modules&importLoaders=1' : ''),
      require.resolve('postcss-loader')
    ]
  };
}

/**
 * Setups loaders for webpack.
 *
 * @param {Object} flags
 * @param {Boolean} isProd
 *
 * @return {Object[]}
 */
export function loaders(flags, isProd) {
  const jsLoaders = createJSLoader(flags, isProd);
  return [
    isProd
      ? createCSSLoaderProd(flags)
      : createCSSLoaderDev(flags),
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
      test: /\.(mp4|webm)$/,
      loader: require.resolve('url-loader'),
      query: { limit: 1000 }
    },
    {
      test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
      loader: require.resolve('file-loader'),
      query: isProd && {
        name: '[name].[hash:8].[ext]'
      }
    },
    {
      test: /\.html$/,
      loader: require.resolve('html-loader')
    }
  ];
}
