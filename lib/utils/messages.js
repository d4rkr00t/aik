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

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _errorHelpers = require('./error-helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Moves current line to the most top of console.
 */
function clearConsole(sep) {
  sep && process.stdout.write(_chalk2.default.dim('----------------------------------\n'));
  process.stdout.write('\x1B[2J\x1B[0f');
}

/**
 * Actually prints message to the console
 */
function print(msg) {
  return console.log(msg.join('\n')); // eslint-disable-line
}

/**
 *
 * Common Messages
 *
 */

function eslintExtraWarningMsg() {
  return print(['', 'You may use special comments to disable some warnings.', 'Use ' + _chalk2.default.yellow('// eslint-disable-next-line') + ' to ignore the next line.', 'Use ' + _chalk2.default.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.']);
}

/**
 *
 * Dev Server Messages
 *
 */

function devServerBanner(filename, flags, params) {
  const msg = [_chalk2.default.green('Watching...'), '', _chalk2.default.magenta('Entry point:      ') + filename];

  if (params.template.short) {
    msg.push(_chalk2.default.magenta('Custom template:  ') + params.template.short);
  }

  msg.push(_chalk2.default.magenta('Server:           ') + _chalk2.default.cyan(`http://${ flags.host }:${ flags.port }`));

  if (params.ngrok) {
    msg.push(_chalk2.default.magenta('Ngrok:            ') + _chalk2.default.cyan(params.ngrok));
  }

  if (flags.cssmodules) {
    msg.push(_chalk2.default.magenta('CSS Modules:      ') + _chalk2.default.yellow('enabled'));
  }

  if (flags.react) {
    msg.push(_chalk2.default.magenta('React Hot Loader: ') + _chalk2.default.yellow('enabled'));
  }

  return msg;
}

function devServerInvalidBuildMsg() {
  clearConsole();
  return print([_chalk2.default.yellow('Compiling...')]);
}

function devServerCompiledSuccessfullyMsg(filename, flags, params) {
  const msg = devServerBanner(filename, flags, params);
  msg.push('', _chalk2.default.green('Compiled successfully!'));
  return print(msg);
}

function devServerFailedToCompileMsg(filename, flags, params) {
  const msg = devServerBanner(filename, flags, params);
  msg.push('', _chalk2.default.red('Failed to compile.'));
  return print(msg);
}

function devServerCompiledWithWarningsMsg(filename, flags, params) {
  const msg = devServerBanner(filename, flags, params);
  msg.push('', _chalk2.default.yellow('Compiled with warnings.'));
  return print(msg);
}

/**
 *
 * Build Messages
 *
 */

function builderBanner(filename, flags, params) {
  clearConsole();

  const msg = [_chalk2.default.green('Building...'), '', _chalk2.default.magenta('Entry point:     ') + filename];

  if (params.template.short) {
    msg.push(_chalk2.default.magenta('Custom template: ') + params.template.short);
  }

  const base = flags.base;
  if (base && typeof base === 'string') {
    msg.push(_chalk2.default.magenta('Base path:       ') + base);
  }

  msg.push(_chalk2.default.magenta('CSS Modules:     ') + (flags.cssmodules ? _chalk2.default.green('enabled') : 'disabled'));

  return print(msg);
}

function builderRemovingDistMsg(distPath) {
  return print(['', _chalk2.default.yellow('Removing folder: ') + distPath]);
}

function builderRunningBuildMsg() {
  return print([_chalk2.default.yellow('Running webpack production build...')]);
}

function builderErrorMsg(err) {
  let msg = typeof err.message === 'string' ? err.message : err.toString();

  if ((0, _errorHelpers.isLikelyASyntaxError)(msg)) {
    msg = (0, _errorHelpers.formatMessage)(msg);
  }

  return print(['', _chalk2.default.red('Failed to create a production build. Reason:'), msg]);
}

function builderSuccessMsg(distShortName) {
  return print(['', _chalk2.default.green(`Successfully generated a bundle in the ${ _chalk2.default.cyan('"' + distShortName + '"') } folder!`), _chalk2.default.green('The bundle is optimized and ready to be deployed to production.')]);
}