import path from 'path';
import fs from 'fs';

/**
 * Makes absolute path to node_modules for webpack plugins and loaders.
 *
 * @param {String} relativePath
 *
 * @return {String}
 */
export function resolveToOwnNodeModules(relativePath = '') {
  return path.join(__dirname, '..', 'node_modules', relativePath);
}

/**
 * Resolves file path to current working directory.
 *
 * @param {String} filename
 *
 * @return {String}
 */
export function resolveToCwd(filename = '') {
  return path.join(process.cwd(), filename);
}

/**
 * Generates possible template path for given file name.
 *
 * For example: index.js -> index.html
 *
 * @param {String} filename
 *
 * @returns {String}
 */
export function getTemplatePath(filename = '') {
  const basename = path.basename(filename, '.js');
  const dirname = path.dirname(filename);
  return resolveToCwd(path.join(dirname, basename + '.html'));
}

/**
 * Checks whether templatePath is a file.
 *
 * @param {String} templatePath
 *
 * @return {Boolean}
 */
export function isTemplateExists(templatePath) {
  try {
    const stats = fs.statSync(templatePath);
    return stats.isFile();
  } catch (e) {
    return false;
  }
}
