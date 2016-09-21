'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.outputProd = outputProd;
exports.outputDev = outputDev;
exports.default = output;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _isString = require('../../utils/isString');

var _isString2 = _interopRequireDefault(_isString);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Output for production build.
 *
 * @param {String} filename
 * @param {Object} flags
 * @param {String} dist - folder where production build will be placed.
 *
 * @return {Object}
 */
function outputProd(filename, flags, dist) {
  var base = (0, _isString2.default)(flags.base) ? flags.base : '';
  var publicPath = base.endsWith('/') ? base : base + '/';

  return {
    path: (0, _helpers.resolveToCwd)(dist),
    filename: _path2.default.basename(filename, '.js') + '.[hash:8].js',
    hash: true,
    publicPath: publicPath
  };
}

/**
 * Output for dev server.
 *
 * @param {String} filename
 *
 * @return {Object}
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
 *
 * @param {String} filename
 * @param {Object} flags
 * @param {Boolean} isProd
 * @param {String} dist - folder where production build will be placed.
 *
 * @return {Object}
 */
function output(filename, flags, isProd, dist) {
  return isProd ? outputProd(filename, flags, dist) : outputDev(filename);
}