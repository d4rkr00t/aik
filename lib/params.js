'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = params;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _helpers = require('./webpack/config/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Params for Aik
 */
function params(filename, flags, ngrok, isProd) {
  var template = (0, _helpers.getTemplatePath)(filename);
  var distShortName = typeof flags.build === 'string' ? flags.build : 'dist';
  var dist = _path2.default.join(process.cwd(), distShortName);

  return {
    isProd: isProd,
    ngrok: ngrok || '',
    template: {
      path: template,
      short: _path2.default.relative(process.cwd(), template)
    },
    dist: {
      path: _path2.default.join(process.cwd(), distShortName),
      short: distShortName
    }
  };
}