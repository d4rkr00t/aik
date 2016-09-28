/* @flow */

import { resolveToCwd } from './helpers';

/**
 * Entry for production build.
 */
export function entryProd(filename:string) : Entry {
  return {
    app: [resolveToCwd(filename)]
  };
}


/**
 * Entry for dev server.
 */
export function entryDev(filename:string, flags:CLIFlags) : Entry {
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
 */
export default function entry(filename:string, flags:CLIFlags, params:AikParams) : Entry {
  return params.isProd
    ? entryProd(filename)
    : entryDev(filename, flags);
}
