'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.outputProd = outputProd;
exports.outputDev = outputDev;
exports.default = output;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _resolveToCwd = require('./../utils/resolve-to-cwd');

var _resolveToCwd2 = _interopRequireDefault(_resolveToCwd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Output for production build.
 */
function outputProd(filename, flags, params) {
  const base = typeof flags.base === 'string' ? flags.base : '';
  const publicPath = base.endsWith('/') ? base : base + '/';

  return {
    path: (0, _resolveToCwd2.default)(params.dist.short),
    filename: `${_path2.default.basename(filename, '.js')}.[hash:8].js`,
    hash: true,
    publicPath: publicPath
  };
}

/**
 * Output for dev server.
 */
function outputDev(filename) {
  return {
    path: _path2.default.join(process.cwd(), _path2.default.dirname(filename)),
    filename: _path2.default.basename(filename),
    hash: true
  };
}

/**
 * Setups output section of webpack config.
 */
function output(filename, flags, params) {
  return params.isProd ? outputProd(filename, flags, params) : outputDev(filename);
}