/* @flow */

import path from "path";
import resolveToCwd from "./../utils/resolve-to-cwd";

/**
 * Output for production build.
 */
export function outputProd({ base, dist, filename }: AikParams): Output {
  const publicPath = base.endsWith("/") ? base : base + "/";

  return {
    path: resolveToCwd(dist.short),
    filename: `${path.basename(filename, ".js")}.[hash:8].js`,
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
export default function output(params: AikParams): Output {
  return params.isProd ? outputProd(params) : outputDev(params.filename);
}
