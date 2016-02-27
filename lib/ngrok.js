'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createNgrokTunnel;

var _ngrok = require('ngrok');

var _ngrok2 = _interopRequireDefault(_ngrok);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createNgrokTunnel(flags) {
  return new Promise(function (resolve, reject) {
    _ngrok2.default.connect(flags.port, function (err, url) {
      if (err) {
        return reject(err);
      }

      resolve(url);
    });
  });
}