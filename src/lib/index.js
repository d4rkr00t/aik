/* @flow */

import chalk from 'chalk';
import opn from 'opn';

import createWebpackDevServer from './webpack-dev-server';
import runWebpackBuilder from './webpack-build';
import createNgrokTunnel from './ngrok';
import restartHanlder from './restart';

/**
 * Aik dev server command
 */
export function aikDevServer(input:string[], flags:CLIFlags, console:Console) : Promise<*> {
  const [filename] = input;
  const promiseList = [flags.ngrok && createNgrokTunnel(flags)];

  return Promise
    .all(promiseList)
    .then(([ngrokUrl:NgrokUrl]) => {
      return createWebpackDevServer(filename, flags, ngrokUrl, console)
        .then(server => [server, ngrokUrl]);
    })
    .then((results) => {
      if (flags.open) {
        const [, ngrokUrl:NgrokUrl] = results;
        opn(flags.ngrok ? ngrokUrl : `http://${flags.host}:${flags.port}`);
      }
      return results;
    })
    .then((results) => {
      const [server] = results;
      restartHanlder({ prc: process, server, chalk });
      return results;
    });
}

/**
 * Aik build command
 */
export function aikBuild(input:string[], flags:CLIFlags, console:Console) : Promise<*> {
  const [filename] = input;
  return runWebpackBuilder(filename, flags, console);
}
