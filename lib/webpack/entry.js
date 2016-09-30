'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildEntryName = buildEntryName;
exports.entryProd = entryProd;
exports.entryDev = entryDev;
exports.default = entry;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Build entry name from given filename.
 *
 * index.js -> index
 * src/index.js -> index
 * index.sth.js -> index
 */
function buildEntryName(filename) {
  return _path2.default.basename(filename).split('.')[0];
}

/**
 * Entry for production build.
 */
function entryProd(filename) {
  const entry = buildEntryName(filename);
  return {
    [entry]: [(0, _helpers.resolveToCwd)(filename)]
  };
}

/**
 * Entry for dev server.
 */
function entryDev(filename, flags) {
  const entry = buildEntryName(filename);
  const host = flags.host === '::' ? 'localhost' : flags.host;

  return {
    [entry]: [`${ require.resolve('webpack-dev-server/client') }?http://${ host }:${ flags.port }/`, require.resolve('webpack/hot/dev-server'), (0, _helpers.resolveToCwd)(filename)]
  };
}

/**
 * Setups entry part of webpack config.
 */
function entry(filename, flags, params) {
  return params.isProd ? entryProd(filename) : entryDev(filename, flags);
}