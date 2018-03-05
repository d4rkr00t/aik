/* @flow */

import fs from "fs-extra";
import path from "path";
import webpack from "webpack";
import gzipSize from "gzip-size";
import webpackConfigBuilder from "./../../webpack/config-builder";
import {
  print,
  addTopSpace,
  builderBanner,
  builderRemovingDistMsg,
  builderRunningBuildMsg,
  builderErrorMsg,
  builderSuccessMsg,
  fileDoesNotExistMsg
} from "./../../utils/messages";

/**
 * Removes distribute folder to prevent duplicates.
 */
export function removeDist(distPath: string): Promise<*> {
  return new Promise(resolve => fs.remove(distPath, resolve));
}

export function createBuildStats(dist: string, stats: any) {
  const buildDuration: number = stats.time;
  const assets: BuildStatAsset[] = stats.assets.map(item => {
    const content: string = fs.readFileSync(path.join(dist, item.name), "utf-8");
    return {
      name: item.name,
      size: item.size / 1024,
      sizeGz: gzipSize.sync(content) / 1024
    };
  });

  return { buildDuration, assets };
}

/**
 * Builds project using webpack.
 */
export default async function runWebpackBuilder(params: AikParams): Promise<*> {
  try {
    fs.statSync(params.filename);
  } catch (error) {
    print(fileDoesNotExistMsg(params.filename), /* clear console */ true);
    return;
  }

  const config = webpackConfigBuilder(params);
  const compiler = webpack(config);

  print(builderBanner(params), /* clear console */ true);
  print(addTopSpace(builderRemovingDistMsg(params.dist.path)));

  await removeDist(params.dist.path);

  print(builderRunningBuildMsg());

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      const json = stats.toJson({}, true);

      if (err || stats.hasErrors()) {
        print(builderErrorMsg(err || json.errors), /* clear console */ true, /* add sep */ true);

        return reject();
      }

      const { buildDuration, assets } = createBuildStats(params.dist.path, json);

      print(
        builderSuccessMsg(params.dist.short, { buildDuration, assets }),
        /* clear console */ true,
        /* add sep */ true
      );

      resolve(compiler);
    });
  });
}
