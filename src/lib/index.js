import chalk from 'chalk';
import opn from 'opn';

import createWebpackDevServer from './webpack';
import createNgrokTunnel from './ngrok';
import restartHanlder from './restart';

/**
 * Generates banner for aik.
 *
 * @param {String} filename
 * @param {Flags} flags
 * @param {String} ngrokUrl
 *
 * @return {String}
 */
export function banner(filename, flags, ngrokUrl) {
  return `
  /$$$$$$  /$$$$$$ /$$   /$$
 /$$__  $$|_  $$_/| $$  /$$/
| $$   \ $$  | $$  | $$ /$$/
| $$$$$$$$  | $$  | $$$$$/
| $$__  $$  | $$  | $$  $$
| $$  | $$  | $$  | $$\  $$
| $$  | $$ /$$$$$$| $$ \  $$
|__/  |__/|______/|__/  \__/

     ${chalk.yellow('Frontend Playground')}

${chalk.magenta('Server:')}            ${chalk.cyan(`http://${flags.host}:${flags.port}`)}
${chalk.magenta('CSS Modules:')}       ${flags.cssmodules ? chalk.green('enabled') : chalk.dim('disabled')}
${chalk.magenta('Ngrok:')}             ${flags.ngrok ? chalk.green(ngrokUrl) : chalk.dim('disabled')}
${chalk.magenta('React Hot Loader:')}  ${flags.react ? chalk.green('enabled') : chalk.dim('disabled')}
`;
}

/**
 * Aik dev server
 *
 * @param {String[]} input
 * @param {Flags} flags
 *
 * @return {Type}
 */
export default function aikDevServer(input, flags) {
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

      console.log(banner(filename, flags, ngrokUrl)); // eslint-disable-line

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
 * @typedef {Object} Flags
 * @property {String} port
 * @property {String} host
 * @property {String} react
 * @property {Boolean} ngrok
 * @property {Boolean} cssmodules
 */
