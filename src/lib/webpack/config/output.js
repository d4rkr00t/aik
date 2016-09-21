import path from 'path';
import { isString } from 'lodash';
import { resolveToCwd } from './helpers';

/**
 * Output for production build.
 *
 * @param {String} filename
 * @param {Object} flags
 * @param {String} dist - folder where production build will be placed.
 *
 * @return {Object}
 */
export function outputProd(filename, flags, dist) {
  const base = isString(flags.base) ? flags.base : '';
  const publicPath = base.endsWith('/') ? base : base + '/';

  return {
    path: resolveToCwd(dist),
    filename: `${path.basename(filename, '.js')}.[hash:8].js`,
    hash: true,
    publicPath
  };
}

/**
 * Output for dev server.
 *
 * @param {String} filename
 *
 * @return {Object}
 */
export function outputDev(filename) {
  return {
    path: path.join(process.cwd(), path.dirname(filename)),
    filename: path.basename(filename),
    hash: true
  };
}

/**
 * Setups output section of webpack config.
 *
 * @param {String} filename
 * @param {Object} flags
 * @param {Boolean} isProd
 * @param {String} dist - folder where production build will be placed.
 *
 * @return {Object}
 */
export default function output(filename, flags, isProd, dist) {
  return isProd
    ? outputProd(filename, flags, dist)
    : outputDev(filename);
}
