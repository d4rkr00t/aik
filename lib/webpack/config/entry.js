'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.entryProd = entryProd;
exports.entryDev = entryDev;
exports.default = entry;

var _helpers = require('./helpers');

/**
 * Entry for production build.
 *
 * @param {String} filename
 *
 * @return {Object}
 */
function entryProd(filename) {
  return {
    app: [(0, _helpers.resolveToCwd)(filename)]
  };
}

/**
 * Entry for dev server.
 *
 * @param {String} filename
 * @param {Object} flags
 *
 * @return {Object}
 */
function entryDev(filename, flags) {
  var host = flags.host === '::' ? 'localhost' : flags.host;

  return {
    app: [require.resolve('webpack-dev-server/client') + '?http://' + host + ':' + flags.port + '/', require.resolve('webpack/hot/dev-server'), (0, _helpers.resolveToCwd)(filename)]
  };
}

/**
 * Setups entry part of webpack config.
 *
 * @param {String} filename
 * @param {Object} flags
 * @param {Boolean} isProd
 *
 * @return {Object}
 */
function entry(filename, flags, isProd) {
  return isProd ? entryProd(filename) : entryDev(filename, flags);
}