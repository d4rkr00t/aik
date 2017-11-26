/* @flow */

import path from "path";
import resolveToCwd from "./../utils/resolve-to-cwd";

/**
 * Return whether custom entry points for supported frameworks or path to provided file.
 */
export function getEntryPointPath({ filename, framework }: { filename: string, framework: Framework }): string {
  if (framework === "react") {
    return require.resolve("./assets/react-entry-point.js");
  }

  return resolveToCwd(filename);
}

/**
 * Build entry name from given filename.
 *
 * index.js -> index
 * src/index.js -> index
 * index.sth.js -> index
 */
export function buildEntryName(filename: string): string {
  return path.basename(filename).split(".")[0];
}

/**
 * Entry for production build.
 */
export function entryProd({ filename, framework }: AikParams): Entry {
  const entryName = buildEntryName(filename);
  return {
    [entryName]: [getEntryPointPath({ filename, framework })]
  };
}

/**
 * Entry for dev server.
 */
export function entryDev({ filename, framework, host, port }: AikParams): Entry {
  const entryName = buildEntryName(filename);

  return {
    [entryName]: [
      `${require.resolve("webpack-dev-server/client")}?http://${host}:${port}/`,
      require.resolve("webpack/hot/dev-server"),
      getEntryPointPath({ filename, framework })
    ]
  };
}

/**
 * Setups entry part of webpack config.
 */
export default function entry(params: AikParams): Entry {
  return params.isProd ? entryProd(params) : entryDev(params);
}
