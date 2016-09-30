'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTemplateExists = isTemplateExists;
exports.default = getTemplatePath;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _resolveToCwd = require('./resolve-to-cwd');

var _resolveToCwd2 = _interopRequireDefault(_resolveToCwd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks whether templatePath is a file.
 */
function isTemplateExists(templatePath) {
  try {
    var stats = _fs2.default.statSync(templatePath);
    return stats.isFile();
  } catch (e) {
    return false;
  }
}

/**
 * Generates path to custom template for given file name.
 *
 * For example: index.js -> index.html
 */


function getTemplatePath() {
  var filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var basename = _path2.default.basename(filename, '.js');
  var dirname = _path2.default.dirname(filename);
  var templatePath = (0, _resolveToCwd2.default)(_path2.default.join(dirname, basename + '.html'));
  return isTemplateExists(templatePath) ? templatePath : '';
}