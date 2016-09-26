/* @flow */

import { isLikelyASyntaxError, formatMessage } from './error-helpers';

/**
 * Moves current line to the most top of console.
 */
export function clearConsole(imports:WebpackMessageImports, sep?:boolean) {
  sep && process.stdout.write(imports.chalk.dim('----------------------------------\n'));
  process.stdout.write('\x1B[2J\x1B[0f');
}

/**
 * Actually prints message to whatever console passed.
 */
export function print(imports:WebpackMessageImports, msg:string[]) {
  return imports.log(msg.join('\n'));
}

/**
 *
 * Common Messages
 *
 */

export function eslintExtraWarningMsg(imports:WebpackMessageImports) {
  const { chalk, log } = imports;
  return print(imports, [
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

export function devServerBanner(imports:WebpackMessageImports, flags:CLIFlags, entry:string, ngrokUrl:NgrokUrl) : string[] {
  const { chalk } = imports;
  const msg:string[] = [
    '',
    chalk.magenta('Entry point:      ') + entry,
    chalk.magenta('Server:           ') + chalk.cyan(`http://${flags.host}:${flags.port}`)
  ];

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

export function devServerInvalidBuildMsg(imports:WebpackMessageImports) {
  const { log, chalk } = imports;
  clearConsole(imports);
  return print(imports, [
    chalk.yellow('Compiling...')
  ]);
}

export function devServerCompiledSuccessfullyMsg(imports:WebpackMessageImports, flags:CLIFlags, entry:string, ngrokUrl:NgrokUrl) {
  const { chalk, log } = imports;
  const msg = devServerBanner(imports, flags, entry, ngrokUrl);
  msg.push('', chalk.green('Compiled successfully!'));
  return print(imports, msg);
}

export function devServerFailedToCompileMsg(imports:WebpackMessageImports, flags:CLIFlags, entry:string, ngrokUrl:NgrokUrl) {
  const { chalk, log } = imports;
  const msg = devServerBanner(imports, flags, entry, ngrokUrl);
  msg.push('', chalk.red('Failed to compile.'));
  return print(imports, msg);
}

export function devServerCompiledWithWarningsMsg(imports:WebpackMessageImports, flags:CLIFlags, entry:string, ngrokUrl:NgrokUrl) {
  const { chalk, log } = imports;
  const msg = devServerBanner(imports, flags, entry, ngrokUrl);
  msg.push('', chalk.yellow('Compiled with warnings.'));
  return print(imports, msg);
}

/**
 *
 * Build Messages
 *
 */

export function builderBanner(imports:WebpackMessageImports, flags:CLIFlags, entry:string) {
  const { chalk, log } = imports;

  clearConsole(imports);

  const msg = [
    chalk.green('Building...'),
    '',
    chalk.magenta('Entry point: ') + entry
  ];

  const base = flags.base;
  if (base  && typeof base === 'string') {
    msg.push(chalk.magenta('Base path: ') + base);
  }

  msg.push(chalk.magenta('CSS Modules: ') + (flags.cssmodules ? chalk.green('enabled') : 'disabled'));

  return print(imports, msg);
}

export function builderRemovingDistMsg(imports:WebpackMessageImports, distPath:string) {
  const { chalk, log } = imports;
  return print(imports, [
    '',
    chalk.yellow('Removing folder: ') + distPath
  ]);
}

export function builderRunningBuildMsg(imports:WebpackMessageImports) {
  const { chalk, log } = imports;
  return print(imports, [
    chalk.yellow('Running webpack production build...')
  ]);
}

export function builderErrorMsg(imports:WebpackMessageImports, err:{ message: string } | string) {
  const { chalk, log } = imports;
  let msg:string = typeof err.message === 'string' ? err.message : err.toString();
  if (isLikelyASyntaxError(msg)) {
    msg = formatMessage(msg);
  }

  return print(imports, [
    '',
    chalk.red('Failed to create a production build. Reason:'),
    msg
  ]);
}

export function builderSuccessMsg(imports:WebpackMessageImports, distShortName:string) {
  const { chalk, log } = imports;
  return print(imports, [
    '',
    chalk.green(`Successfully generated a bundle in the ${chalk.cyan('"' + distShortName + '"')} folder!`),
    chalk.green('The bundle is optimized and ready to be deployed to production.')
  ]);
}
