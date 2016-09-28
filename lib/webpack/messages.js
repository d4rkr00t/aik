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

var _errorHelpers = require('./error-helpers');

/**
 * Moves current line to the most top of console.
 */
function clearConsole(imports, sep) {
  sep && process.stdout.write(imports.chalk.dim('----------------------------------\n'));
  process.stdout.write('\x1B[2J\x1B[0f');
}

/**
 * Actually prints message to whatever console passed.
 */


function print(imports, msg) {
  return imports.log(msg.join('\n'));
}

/**
 *
 * Common Messages
 *
 */

function eslintExtraWarningMsg(imports) {
  var chalk = imports.chalk;
  var log = imports.log;

  return print(imports, ['', 'You may use special comments to disable some warnings.', 'Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.', 'Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.']);
}

/**
 *
 * Dev Server Messages
 *
 */

function devServerBanner(imports, flags, entry, ngrokUrl, template) {
  var chalk = imports.chalk;

  var msg = [chalk.green('Watching...'), '', chalk.magenta('Entry point:      ') + entry];

  if (template) {
    msg.push(chalk.magenta('Custom template:  ') + template);
  }

  msg.push(chalk.magenta('Server:           ') + chalk.cyan('http://' + flags.host + ':' + flags.port));

  if (ngrokUrl) {
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

function devServerInvalidBuildMsg(imports) {
  var log = imports.log;
  var chalk = imports.chalk;

  clearConsole(imports);
  return print(imports, [chalk.yellow('Compiling...')]);
}

function devServerCompiledSuccessfullyMsg(imports, flags, entry, ngrokUrl, template) {
  var chalk = imports.chalk;
  var log = imports.log;

  var msg = devServerBanner(imports, flags, entry, ngrokUrl, template);
  msg.push('', chalk.green('Compiled successfully!'));
  return print(imports, msg);
}

function devServerFailedToCompileMsg(imports, flags, entry, ngrokUrl, template) {
  var chalk = imports.chalk;
  var log = imports.log;

  var msg = devServerBanner(imports, flags, entry, ngrokUrl, template);
  msg.push('', chalk.red('Failed to compile.'));
  return print(imports, msg);
}

function devServerCompiledWithWarningsMsg(imports, flags, entry, ngrokUrl, template) {
  var chalk = imports.chalk;
  var log = imports.log;

  var msg = devServerBanner(imports, flags, entry, ngrokUrl, template);
  msg.push('', chalk.yellow('Compiled with warnings.'));
  return print(imports, msg);
}

/**
 *
 * Build Messages
 *
 */

function builderBanner(imports, flags, entry, template) {
  var chalk = imports.chalk;
  var log = imports.log;


  clearConsole(imports);

  var msg = [chalk.green('Building...'), '', chalk.magenta('Entry point:     ') + entry];

  if (template) {
    msg.push(chalk.magenta('Custom template: ') + template);
  }

  var base = flags.base;
  if (base && typeof base === 'string') {
    msg.push(chalk.magenta('Base path: ') + base);
  }

  msg.push(chalk.magenta('CSS Modules:     ') + (flags.cssmodules ? chalk.green('enabled') : 'disabled'));

  return print(imports, msg);
}

function builderRemovingDistMsg(imports, distPath) {
  var chalk = imports.chalk;
  var log = imports.log;

  return print(imports, ['', chalk.yellow('Removing folder: ') + distPath]);
}

function builderRunningBuildMsg(imports) {
  var chalk = imports.chalk;
  var log = imports.log;

  return print(imports, [chalk.yellow('Running webpack production build...')]);
}

function builderErrorMsg(imports, err) {
  var chalk = imports.chalk;
  var log = imports.log;

  var msg = typeof err.message === 'string' ? err.message : err.toString();
  if ((0, _errorHelpers.isLikelyASyntaxError)(msg)) {
    msg = (0, _errorHelpers.formatMessage)(msg);
  }

  return print(imports, ['', chalk.red('Failed to create a production build. Reason:'), msg]);
}

function builderSuccessMsg(imports, distShortName) {
  var chalk = imports.chalk;
  var log = imports.log;

  return print(imports, ['', chalk.green('Successfully generated a bundle in the ' + chalk.cyan('"' + distShortName + '"') + ' folder!'), chalk.green('The bundle is optimized and ready to be deployed to production.')]);
}