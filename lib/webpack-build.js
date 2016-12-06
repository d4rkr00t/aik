'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeDist = removeDist;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _gzipSize = require('gzip-size');

var _gzipSize2 = _interopRequireDefault(_gzipSize);

var _configBuilder = require('./webpack/config-builder');

var _configBuilder2 = _interopRequireDefault(_configBuilder);

var _messages = require('./utils/messages');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Removes distribute folder to prevent duplicates.
 */
function removeDist(distPath) {
  return new Promise(resolve => _fsExtra2.default.remove(distPath, resolve));
}

/**
 * Builds project using webpack.
 */

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (filename, flags, params) {
    try {
      _fsExtra2.default.statSync(filename);
    } catch (error) {
      (0, _messages.fileDoesNotExistMsg)(filename);
      return;
    }

    const config = (0, _configBuilder2.default)(filename, flags, params);
    const compiler = (0, _webpack2.default)(config);

    (0, _messages.builderBanner)(filename, flags, params);
    (0, _messages.builderRemovingDistMsg)(params.dist.path);

    yield removeDist(params.dist.path);

    (0, _messages.builderRunningBuildMsg)();

    return new Promise(function (resolve, reject) {
      compiler.run(function (err, stats) {
        if (err) {
          (0, _messages.builderErrorMsg)(err);
          return reject();
        }

        const json = stats.toJson({}, true);
        const buildDuration = stats.endTime - stats.startTime;
        const assets = json.assets.map(function (item) {
          const content = _fsExtra2.default.readFileSync(_path2.default.join(params.dist.path, item.name), 'utf-8');
          return {
            name: item.name,
            size: item.size / 1024,
            sizeGz: _gzipSize2.default.sync(content) / 1024
          };
        });
        (0, _messages.builderSuccessMsg)(params.dist.short, { buildDuration: buildDuration, assets: assets });
        resolve(compiler);
      });
    });
  });

  function runWebpackBuilder(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  }

  return runWebpackBuilder;
})();