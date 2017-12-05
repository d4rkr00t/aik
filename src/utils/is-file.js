/* @flow */

import fs from "fs";

/**
 * Checks whether templatePath is a file.
 */
export function isFile(filePath: string): boolean {
  try {
    const stats = fs.statSync(filePath);
    return stats.isFile();
  } catch (e) {
    return false;
  }
}
