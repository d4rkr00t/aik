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

export function print({ log }, msg) {
  return log(msg.join('\n'));
}

export function smallBanner(chalk, flags, ngrokUrl) {
  const msg = [
    `${chalk.magenta('Server:')} ${chalk.cyan(`http://${flags.host}:${flags.port}`)}`
  ];

  if (flags.ngrok) {
    msg.push(`${chalk.magenta('Ngrok:')} ${chalk.cyan(ngrokUrl)}`);
  }

  return msg.join('\n');
}

export function compiling(chalk) {
  return [
    chalk.yellow('Compiling...')
  ].join('\n');
}

export function compiledSuccessfully(chalk, flags, ngrokUrl) {
  return [
    smallBanner(chalk, flags, ngrokUrl),
    '',
    chalk.green('Compiled successfully!')
  ].join('\n');
}

export function failedToCompile(chalk) {
  return [
    chalk.red('Failed to compile.')
  ].join('\n');
}

export function compiledWithWarnings(chalk) {
  return [
    chalk.yellow('Compiled with warnings.')
  ].join('\n');
}

export function eslintExtraWarning(chalk) {
  return [
    '',
    'You may use special comments to disable some warnings.',
    'Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.',
    'Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.'
  ].join('\n');
}

export function webpackBuilderBanner({ log, chalk }, entry, cssmodules) {
  clearConsole({ chalk });
  return print({ log }, [
    chalk.green('Building...'),
    '',
    chalk.magenta('Entry point: ') + entry,
    chalk.magenta('CSS Modules: ') + (cssmodules ? chalk.green('enabled') : 'disabled')
  ]);
}

export function webpackBuilderRemovingDistMsg({ log, chalk }, distPath) {
  return print({ log }, [
    '',
    chalk.yellow('Removing folder: ') + distPath
  ]);
}

export function webpackBuilderRunningBuildMsg({ log, chalk }) {
  return print({ log }, [
    chalk.yellow('Running webpack production build...')
  ]);
}

export function webpackBuilderErrorMsg({ log, chalk }, err) {
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

export function webpackBuilderSuccessMsg({ log, chalk }, distShortName) {
  return print({ log }, [
    '',
    chalk.green(`Successfully generated a bundle in the ${chalk.cyan('"' + distShortName + '"')} folder!`),
    chalk.green('The bundle is optimized and ready to be deployed to production.')
  ]);
}
