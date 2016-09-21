import webpack from 'webpack';
import rimraf from 'rimraf';
import path from 'path';
import { isString } from 'lodash';
import _chalk from 'chalk';
import webpackConfigBuilder from './webpack/config';
import {
  builderBanner,
  builderRemovingDistMsg,
  builderRunningBuildMsg,
  builderErrorMsg,
  builderSuccessMsg
} from './webpack/messages';

/**
 * Removes distribute folder to prevent duplicates.
 *
 * @param {String} distPath
 *
 * @return {Promise}
 */
export function removeDist(distPath) {
  return new Promise(resolve => rimraf(distPath, resolve));
}

/**
 * Builds project using webpack.
 *
 * @param {String} filename
 * @param {Flags} flags
 * @param {Function} console
 *
 * @return {Promise}
 */
export default function runWebpackBuilder(filename, flags, console) {
  const distShortName = isString(flags.build) ? flags.build : 'dist';
  const config = webpackConfigBuilder(filename, flags, true, distShortName);
  const compiler = webpack(config);
  const dist = path.join(process.cwd(), distShortName);
  const msgImports = { log: console.log.bind(console), chalk: _chalk }; // eslint-disable-line

  builderBanner(msgImports, filename, flags);
  builderRemovingDistMsg(msgImports, dist);

  return removeDist(dist)
    .then(() => {
      builderRunningBuildMsg(msgImports);
      compiler.run(err => {
        if (err) {
          builderErrorMsg(msgImports, err);
          process.exit(1); // eslint-disable-line
        }
        builderSuccessMsg(msgImports, distShortName);
      });
    });
}
