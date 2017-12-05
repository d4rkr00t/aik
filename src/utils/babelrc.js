/* @flow */

import path from "path";
import resolve from "resolve";
import { loadConfig } from "./config";
import { AikError } from "./error";
import { babelrcCannotResolveError } from "./messages";

export const presetsList = ["babel-preset-env", "babel-preset-react", "babel-preset-react-hmre"];
export const pluginsList = ["babel-plugin-transform-object-rest-spread", "babel-plugin-transform-class-properties"];

export function resolveBabelExtension({
  basedir,
  prefix,
  ext
}: {
  basedir: string,
  prefix: string,
  ext: BabelExt
}): { result?: BabelExt, error?: Error } {
  const extName = getExtName({ prefix, ext });
  try {
    if (Array.isArray(ext)) {
      ext[0] = resolve.sync(extName, { basedir });
    } else {
      ext = resolve.sync(extName, { basedir });
    }
    return { result: ext };
  } catch (e) {
    return { error: e };
  }
}

export function isClashing({
  ext,
  prefix,
  extList
}: {
  ext: BabelExt,
  prefix: string,
  extList: Array<string>
}): boolean {
  return extList.indexOf(getExtName({ prefix, ext })) > -1;
}

export function processErrors(errs: Array<{ code: string, message: string }>) {
  return errs
    .filter(err => err.code === "MODULE_NOT_FOUND")
    .map(err => (err.message.match(/module\s'(.+)'\sfrom/i) || [])[1])
    .filter(err => !!err);
}

export function getExtName({ prefix, ext }: { prefix: string, ext: BabelExt }): string {
  const name = (Array.isArray(ext) ? ext[0] : ext).replace(prefix, "");
  return prefix + name;
}

export function processExtension(
  acc: { results: Array<BabelExt>, errors: Array<any>, clashing: Array<string>, names: Array<string> },
  { prefix, extList, babelrcDir, ext }: { prefix: string, extList: Array<string>, babelrcDir: string, ext: BabelExt }
) {
  if (isClashing({ ext, prefix, extList })) {
    acc.clashing.push(getExtName({ ext, prefix }));
    return acc;
  }

  const { result, error } = resolveBabelExtension({ basedir: babelrcDir, prefix, ext });

  if (error) acc.errors.push(error);
  if (result) {
    acc.names.push(getExtName({ ext, prefix }));
    acc.results.push(result);
  }

  return acc;
}

export function processBabelrc(babelrc: Babelrc): Babelrc {
  if (!babelrc.path) return babelrc;

  const babelrcDir = path.dirname(babelrc.path);
  const {
    results: presets,
    errors: presetErrors,
    clashing: clashingPresets,
    names: presetsNames
  } = babelrc.config.presets.reduce(
    (acc, preset) => processExtension(acc, { prefix: "babel-preset-", extList: presetsList, babelrcDir, ext: preset }),
    { results: [], errors: [], clashing: [], names: [] }
  );
  const {
    results: plugins,
    errors: pluginErrors,
    clashing: clashingPlugins,
    names: pluginsNames
  } = babelrc.config.plugins.reduce(
    (acc, preset) => processExtension(acc, { prefix: "babel-plugin-", extList: pluginsList, babelrcDir, ext: preset }),
    { results: [], errors: [], clashing: [], names: [] }
  );

  const presetErrorsFormatted = processErrors(presetErrors);
  const pluginErrorsFormatted = processErrors(pluginErrors);

  if ((presetErrorsFormatted.length || pluginErrorsFormatted.length) && babelrc.path) {
    throw new AikError(
      `Unable to process .babelrc`,
      babelrcCannotResolveError(babelrc.path, presetErrorsFormatted, pluginErrorsFormatted)
    );
  }

  return {
    path: babelrc.path,
    config: {
      presets: presets,
      plugins: plugins
    },
    clashing: {
      presets: clashingPresets,
      plugins: clashingPlugins
    },
    names: {
      presets: presetsNames,
      plugins: pluginsNames
    }
  };
}

/**
 * Returns .babelrc content if it exists and null otherwise
 */
export function getBabelrc(filename: string = ""): Babelrc {
  const { config, path: babelrcPath } = loadConfig({ configName: ".babelrc", filename });

  if (config && babelrcPath) {
    return processBabelrc({
      path: babelrcPath,
      config: {
        presets: config.presets || [],
        plugins: config.plugins || []
      },
      clashing: {
        presets: [],
        plugins: []
      },
      names: {
        presets: [],
        plugins: []
      }
    });
  }

  return {
    path: "",
    config: {
      presets: [],
      plugins: []
    },
    clashing: {
      presets: [],
      plugins: []
    },
    names: {
      presets: [],
      plugins: []
    }
  };
}
