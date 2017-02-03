'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearConsole = clearConsole;
exports.print = print;
exports.doneBadge = doneBadge;
exports.warningBadge = warningBadge;
exports.waitBadge = waitBadge;
exports.errorBadge = errorBadge;
exports.eslintExtraWarningMsg = eslintExtraWarningMsg;
exports.fileDoesNotExistMsg = fileDoesNotExistMsg;
exports.devServerBanner = devServerBanner;
exports.devServerInvalidBuildMsg = devServerInvalidBuildMsg;
exports.devServerCompiledSuccessfullyMsg = devServerCompiledSuccessfullyMsg;
exports.devServerFailedToCompileMsg = devServerFailedToCompileMsg;
exports.devServerCompiledWithWarningsMsg = devServerCompiledWithWarningsMsg;
exports.devServerFileDoesNotExistMsg = devServerFileDoesNotExistMsg;
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
  process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H');
}

/**
 * Actually prints message to the console
 */
function print(msg) {
  return console.log(msg.join('\n')); // eslint-disable-line
}

/**
 *
 *
 * Helpers
 *
 */

function doneBadge() {
  return _chalk2.default.bgGreen.black(' DONE ');
}

function warningBadge() {
  return _chalk2.default.bgYellow.black(' WARNING ');
}

function waitBadge() {
  return _chalk2.default.bgBlue.black(' WAIT ');
}

function errorBadge() {
  return _chalk2.default.bgRed.black(' ERROR ');
}

/**
 *
 * Common Messages
 *
 */

function eslintExtraWarningMsg() {
  return print(['You may use special comments to disable some warnings.', 'Use ' + _chalk2.default.yellow('// eslint-disable-next-line') + ' to ignore the next line.', 'Use ' + _chalk2.default.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.']);
}

function fileDoesNotExistMsg(filename) {
  clearConsole();
  return print([errorBadge() + _chalk2.default.red(' File doesn\'t exist.'), '', `You are trying to use ${_chalk2.default.yellow('"' + filename + '"')} as entry point, but this file doesn't exist.`, `Please, choose existing file or create ${_chalk2.default.yellow('"' + filename + '"')} manualy.`]);
}

/**
 *
 * Dev Server Messages
 *
 */

function devServerBanner(filename, flags, params) {
  const msg = ['', _chalk2.default.magenta('Entry point:      ') + filename];

  if (params.template.short) {
    msg.push(_chalk2.default.magenta('Custom template:  ') + params.template.short);
  }

  msg.push(_chalk2.default.magenta('Server:           ') + _chalk2.default.cyan(`http://${flags.host}:${flags.port}`));

  if (flags.oldPort) {
    msg.push(_chalk2.default.magenta('Port changed:     ') + `${_chalk2.default.bgRed.black(' ' + flags.oldPort + ' ')} -> ${_chalk2.default.bgGreen.black(' ' + flags.port + ' ')}`);
  }

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
  return print([waitBadge() + ' ' + _chalk2.default.blue('Compiling...')]);
}

function devServerCompiledSuccessfullyMsg(filename, flags, params, buildDuration) {
  // eslint-disable-line
  const msg = devServerBanner(filename, flags, params);
  msg.unshift(doneBadge() + ' ' + _chalk2.default.green(`Compiled successfully in ${buildDuration}ms!`));
  return print(msg);
}

function devServerFailedToCompileMsg() {
  clearConsole(true);
  return print([errorBadge() + ' ' + _chalk2.default.red('Failed to compile.')]);
}

function devServerCompiledWithWarningsMsg(filename, flags, params, buildDuration) {
  // eslint-disable-line
  const msg = devServerBanner(filename, flags, params);
  msg.unshift(warningBadge() + ' ' + _chalk2.default.yellow(`Compiled with warnings in ${buildDuration}ms.`));
  msg.push('', _chalk2.default.dim('---------'));
  return print(msg);
}

function devServerFileDoesNotExistMsg(filename) {
  clearConsole();
  return print([warningBadge() + ` File "${_chalk2.default.yellow(filename)}" doesn\'t exist.`, '']);
}

/**
 *
 * Build Messages
 *
 */

function builderBanner(filename, flags, params) {
  clearConsole();

  const msg = [waitBadge() + ' ' + _chalk2.default.blue('Building...'), '', _chalk2.default.magenta('Entry point:     ') + filename];

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
  clearConsole(true);

  let msg = typeof err.message === 'string' ? err.message : err.toString();

  if ((0, _errorHelpers.isLikelyASyntaxError)(msg)) {
    msg = (0, _errorHelpers.formatMessage)(msg);
  }
  return print([errorBadge() + ' ' + _chalk2.default.red('Failed to create a production build. Reason:'), msg]);
}

function builderSuccessMsg(distShortName, buildStats) {
  clearConsole(true);

  const assets = buildStats.assets;
  const longestNameSize = assets.reduce((acc, item) => item.name.length > acc ? item.name.length : acc, 0) + 1;
  const padStringPlaceholder = ' '.repeat(longestNameSize);
  const padString = (placeholder, str) => (str + placeholder).substr(0, placeholder.length);

  return print([doneBadge() + ` in ${buildStats.buildDuration}ms`, '', _chalk2.default.green(`Successfully generated a bundle in the ${_chalk2.default.cyan('"' + distShortName + '"')} folder!`), _chalk2.default.green('The bundle is optimized and ready to be deployed to production.'), '', _chalk2.default.bgMagenta.black(' ASSETS '), '', buildStats.assets.map(asset => {
    return [`${_chalk2.default.magenta(padString(padStringPlaceholder, asset.name + ':'))}`, `${asset.size.toFixed(2)}kb, ${asset.sizeGz.toFixed(2)}kb gzip`].join(' ');
  }).join('\n')]);
}