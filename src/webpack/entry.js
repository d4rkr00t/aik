/* @flow */

import path from 'path';
import resolveToCwd from './../utils/resolve-to-cwd';

/**
 * Build entry name from given filename.
 *
 * index.js -> index
 * src/index.js -> index
 * index.sth.js -> index
 */
export function buildEntryName(filename: string): string {
  return path.basename(filename).split('.')[0];
}

/**
 * Entry for production build.
 */
export function entryProd(filename: string): Entry {
  const entryName = buildEntryName(filename);
  return {
    [entryName]: [resolveToCwd(filename)]
  };
}


/**
 * Entry for dev server.
 */
export function entryDev(filename: string, flags: CLIFlags): Entry {
  const entryName = buildEntryName(filename);
  const host = flags.host === '::' ? 'localhost' : flags.host;

  return {
    [entryName]: [
      require.resolve('./assets/public-path.js'),
      `${require.resolve('webpack-dev-server/client')}?http://${host}:${flags.port}/`,
      require.resolve('webpack/hot/dev-server'),
      resolveToCwd(filename)
    ]
  };
}

/**
 * Setups entry part of webpack config.
 */
export default function entry(filename: string, flags: CLIFlags, params: AikParams): Entry {
  return params.isProd
    ? entryProd(filename)
    : entryDev(filename, flags);
}
