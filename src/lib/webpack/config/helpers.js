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
 * Generates possible template path for given file name.
 *
 * For example: index.js -> index.html
 */
export function getTemplatePath(filename:string = '') : string {
  const basename = path.basename(filename, '.js');
  const dirname = path.dirname(filename);
  return resolveToCwd(path.join(dirname, basename + '.html'));
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
