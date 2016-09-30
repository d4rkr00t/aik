'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveToCwd = resolveToCwd;
exports.isTemplateExists = isTemplateExists;
exports.getTemplatePath = getTemplatePath;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Resolves file path to current working directory.
 */
function resolveToCwd() {
  let filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  return _path2.default.join(process.cwd(), filename);
}

/**
 * Checks whether templatePath is a file.
 */
function isTemplateExists(templatePath) {
  try {
    const stats = _fs2.default.statSync(templatePath);
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
  let filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  const basename = _path2.default.basename(filename, '.js');
  const dirname = _path2.default.dirname(filename);
  const templatePath = resolveToCwd(_path2.default.join(dirname, basename + '.html'));
  return isTemplateExists(templatePath) ? templatePath : '';
}