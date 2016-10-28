/* @flow */

import path from 'path';

/**
 * Resolves file path to current working directory.
 */
export default function resolveToCwd(filename: string = ''): string {
  return path.join(process.cwd(), filename);
}
