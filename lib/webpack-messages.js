'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearConsole = clearConsole;
exports.print = print;
exports.smallBanner = smallBanner;
exports.compiling = compiling;
exports.compiledSuccessfully = compiledSuccessfully;
exports.failedToCompile = failedToCompile;
exports.compiledWithWarnings = compiledWithWarnings;
exports.eslintExtraWarning = eslintExtraWarning;
exports.webpackBuilderBanner = webpackBuilderBanner;
exports.webpackBuilderRemovingDistMsg = webpackBuilderRemovingDistMsg;
exports.webpackBuilderRunningBuildMsg = webpackBuilderRunningBuildMsg;
exports.webpackBuilderErrorMsg = webpackBuilderErrorMsg;
exports.webpackBuilderSuccessMsg = webpackBuilderSuccessMsg;

var _webpackErrorHelpers = require('./webpack-error-helpers');

/**
 * Moves current line to the most top of console.
 *
 * @param {Object} imports
 * @param {Boolean} sep
 */
function clearConsole(_ref, sep) {
  var chalk = _ref.chalk;

  sep && process.stdout.write(chalk.dim('----------------------------------\n'));
  process.stdout.write('\x1B[2J\x1B[0f');
}

function print(_ref2, msg) {
  var log = _ref2.log;

  return log(msg.join('\n'));
}

function smallBanner(chalk, flags, ngrokUrl) {
  var msg = [chalk.magenta('Server:') + ' ' + chalk.cyan('http://' + flags.host + ':' + flags.port)];

  if (flags.ngrok) {
    msg.push(chalk.magenta('Ngrok:') + ' ' + chalk.cyan(ngrokUrl));
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

function webpackBuilderBanner(_ref3, entry, cssmodules) {
  var log = _ref3.log;
  var chalk = _ref3.chalk;

  clearConsole({ chalk: chalk });
  return print({ log: log }, [chalk.green('Building...'), '', chalk.magenta('Entry point: ') + entry, chalk.magenta('CSS Modules: ') + (cssmodules ? chalk.green('enabled') : 'disabled')]);
}

function webpackBuilderRemovingDistMsg(_ref4, distPath) {
  var log = _ref4.log;
  var chalk = _ref4.chalk;

  return print({ log: log }, ['', chalk.yellow('Removing folder: ') + distPath]);
}

function webpackBuilderRunningBuildMsg(_ref5) {
  var log = _ref5.log;
  var chalk = _ref5.chalk;

  return print({ log: log }, [chalk.yellow('Running webpack production build...')]);
}

function webpackBuilderErrorMsg(_ref6, err) {
  var log = _ref6.log;
  var chalk = _ref6.chalk;

  var msg = err.message || err;
  if ((0, _webpackErrorHelpers.isLikelyASyntaxError)(msg)) {
    msg = (0, _webpackErrorHelpers.formatMessage)(msg);
  }

  return print({ log: log }, ['', chalk.red('Failed to create a production build. Reason:'), msg]);
}

function webpackBuilderSuccessMsg(_ref7, distShortName) {
  var log = _ref7.log;
  var chalk = _ref7.chalk;

  return print({ log: log }, ['', chalk.green('Successfully generated a bundle in the ' + chalk.cyan('"' + distShortName + '"') + ' folder!'), chalk.green('The bundle is optimized and ready to be deployed to production.')]);
}