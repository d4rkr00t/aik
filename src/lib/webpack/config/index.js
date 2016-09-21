import path from 'path';
import autoprefixer from 'autoprefixer';
import precss from 'precss';
import postcssImport from 'postcss-import';
import { getTemplatePath, isTemplateExists } from './helpers';
import entry from './entry';
import output from './output';
import plugins from './plugins';
import { preloaders, loaders } from './loaders';

/**
 * Generates config for webpack.
 *
 * @param {String} filename
 * @param {Flags} flags
 * @param {Boolean} isProd
 * @param {String} dist - folder where production build will be placed.
 *
 * @return {Object}
 */
export default function webpackConfigBuilder(filename, flags, isProd, dist) {
  const template = getTemplatePath(filename);

  return {
    entry: entry(filename, flags, isProd),
    output: output(filename, flags, isProd, dist),
    debug: !isProd,
    devtool: !isProd && 'eval',
    plugins: plugins(isTemplateExists(template) && template),
    module: {
      preLoaders: preloaders(),
      loaders: loaders(flags, isProd)
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
