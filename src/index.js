/* @flow */

import opn from 'opn';

import createWebpackDevServer from './webpack-dev-server';
import runWebpackBuilder from './webpack-build';
import createNgrokTunnel from './ngrok';
import createParams from './utils/params';
import { devServerInvalidBuildMsg } from './utils/messages';

/**
 * Aik dev server command
 */
export function aikDevServer(input: string[], flags: CLIFlags) : Promise<*> {
  devServerInvalidBuildMsg();

  const [filename] = input;
  const promiseList = [flags.ngrok && createNgrokTunnel(flags)];

  return Promise
    .all(promiseList)
    .then(([ngrokUrl: NgrokUrl]) => {
      const params = createParams(filename, flags, ngrokUrl, false);
      return createWebpackDevServer(filename, flags, params)
        .then(server => [server, ngrokUrl]);
    })
    .then((results) => {
      const ngrokUrl: NgrokUrl = results[1];
      if (flags.open) {
        opn(ngrokUrl ? ngrokUrl : `http://${flags.host}:${flags.port}`);
      }
      return results;
    });
}

/**
 * Aik build command
 */
export function aikBuild(input: string[], flags: CLIFlags) : Promise<*> {
  const [filename] = input;
  const params = createParams(filename, flags, '', true);
  return runWebpackBuilder(filename, flags, params);
}
