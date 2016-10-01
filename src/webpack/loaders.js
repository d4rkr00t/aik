/* @flow */

import ExtractTextPlugin from 'extract-text-webpack-plugin';

/**
 * Setups pre loaders for webpack.
 */
export function preloaders() : Loader[] {
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
 */
export function createJSLoader(flags: CLIFlags, isProd: boolean) : string[] {
  const babelLoader: string[] = [
    require.resolve('babel-loader'),
    `?presets[]=${require.resolve('babel-preset-react')}`,
    `,presets[]=${require.resolve('babel-preset-latest')}`
  ];

  if (!isProd) {
    babelLoader.push('&cacheDirectory');
  }

  const jsLoaders: string[] = [babelLoader.join('')];

  if (!isProd && flags.react) {
    jsLoaders.unshift(require.resolve('react-hot-loader'));
  }

  return jsLoaders;
}

/**
 * Creates production loader for CSS files.
 */
export function createCSSLoaderProd(flags: CLIFlags) : Loader {
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
 */
export function createCSSLoaderDev(flags: CLIFlags) : Loader {
  return {
    test: /\.css$/,
    loaders: [
      require.resolve('style-loader'),
      require.resolve('css-loader') + '?sourceMap' + (flags.cssmodules ? '&modules&importLoaders=1' : ''),
      require.resolve('postcss-loader')
    ]
  };
}

/**
 * Setups loaders for webpack.
 */
export function loaders(flags: CLIFlags, params: AikParams) : Loader[] {
  const { isProd } = params;
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
      test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)$/,
      loader: require.resolve('url-loader'),
      query: { limit: 1000 }
    },
    {
      test: /\.(jpg|jpeg|png|gif|eot|svg|ttf|woff|woff2)$/,
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
