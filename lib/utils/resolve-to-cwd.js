'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveToCwd;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Resolves file path to current working directory.
 */
function resolveToCwd() {
  let filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  return _path2.default.join(process.cwd(), filename);
}