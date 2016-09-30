/* @flow */

import chalk from 'chalk';
import { isLikelyASyntaxError, formatMessage } from './error-helpers';

/**
 * Moves current line to the most top of console.
 */
export function clearConsole(sep?:boolean) {
  sep && process.stdout.write(chalk.dim('----------------------------------\n'));
  process.stdout.write('\x1B[2J\x1B[0f');
}

/**
 * Actually prints message to the console
 */
export function print(msg:string[]) {
  return console.log(msg.join('\n'));
}

/**
 *
 * Common Messages
 *
 */

export function eslintExtraWarningMsg() {
  return print([
    '',
    'You may use special comments to disable some warnings.',
    'Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.',
    'Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.'
  ]);
}

/**
 *
 * Dev Server Messages
 *
 */

export function devServerBanner(filename:string, flags:CLIFlags, params:AikParams) : string[] {
  const msg:string[] = [
    chalk.green('Watching...'),
    '',
    chalk.magenta('Entry point:      ') + filename
  ];

  if (params.template.short) {
    msg.push(chalk.magenta('Custom template:  ') + params.template.short);
  }

  msg.push(chalk.magenta('Server:           ') + chalk.cyan(`http://${flags.host}:${flags.port}`));

  if (params.ngrok) {
    msg.push(chalk.magenta('Ngrok:            ') + chalk.cyan(params.ngrok));
  }

  if (flags.cssmodules) {
    msg.push(chalk.magenta('CSS Modules:      ') + chalk.yellow('enabled'));
  }

  if (flags.react) {
    msg.push(chalk.magenta('React Hot Loader: ') + chalk.yellow('enabled'));
  }

  return msg;
}

export function devServerInvalidBuildMsg() {
  clearConsole();
  return print([chalk.yellow('Compiling...')]);
}

export function devServerCompiledSuccessfullyMsg(filename:string, flags:CLIFlags, params:AikParams) {
  const msg = devServerBanner(filename, flags, params);
  msg.push('', chalk.green('Compiled successfully!'));
  return print(msg);
}

export function devServerFailedToCompileMsg(filename:string, flags:CLIFlags, params:AikParams) {
  const msg = devServerBanner(filename, flags, params);
  msg.push('', chalk.red('Failed to compile.'));
  return print(msg);
}

export function devServerCompiledWithWarningsMsg(filename:string, flags:CLIFlags, params:AikParams) {
  const msg = devServerBanner(filename, flags, params);
  msg.push('', chalk.yellow('Compiled with warnings.'));
  return print(msg);
}

/**
 *
 * Build Messages
 *
 */

export function builderBanner(filename:string, flags:CLIFlags, params:AikParams) {
  clearConsole();

  const msg = [
    chalk.green('Building...'),
    '',
    chalk.magenta('Entry point:     ') + filename
  ];


  if (params.template.short) {
    msg.push(chalk.magenta('Custom template: ') + params.template.short)
  }

  const base = flags.base;
  if (base  && typeof base === 'string') {
    msg.push(chalk.magenta('Base path:       ') + base);
  }

  msg.push(chalk.magenta('CSS Modules:     ') + (flags.cssmodules ? chalk.green('enabled') : 'disabled'));

  return print(msg);
}

export function builderRemovingDistMsg(distPath:string) {
  return print([
    '',
    chalk.yellow('Removing folder: ') + distPath
  ]);
}

export function builderRunningBuildMsg() {
  return print([
    chalk.yellow('Running webpack production build...')
  ]);
}

export function builderErrorMsg(err:{ message: string } | string) {
  let msg:string = typeof err.message === 'string' ? err.message : err.toString();

  if (isLikelyASyntaxError(msg)) {
    msg = formatMessage(msg);
  }

  return print([
    '',
    chalk.red('Failed to create a production build. Reason:'),
    msg
  ]);
}

export function builderSuccessMsg(distShortName:string) {
  return print([
    '',
    chalk.green(`Successfully generated a bundle in the ${chalk.cyan('"' + distShortName + '"')} folder!`),
    chalk.green('The bundle is optimized and ready to be deployed to production.')
  ]);
}
