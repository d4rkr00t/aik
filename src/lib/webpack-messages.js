export function smallBanner(chalk, flags, ngrokUrl) {
  const msg = [
    `${chalk.magenta('Server:')} ${chalk.cyan(`http://${flags.host}:${flags.port}`)}`
  ];

  if (flags.ngrok) {
    msg.push(`${chalk.magenta('Ngrok:')}  ${chalk.cyan(ngrokUrl)}`);
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
