/* @flow */

import webpack from 'webpack';
import rimraf from 'rimraf';
import webpackConfigBuilder from './webpack/config-builder';
import {
  builderBanner,
  builderRemovingDistMsg,
  builderRunningBuildMsg,
  builderErrorMsg,
  builderSuccessMsg
} from './utils/messages';

/**
 * Removes distribute folder to prevent duplicates.
 */
export function removeDist(distPath: string) : Promise<*> {
  return new Promise(resolve => rimraf(distPath, resolve));
}

/**
 * Builds project using webpack.
 */
export default function runWebpackBuilder(filename: string, flags: CLIFlags, params: AikParams) : Promise<*> {
  const config = webpackConfigBuilder(filename, flags, params);
  const compiler = webpack(config);

  builderBanner(filename, flags, params);
  builderRemovingDistMsg(params.dist.path);

  return removeDist(params.dist.path)
    .then(() => {
      builderRunningBuildMsg();
      compiler.run(err => {
        if (err) {
          builderErrorMsg(err);
          process.exit(1); // eslint-disable-line
        }
        builderSuccessMsg(params.dist.short);
      });
    });
}
