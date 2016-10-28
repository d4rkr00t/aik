'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeDist = removeDist;
exports.default = runWebpackBuilder;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _gzipSize = require('gzip-size');

var _gzipSize2 = _interopRequireDefault(_gzipSize);

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
  try {
    _fs2.default.statSync(filename);
  } catch (error) {
    (0, _messages.fileDoesNotExistMsg)(filename);
    return Promise.resolve();
  }

  const config = (0, _configBuilder2.default)(filename, flags, params);
  const compiler = (0, _webpack2.default)(config);

  (0, _messages.builderBanner)(filename, flags, params);
  (0, _messages.builderRemovingDistMsg)(params.dist.path);

  return removeDist(params.dist.path).then(() => {
    (0, _messages.builderRunningBuildMsg)();
    compiler.run((err, stats) => {
      if (err) {
        (0, _messages.builderErrorMsg)(err);
        process.exit(1); // eslint-disable-line
      }

      const json = stats.toJson({}, true);
      const buildDuration = stats.endTime - stats.startTime;
      const assets = json.assets.map(item => {
        const content = _fs2.default.readFileSync(_path2.default.join(params.dist.path, item.name), 'utf-8');
        return {
          name: item.name,
          size: item.size / 1024,
          sizeGz: _gzipSize2.default.sync(content) / 1024
        };
      });
      (0, _messages.builderSuccessMsg)(params.dist.short, { buildDuration: buildDuration, assets: assets });
    });
  });
}