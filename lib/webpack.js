'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createWebpackDevServer;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _webpackConfigBuilder = require('./webpack-config-builder');

var _webpackConfigBuilder2 = _interopRequireDefault(_webpackConfigBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createWebpackDevServer(filename, flags) {
  var config = (0, _webpackConfigBuilder2.default)(filename, flags);
  var compiler = (0, _webpack2.default)(config);
  var server = new _webpackDevServer2.default(compiler, {
    hot: true,
    colors: true,
    noInfo: true,
    stats: { colors: true }
  });

  return new Promise(function (resolve, reject) {
    server.listen(flags.port, flags.host, function (err) {
      if (err) {
        return reject(err);
      }

      resolve(server);
    });
  });
}