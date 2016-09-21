import { resolveToCwd } from './helpers';

/**
 * Entry for production build.
 *
 * @param {String} filename
 *
 * @return {Object}
 */
export function entryProd(filename) {
  return {
    app: [resolveToCwd(filename)]
  };
}


/**
 * Entry for dev server.
 *
 * @param {String} filename
 * @param {Object} flags
 *
 * @return {Object}
 */
export function entryDev(filename, flags) {
  const host = flags.host === '::' ? 'localhost' : flags.host;

  return {
    app: [
      `${require.resolve('webpack-dev-server/client')}?http://${host}:${flags.port}/`,
      require.resolve('webpack/hot/dev-server'),
      resolveToCwd(filename)
    ]
  };
}

/**
 * Setups entry part of webpack config.
 *
 * @param {String} filename
 * @param {Object} flags
 * @param {Boolean} isProd
 *
 * @return {Object}
 */
export default function entry(filename, flags, isProd) {
  return isProd
    ? entryProd(filename)
    : entryDev(filename, flags);
}
