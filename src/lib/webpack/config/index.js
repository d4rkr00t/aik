/* @flow */

import path from 'path';
import autoprefixer from 'autoprefixer';
import precss from 'precss';
import postcssImport from 'postcss-import';
import entry from './entry';
import output from './output';
import plugins from './plugins';
import { preloaders, loaders } from './loaders';

/**
 * Generates config for webpack.
 */
export default function webpackConfigBuilder(filename:string, flags:CLIFlags, params:AikParams) : WebPackConfig { // eslint-disable-line
  return {
    entry: entry(filename, flags, params),
    output: output(filename, flags, params),
    debug: !params.isProd,
    devtool: !params.isProd && 'eval',
    plugins: plugins(params),
    module: {
      preLoaders: preloaders(),
      loaders: loaders(flags, params)
    },
    eslint: {
      configFile: path.join(__dirname, '../../eslint-config.js'),
      useEslintrc: false
    },
    postcss: function (wp) {
      return [
        postcssImport({ addDependencyTo: wp }),
        autoprefixer(),
        precss()
      ];
    }
  };
}
