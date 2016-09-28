'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reload;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Restarts dev server when typing rs and enter.
 */
function reload(server) {
  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', function () {
    var chunk = process.stdin.read();

    if (chunk && chunk.indexOf('rs') !== -1) {
      process.stdout.write(_chalk2.default.yellow('Restarting'));
      process.stdout.write('\n');
      server.invalidate();
      process.stdout.write(_chalk2.default.green('Done'));
      process.stdout.write('\n');
    }
  });
}