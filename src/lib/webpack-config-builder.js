import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import NpmInstallPlugin from 'npm-install-webpack-plugin';

export function makeAbsolutePathToNodeModules(relativePath) {
  return path.join(__dirname, '..', 'node_modules', relativePath);
}

export function setupEntry(filename, host, port) {
  host = host === '::' ? 'localhost' : host;

  return {
    app: [
      `${makeAbsolutePathToNodeModules('webpack-dev-server/client')}?http://${host}:${port}/`,
      makeAbsolutePathToNodeModules('webpack/hot/only-dev-server'),
      path.join(process.cwd(), filename)
    ]
  };
}

export function setupOutput(filename) {
  return {
    path: path.join(process.cwd(), path.dirname(filename)),
    filename: 'index.js',
    hash: true
  };
}

export function setupPlugins() {
  return [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin(),
    new NpmInstallPlugin({
      save: false,
      saveDev: false,
      saveExact: false
    })
  ];
}

export function setupLoaders(cssmodules) {
  return [
    {
      test: /\.css$/,
      loaders: [
        makeAbsolutePathToNodeModules('style-loader'),
        makeAbsolutePathToNodeModules('css-loader') + (cssmodules ? '?modules' : '')
      ]
    },
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loaders: [
        makeAbsolutePathToNodeModules('react-hot-loader'),
        `${makeAbsolutePathToNodeModules('babel-loader')}?presets[]=react,presets[]=es2015`
      ]
    }
  ];
}

export default function webpackConfigBuilder(filename, flags) {
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
