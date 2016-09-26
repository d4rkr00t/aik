/* @flow */

type ReloadImports = {
  prc: Object,
  server: Object,
  chalk: $npm$chalk$Style // Terrible name of type
}

/**
 * Restarts dev server when typing rs and enter.
 */
export default function reload(imports:ReloadImports) {
  const { prc, server, chalk } = imports;

  prc.stdin.setEncoding('utf8');
  prc.stdin.on('readable', () => {
    const chunk = prc.stdin.read();

    if (chunk !== null && chunk.indexOf('rs') !== -1) {
      prc.stdout.write(chalk.yellow('Restarting'));
      prc.stdout.write('\n');
      server.invalidate();
      prc.stdout.write(chalk.green('Done'));
      prc.stdout.write('\n');
    }
  });
}
