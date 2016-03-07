'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = banner;
/**
 * Generates banner for aik.
 *
 * @param {Flags} flags
 * @param {String} ngrokUrl
 * @param {Object} chalk
 *
 * @return {String}
 */
function banner(flags, ngrokUrl, chalk) {
  return '\n  /$$$$$$  /$$$$$$ /$$   /$$\n /$$__  $$|_  $$_/| $$  /$$/\n| $$    $$  | $$  | $$ /$$/\n| $$$$$$$$  | $$  | $$$$$/\n| $$__  $$  | $$  | $$  $$\n| $$  | $$  | $$  | $$  $$\n| $$  | $$ /$$$$$$| $$   $$\n|__/  |__/|______/|__/  __/\n\n     ' + chalk.yellow('Frontend Playground') + '\n\n' + chalk.magenta('Server:') + '            ' + chalk.cyan('http://' + flags.host + ':' + flags.port) + '\n' + chalk.magenta('CSS Modules:') + '       ' + (flags.cssmodules ? chalk.green('enabled') : chalk.dim('disabled')) + '\n' + chalk.magenta('Ngrok:') + '             ' + (flags.ngrok ? chalk.green(ngrokUrl) : chalk.dim('disabled')) + '\n' + chalk.magenta('React Hot Loader:') + '  ' + (flags.react ? chalk.green('enabled') : chalk.dim('disabled')) + '\n';
}