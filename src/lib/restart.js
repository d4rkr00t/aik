/* @flow */

import chalk from 'chalk';

/**
 * Restarts dev server when typing rs and enter.
 */
export default function reload(server:Object) {
  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();

    if (chunk && chunk.indexOf('rs') !== -1) {
      process.stdout.write(chalk.yellow('Restarting'));
      process.stdout.write('\n');
      server.invalidate();
      process.stdout.write(chalk.green('Done'));
      process.stdout.write('\n');
    }
  });
}
