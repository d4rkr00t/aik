/* @flow */
import path from "path";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import autoprefixer from "autoprefixer";
import precss from "precss";
import postcssPartialImport from "postcss-partial-import";

/**
 * Creates loader for JavaScript files and add some extra features for dev server, like hot reloading.
 */
export function createJSLoader(flags: CLIFlags, isProd: boolean): any[] {
  const presets = [
    [
      require.resolve("babel-preset-env"),
      {
        targets: { ie: 11 },
        modules: false
      }
    ]
  ];

  const plugins = [
    [require.resolve("babel-plugin-transform-object-rest-spread"), { useBuiltIns: true }],
    require.resolve("babel-plugin-transform-class-properties")
  ];

  if (flags.react) {
    presets.push(require.resolve("babel-preset-react"));
    !isProd && presets.push(require.resolve("babel-preset-react-hmre"));
  }

  const jsLoaders: { loader: string, query?: any }[] = [
    {
      loader: require.resolve("babel-loader"),
      query: { presets, plugins }
    }
  ];

  return jsLoaders;
}

/**
 * Creates production loader for CSS files.
 */
export function createCSSLoaderProd(): Loader {
  return {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: require.resolve("style-loader"),
      use: [
        {
          loader: require.resolve("css-loader"),
          options: {
            importLoaders: 1,
            minimize: true
          }
        },
        {
          loader: require.resolve("postcss-loader"),
          options: {
            plugins() {
              return [postcssPartialImport(), autoprefixer(), precss()];
            }
          }
        }
      ]
    })
  };
}

/**
 * Creates dev server loader for CSS files.
 */
export function createCSSLoaderDev(): Loader {
  return {
    test: /\.css$/,
    use: [
      {
        loader: require.resolve("style-loader"),
        options: {
          convertToAbsoluteUrls: true
        }
      },
      {
        loader: require.resolve("css-loader"),
        options: {
          importLoaders: 1,
          sourceMap: true
        }
      },
      {
        loader: require.resolve("postcss-loader"),
        options: {
          plugins() {
            return [postcssPartialImport(), autoprefixer(), precss()];
          }
        }
      }
    ]
  };
}

/**
 * Setups loaders for webpack.
 */
export function rules(flags: CLIFlags, params: AikParams): Loader[] {
  const { isProd } = params;
  const jsLoaders = createJSLoader(flags, isProd);

  return [
    isProd ? createCSSLoaderProd() : createCSSLoaderDev(),
    {
      test: /\.jsx?$/,
      enforce: "pre",
      exclude: /(node_modules|bower_components|aik\/lib\/webpack)/,
      loader: require.resolve("eslint-loader"),
      options: {
        configFile: path.join(__dirname, "..", "eslint-config.js"),
        useEslintrc: false
      }
    },
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: jsLoaders
    },
    {
      test: /\.json$/,
      use: require.resolve("json-loader")
    },
    {
      test: /\.html$/,
      use: require.resolve("html-loader")
    },
    {
      exclude: [/\/$/, /\.html$/, /\.ejs$/, /\.css$/, /\.jsx?$/, /\.json$/],
      loader: require.resolve("file-loader"),
      query: {
        name: isProd ? "[name].[hash:8].[ext]" : "[name].[ext]"
      }
    }
  ];
}
