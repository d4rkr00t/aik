import { isLikelyASyntaxError, formatMessage } from './webpack-error-helpers';

/**
 * Moves current line to the most top of console.
 *
 * @param {Object} imports
 * @param {Boolean} sep
 */
export function clearConsole({ chalk }, sep) {
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
export function print({ log }, msg) {
  return log(msg.join('\n'));
}

/**
 *
 * Common Messages
 *
 */

export function eslintExtraWarningMsg({ log, chalk }) {
  return print({ log }, [
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

export function devServerSmallBanner({ chalk }, flags, ngrokUrl) {
  const msg = [chalk.magenta('Server: ') + chalk.cyan(`http://${flags.host}:${flags.port}`)];

  if (flags.ngrok) {
    msg.push(chalk.magenta('Ngrok: ') + chalk.cyan(ngrokUrl));
  }

  return msg;
}

export function devServerInvalidBuildMsg({ log, chalk }) {
  clearConsole({ chalk });
  return print({ log }, [
    chalk.yellow('Compiling...')
  ]);
}

export function devServerCompiledSuccessfullyMsg({ log, chalk }, flags, ngrokUrl) {
  const msg = devServerSmallBanner({ chalk }, flags, ngrokUrl);
  msg.push('', chalk.green('Compiled successfully!'));
  return print({ log }, msg);
}

export function devServerFailedToCompileMsg({ log, chalk }, flags, ngrokUrl) {
  const msg = devServerSmallBanner({ chalk }, flags, ngrokUrl);
  msg.push('', chalk.red('Failed to compile.'));
  return print({ log }, msg);
}

export function devServerCompiledWithWarningsMsg({ log, chalk }, flags, ngrokUrl) {
  const msg = devServerSmallBanner({ chalk }, flags, ngrokUrl);
  msg.push('', chalk.yellow('Compiled with warnings.'));
  return print({ log }, msg);
}

/**
 *
 * Build Messages
 *
 */

export function builderBanner({ log, chalk }, entry, cssmodules) {
  clearConsole({ chalk });
  return print({ log }, [
    chalk.green('Building...'),
    '',
    chalk.magenta('Entry point: ') + entry,
    chalk.magenta('CSS Modules: ') + (cssmodules ? chalk.green('enabled') : 'disabled')
  ]);
}

export function builderRemovingDistMsg({ log, chalk }, distPath) {
  return print({ log }, [
    '',
    chalk.yellow('Removing folder: ') + distPath
  ]);
}

export function builderRunningBuildMsg({ log, chalk }) {
  return print({ log }, [
    chalk.yellow('Running webpack production build...')
  ]);
}

export function builderErrorMsg({ log, chalk }, err) {
  let msg = err.message || err;
  if (isLikelyASyntaxError(msg)) {
    msg = formatMessage(msg);
  }

  return print({ log }, [
    '',
    chalk.red('Failed to create a production build. Reason:'),
    msg
  ]);
}

export function builderSuccessMsg({ log, chalk }, distShortName) {
  return print({ log }, [
    '',
    chalk.green(`Successfully generated a bundle in the ${chalk.cyan('"' + distShortName + '"')} folder!`),
    chalk.green('The bundle is optimized and ready to be deployed to production.')
  ]);
}
