/* @flow */

import path from 'path';
import autoprefixer from 'autoprefixer';
import precss from 'precss';
import postcssPartialImport from 'postcss-partial-import';
import entry from './entry';
import output from './output';
import plugins from './plugins';
import { preloaders, loaders } from './loaders';

/**
 * Generates config for webpack.
 */
export default function webpackConfigBuilder(filename: string, flags: CLIFlags, params: AikParams): WebPackConfig {
  return {
    entry: entry(filename, flags, params),
    output: output(filename, flags, params),
    debug: !params.isProd,
    devtool: !params.isProd && 'eval',
    plugins: plugins(params),
    bail: params.isProd,
    module: {
      preLoaders: preloaders(),
      loaders: loaders(flags, params)
    },
    resolve: {
      alias: { 'react/lib/ReactMount': 'react-dom/lib/ReactMount' },
      modulesDirectories: [
        path.dirname(path.resolve(process.cwd(), filename)),
        'web_modules',
        'node_modules'
      ]
    },
    eslint: {
      configFile: path.join(__dirname, '../eslint-config.js'),
      useEslintrc: false
    },
    postcss: function (wp) {
      return [
        postcssPartialImport({ addDependencyTo: wp }),
        autoprefixer(),
        precss()
      ];
    }
  };
}
