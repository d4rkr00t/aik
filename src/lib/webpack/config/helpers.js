/* @flow */

import path from 'path';
import fs from 'fs';

/**
 * Resolves file path to current working directory.
 */
export function resolveToCwd(filename:string = '') : string {
  return path.join(process.cwd(), filename);
}

/**
 * Checks whether templatePath is a file.
 */
export function isTemplateExists(templatePath:string) : boolean {
  try {
    const stats = fs.statSync(templatePath);
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
export function getTemplatePath(filename:string = '') : string {
  const basename = path.basename(filename, '.js');
  const dirname = path.dirname(filename);
  const templatePath = resolveToCwd(path.join(dirname, basename + '.html'));
  return isTemplateExists(templatePath) ? templatePath : '';
}

