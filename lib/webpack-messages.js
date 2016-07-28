'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearConsole = clearConsole;
exports.print = print;
exports.eslintExtraWarningMsg = eslintExtraWarningMsg;
exports.devServerInvalidBuildMsg = devServerInvalidBuildMsg;
exports.devServerCompiledSuccessfullyMsg = devServerCompiledSuccessfullyMsg;
exports.devServerFailedToCompileMsg = devServerFailedToCompileMsg;
exports.devServerCompiledWithWarningsMsg = devServerCompiledWithWarningsMsg;
exports.builderBanner = builderBanner;
exports.builderRemovingDistMsg = builderRemovingDistMsg;
exports.builderRunningBuildMsg = builderRunningBuildMsg;
exports.builderErrorMsg = builderErrorMsg;
exports.builderSuccessMsg = builderSuccessMsg;

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

/**
 * Actually prints message to whatever console passed.
 *
 * @param {Object} imports
 * @param {Function} imports.log
 * @param {String[]} msg
 *
 * @return {void}
 */
function print(_ref2, msg) {
  var log = _ref2.log;

  return log(msg.join('\n'));
}

/**
 *
 * Common Messages
 *
 */

function eslintExtraWarningMsg(_ref3) {
  var log = _ref3.log;
  var chalk = _ref3.chalk;

  return print({ log: log }, ['', 'You may use special comments to disable some warnings.', 'Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.', 'Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.']);
}

/**
 *
 * Dev Server Messages
 *
 */

function devServerInvalidBuildMsg(_ref4) {
  var log = _ref4.log;
  var chalk = _ref4.chalk;

  clearConsole({ chalk: chalk });
  return print({ log: log }, [chalk.yellow('Compiling...')]);
}

function devServerCompiledSuccessfullyMsg(_ref5, flags, ngrokUrl) {
  var log = _ref5.log;
  var chalk = _ref5.chalk;

  var msg = [chalk.magenta('Server: ') + chalk.cyan('http://' + flags.host + ':' + flags.port), '', chalk.green('Compiled successfully!')];

  if (flags.ngrok) {
    msg.push(chalk.magenta('Ngrok: ') + chalk.cyan(ngrokUrl));
  }

  return print({ log: log }, msg);
}

function devServerFailedToCompileMsg(_ref6) {
  var log = _ref6.log;
  var chalk = _ref6.chalk;

  return print({ log: log }, [chalk.red('Failed to compile.')]);
}

function devServerCompiledWithWarningsMsg(_ref7) {
  var log = _ref7.log;
  var chalk = _ref7.chalk;

  return print({ log: log }, [chalk.yellow('Compiled with warnings.')]);
}

/**
 *
 * Build Messages
 *
 */

function builderBanner(_ref8, entry, cssmodules) {
  var log = _ref8.log;
  var chalk = _ref8.chalk;

  clearConsole({ chalk: chalk });
  return print({ log: log }, [chalk.green('Building...'), '', chalk.magenta('Entry point: ') + entry, chalk.magenta('CSS Modules: ') + (cssmodules ? chalk.green('enabled') : 'disabled')]);
}

function builderRemovingDistMsg(_ref9, distPath) {
  var log = _ref9.log;
  var chalk = _ref9.chalk;

  return print({ log: log }, ['', chalk.yellow('Removing folder: ') + distPath]);
}

function builderRunningBuildMsg(_ref10) {
  var log = _ref10.log;
  var chalk = _ref10.chalk;

  return print({ log: log }, [chalk.yellow('Running webpack production build...')]);
}

function builderErrorMsg(_ref11, err) {
  var log = _ref11.log;
  var chalk = _ref11.chalk;

  var msg = err.message || err;
  if ((0, _webpackErrorHelpers.isLikelyASyntaxError)(msg)) {
    msg = (0, _webpackErrorHelpers.formatMessage)(msg);
  }

  return print({ log: log }, ['', chalk.red('Failed to create a production build. Reason:'), msg]);
}

function builderSuccessMsg(_ref12, distShortName) {
  var log = _ref12.log;
  var chalk = _ref12.chalk;

  return print({ log: log }, ['', chalk.green('Successfully generated a bundle in the ' + chalk.cyan('"' + distShortName + '"') + ' folder!'), chalk.green('The bundle is optimized and ready to be deployed to production.')]);
}