import webpack from 'webpack';
import rimraf from 'rimraf';
import path from 'path';
import { isString } from 'lodash';
import _chalk from 'chalk';
import webpackConfigBuilder from './webpack-config-prod';

import {
  webpackBuilderBanner,
  webpackBuilderRemovingDistMsg,
  webpackBuilderRunningBuildMsg,
  webpackBuilderErrorMsg,
  webpackBuilderSuccessMsg
} from './webpack-messages';

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
  const config = webpackConfigBuilder(filename, flags, distShortName);
  const compiler = webpack(config);
  const dist = path.join(process.cwd(), distShortName);
  const msgImports = { log: console.log.bind(console), chalk: _chalk }; // eslint-disable-line

  webpackBuilderBanner(msgImports, filename, flags.cssmodules);
  webpackBuilderRemovingDistMsg(msgImports, dist);

  return removeDist(dist)
    .then(() => {
      webpackBuilderRunningBuildMsg(msgImports);
      compiler.run(err => {
        if (err) {
          webpackBuilderErrorMsg(msgImports, err);
          process.exit(1); // eslint-disable-line
        }
        webpackBuilderSuccessMsg(msgImports, distShortName);
      });
    });
}
