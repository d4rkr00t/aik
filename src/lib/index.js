import chalk from 'chalk';

import createWebpackDevServer from './webpack';
import createNgrokTunnel from './ngrok';

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

${chalk.magenta('Server:')}       ${chalk.cyan(`http://${flags.host}:${flags.port}`)}
${chalk.magenta('CSS Modules:')}  ${flags.cssmodules ? chalk.green('enabled') : chalk.dim('disabled')}
${chalk.magenta('Ngrok:')}        ${flags.ngrok ? chalk.green(ngrokUrl) : chalk.dim('disabled')}
`;
}

/**
 * Aik dev server
 *
 * @param {String[]} input
 * @param {Object} flags
 * @param {String} flags.port
 * @param {String} flags.host
 * @param {Boolean} flags.ngrok
 * @param {Boolean} flags.cssmodules
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
    .then(([, ngrokUrl]) => {
      console.log(banner(filename, flags, ngrokUrl)); // eslint-disable-line
    })
    .catch((err) => {
      console.error(chalk.red(err)); // eslint-disable-line

      throw err;
    });
}
