'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.smallBanner = smallBanner;
exports.compiling = compiling;
exports.compiledSuccessfully = compiledSuccessfully;
exports.failedToCompile = failedToCompile;
exports.compiledWithWarnings = compiledWithWarnings;
exports.eslintExtraWarning = eslintExtraWarning;
function smallBanner(chalk, flags, ngrokUrl) {
  var msg = [chalk.magenta('Server:') + ' ' + chalk.cyan('http://' + flags.host + ':' + flags.port)];

  if (flags.ngrok) {
    msg.push(chalk.magenta('Ngrok:') + '  ' + chalk.cyan(ngrokUrl));
  }

  return msg.join('\n');
}

function compiling(chalk) {
  return [chalk.yellow('Compiling...')].join('\n');
}

function compiledSuccessfully(chalk, flags, ngrokUrl) {
  return [smallBanner(chalk, flags, ngrokUrl), '', chalk.green('Compiled successfully!')].join('\n');
}

function failedToCompile(chalk) {
  return [chalk.red('Failed to compile.')].join('\n');
}

function compiledWithWarnings(chalk) {
  return [chalk.yellow('Compiled with warnings.')].join('\n');
}

function eslintExtraWarning(chalk) {
  return ['', 'You may use special comments to disable some warnings.', 'Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.', 'Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.'].join('\n');
}