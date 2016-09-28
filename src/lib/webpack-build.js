/* @flow */

import webpack from 'webpack';
import rimraf from 'rimraf';
import path from 'path';
import _chalk from 'chalk';
import webpackConfigBuilder from './webpack/config';
import { getTemplatePath } from './webpack/config/helpers';
import {
  builderBanner,
  builderRemovingDistMsg,
  builderRunningBuildMsg,
  builderErrorMsg,
  builderSuccessMsg
} from './webpack/messages';

/**
 * Removes distribute folder to prevent duplicates.
 */
export function removeDist(distPath:string) : Promise<*> {
  return new Promise(resolve => rimraf(distPath, resolve));
}

/**
 * Builds project using webpack.
 */
export default function runWebpackBuilder(filename:string, flags:CLIFlags, console:Object) : Promise<*> {
  const template = getTemplatePath(filename);
  const templateRelative = path.relative(process.cwd(), template);
  const distShortName = typeof flags.build === 'string' ? flags.build : 'dist';
  const config = webpackConfigBuilder(filename, flags, true, template, distShortName);
  const compiler = webpack(config);
  const dist = path.join(process.cwd(), distShortName);
  const msgImports = { log: console.log.bind(console), chalk: _chalk }; // eslint-disable-line

  builderBanner(msgImports, flags, filename, templateRelative);
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
