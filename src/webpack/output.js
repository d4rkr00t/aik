/* @flow */

import path from 'path';
import resolveToCwd from './../utils/resolve-to-cwd';

/**
 * Output for production build.
 */
export function outputProd(filename: string, flags: CLIFlags, params: AikParams): Output {
  const base = typeof flags.base === 'string' ? flags.base : '';
  const publicPath = base.endsWith('/') ? base : base + '/';

  return {
    path: resolveToCwd(params.dist.short),
    filename: `${path.basename(filename, '.js')}.[hash:8].js`,
    publicPath
  };
}

/**
 * Output for dev server.
 */
export function outputDev(filename: string): Output {
  return {
    path: path.join(process.cwd(), path.dirname(filename)),
    filename: path.basename(filename)
  };
}

/**
 * Setups output section of webpack config.
 */
export default function output(filename: string, flags: CLIFlags, params: AikParams): Output {
  return params.isProd
    ? outputProd(filename, flags, params)
    : outputDev(filename);
}
