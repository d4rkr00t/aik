/* @flow */

import path from 'path';
import { resolveToCwd } from './helpers';

/**
 * Output for production build.
 */
export function outputProd(filename:string, flags:CLIFlags, dist:string) : Output {
  const base = typeof flags.base === 'string' ? flags.base : '';
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
 */
export function outputDev(filename:string) : Output {
  return {
    path: path.join(process.cwd(), path.dirname(filename)),
    filename: path.basename(filename),
    hash: true
  };
}

/**
 * Setups output section of webpack config.
 */
export default function output(filename:string, flags:CLIFlags, isProd:boolean, dist:string) : Output {
  return isProd
    ? outputProd(filename, flags, dist)
    : outputDev(filename);
}
