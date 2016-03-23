'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createNgrokTunnel;

var _ngrok = require('ngrok');

var _ngrok2 = _interopRequireDefault(_ngrok);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates ngrok tunnel.
 *
 * @param {Flags} flags
 *
 * @return {Promise}
 */
function createNgrokTunnel(flags) {
  if (flags.host !== 'localhost') {
    return Promise.reject(new Error('Ngrok can`t be used with host option.'));
  }

  return new Promise(function (resolve, reject) {
    _ngrok2.default.connect(flags.port, function (err, url) {
      if (err) return reject(err);

      resolve(url.replace('https:', 'http:'));
    });
  });
}