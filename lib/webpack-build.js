'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeDist = removeDist;
exports.default = runWebpackBuilder;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _configBuilder = require('./webpack/config-builder');

var _configBuilder2 = _interopRequireDefault(_configBuilder);

var _messages = require('./utils/messages');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Removes distribute folder to prevent duplicates.
 */
function removeDist(distPath) {
  return new Promise(resolve => (0, _rimraf2.default)(distPath, resolve));
}

/**
 * Builds project using webpack.
 */
function runWebpackBuilder(filename, flags, params) {
  const config = (0, _configBuilder2.default)(filename, flags, params);
  const compiler = (0, _webpack2.default)(config);

  (0, _messages.builderBanner)(filename, flags, params);
  (0, _messages.builderRemovingDistMsg)(params.dist.path);

  return removeDist(params.dist.path).then(() => {
    (0, _messages.builderRunningBuildMsg)();
    compiler.run(err => {
      if (err) {
        (0, _messages.builderErrorMsg)(err);
        process.exit(1); // eslint-disable-line
      }
      (0, _messages.builderSuccessMsg)(params.dist.short);
    });
  });
}