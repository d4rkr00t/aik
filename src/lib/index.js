import chalk from 'chalk';
import opn from 'opn';

import createWebpackDevServer from './webpack';
import createNgrokTunnel from './ngrok';
import restartHanlder from './restart';
import banner from './banner';

/**
 * Aik dev server
 *
 * @param {String[]} input
 * @param {Flags} flags
 * @param {Object} console
 *
 * @return {Type}
 */
export default function aikDevServer(input, flags, console) {
  const [filename] = input;
  const promiseList = [
    createWebpackDevServer(filename, flags),
    flags.ngrok && createNgrokTunnel(flags)
  ];

  return Promise
    .all(promiseList)
    .then((results) => {
      if (flags.open) {
        const [, ngrokUrl] = results;

        opn(flags.ngrok ? ngrokUrl : `http://${flags.host}:${flags.port}`);
      }

      return results;
    })
    .then((results) => {
      const [, ngrokUrl] = results;

      console.log(banner(flags, ngrokUrl, chalk)); // eslint-disable-line

      return results;
    })
    .then((results) => {
      const [server] = results;

      restartHanlder(input, flags, { prc: process, server, chalk });

      return results;
    })
    .catch((err) => {
      console.error(chalk.red(err)); // eslint-disable-line

      throw err;
    });
}

/**
 * CLI Flags
 *
 * @typedef {Object} Flags
 *
 * @property {String} port
 * @property {String} host
 * @property {String} react
 * @property {Boolean} ngrok
 * @property {Boolean} open
 * @property {Boolean} cssmodules
 */
