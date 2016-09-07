'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearConsole = clearConsole;
exports.print = print;
exports.eslintExtraWarningMsg = eslintExtraWarningMsg;
exports.devServerBanner = devServerBanner;
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

function devServerBanner(_ref4, flags, entry, ngrokUrl) {
  var chalk = _ref4.chalk;

  var msg = ['', chalk.magenta('Entry point:      ') + entry, chalk.magenta('Server:           ') + chalk.cyan('http://' + flags.host + ':' + flags.port)];

  if (flags.ngrok) {
    msg.push(chalk.magenta('Ngrok:            ') + chalk.cyan(ngrokUrl));
  }

  if (flags.cssmodules) {
    msg.push(chalk.magenta('CSS Modules:      ') + chalk.yellow('enabled'));
  }

  if (flags.react) {
    msg.push(chalk.magenta('React Hot Loader: ') + chalk.yellow('enabled'));
  }

  return msg;
}

function devServerInvalidBuildMsg(_ref5) {
  var log = _ref5.log;
  var chalk = _ref5.chalk;

  clearConsole({ chalk: chalk });
  return print({ log: log }, [chalk.yellow('Compiling...')]);
}

function devServerCompiledSuccessfullyMsg(_ref6, flags, entry, ngrokUrl) {
  var log = _ref6.log;
  var chalk = _ref6.chalk;

  var msg = devServerBanner({ chalk: chalk }, flags, entry, ngrokUrl);
  msg.push('', chalk.green('Compiled successfully!'));
  return print({ log: log }, msg);
}

function devServerFailedToCompileMsg(_ref7, flags, entry, ngrokUrl) {
  var log = _ref7.log;
  var chalk = _ref7.chalk;

  var msg = devServerBanner({ chalk: chalk }, flags, entry, ngrokUrl);
  msg.push('', chalk.red('Failed to compile.'));
  return print({ log: log }, msg);
}

function devServerCompiledWithWarningsMsg(_ref8, flags, entry, ngrokUrl) {
  var log = _ref8.log;
  var chalk = _ref8.chalk;

  var msg = devServerBanner({ chalk: chalk }, flags, entry, ngrokUrl);
  msg.push('', chalk.yellow('Compiled with warnings.'));
  return print({ log: log }, msg);
}

/**
 *
 * Build Messages
 *
 */

function builderBanner(_ref9, entry, cssmodules) {
  var log = _ref9.log;
  var chalk = _ref9.chalk;

  clearConsole({ chalk: chalk });
  return print({ log: log }, [chalk.green('Building...'), '', chalk.magenta('Entry point: ') + entry, chalk.magenta('CSS Modules: ') + (cssmodules ? chalk.green('enabled') : 'disabled')]);
}

function builderRemovingDistMsg(_ref10, distPath) {
  var log = _ref10.log;
  var chalk = _ref10.chalk;

  return print({ log: log }, ['', chalk.yellow('Removing folder: ') + distPath]);
}

function builderRunningBuildMsg(_ref11) {
  var log = _ref11.log;
  var chalk = _ref11.chalk;

  return print({ log: log }, [chalk.yellow('Running webpack production build...')]);
}

function builderErrorMsg(_ref12, err) {
  var log = _ref12.log;
  var chalk = _ref12.chalk;

  var msg = err.message || err;
  if ((0, _webpackErrorHelpers.isLikelyASyntaxError)(msg)) {
    msg = (0, _webpackErrorHelpers.formatMessage)(msg);
  }

  return print({ log: log }, ['', chalk.red('Failed to create a production build. Reason:'), msg]);
}

function builderSuccessMsg(_ref13, distShortName) {
  var log = _ref13.log;
  var chalk = _ref13.chalk;

  return print({ log: log }, ['', chalk.green('Successfully generated a bundle in the ' + chalk.cyan('"' + distShortName + '"') + ' folder!'), chalk.green('The bundle is optimized and ready to be deployed to production.')]);
}