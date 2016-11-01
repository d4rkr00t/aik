/* @flow */

import fs from 'fs';
import readline from 'readline';
import opn from 'opn';
import outputFile from 'output-file';
import createWebpackDevServer from './webpack-dev-server';
import runWebpackBuilder from './webpack-build';
import createNgrokTunnel from './ngrok';
import createParams from './utils/params';
import { devServerFileDoesNotExistMsg, devServerInvalidBuildMsg, fileDoesNotExistMsg } from './utils/messages';

/**
 * Aik dev server command
 */
export function aikDevServer(input: string[], flags: CLIFlags): Promise<*> {
  const [filename] = input;
  const promiseList = [flags.ngrok && createNgrokTunnel(flags)];

  return new Promise((resolve, reject) => {
    try {
      fs.statSync(filename);
      resolve();
    } catch (error) {
      devServerFileDoesNotExistMsg(filename);

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('Create it? (Y/n): ', (answer: string) => {
        rl.close();
        if (!answer || answer === 'Y' || answer === 'y') {
          return resolve(true);
        }

        fileDoesNotExistMsg(filename);

        reject();
      });
    }
  })
  .then((createFile: ?boolean) => new Promise((resolve, reject) => {
    if (!createFile) {
      return resolve();
    }

    outputFile(filename, '', err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  }))
  .then(() => devServerInvalidBuildMsg())
  .then(() => Promise.all(promiseList))
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
export function aikBuild(input: string[], flags: CLIFlags): Promise<*> {
  const [filename] = input;
  const params = createParams(filename, flags, '', true);
  return runWebpackBuilder(filename, flags, params);
}
