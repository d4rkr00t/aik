'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = params;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _getTemplatePath = require('./get-template-path');

var _getTemplatePath2 = _interopRequireDefault(_getTemplatePath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Params for Aik
 */
function params(filename, flags, ngrok, isProd) {
  const template = (0, _getTemplatePath2.default)(filename);
  const distShortName = typeof flags.build === 'string' ? flags.build : 'dist';

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