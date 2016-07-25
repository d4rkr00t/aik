/**
 * Generates banner for aik.
 *
 * @param {Flags} flags
 * @param {String} ngrokUrl
 * @param {Object} chalk
 *
 * @return {String}
 */
export default function banner(flags, ngrokUrl, chalk) {
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

${chalk.magenta('CSS Modules:')}       ${flags.cssmodules ? chalk.green('enabled') : chalk.dim('disabled')}
${chalk.magenta('Ngrok:')}             ${flags.ngrok ? chalk.green(ngrokUrl) : chalk.dim('disabled')}
${chalk.magenta('React Hot Loader:')}  ${flags.react ? chalk.green('enabled') : chalk.dim('disabled')}
`;
}
