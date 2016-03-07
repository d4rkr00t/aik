'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reload;
/**
 * Restarts dev server.
 *
 * @param {String[]} input
 * @param {Flags} flags
 * @param {Object} imports
 */
function reload(input, flags, imports) {
  var prc = imports.prc;
  var server = imports.server;
  var chalk = imports.chalk;


  prc.stdin.setEncoding('utf8');
  prc.stdin.on('readable', function () {
    var chunk = prc.stdin.read();

    if (chunk !== null && chunk.indexOf('rs') !== -1) {
      prc.stdout.write(chalk.yellow('Restarting'));
      prc.stdout.write('\n');
      server.invalidate();
      prc.stdout.write(chalk.green('Done'));
      prc.stdout.write('\n');
    }
  });
}