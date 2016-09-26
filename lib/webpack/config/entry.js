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
 */
function entryProd(filename) {
  return {
    app: [(0, _helpers.resolveToCwd)(filename)]
  };
}

/**
 * Entry for dev server.
 */


function entryDev(filename, flags) {
  var host = flags.host === '::' ? 'localhost' : flags.host;

  return {
    app: [require.resolve('webpack-dev-server/client') + '?http://' + host + ':' + flags.port + '/', require.resolve('webpack/hot/dev-server'), (0, _helpers.resolveToCwd)(filename)]
  };
}

/**
 * Setups entry part of webpack config.
 */
function entry(filename, flags, isProd) {
  return isProd ? entryProd(filename) : entryDev(filename, flags);
}