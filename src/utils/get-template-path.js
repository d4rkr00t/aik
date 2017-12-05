/* @flow */

import path from "path";
import resolveToCwd from "./resolve-to-cwd";
import { isFile } from "./is-file";

/**
 * Generates path to custom template for given file name.
 *
 * For example: index.js -> index.html
 */
export default function getTemplatePath(filename: string = ""): string {
  const basename = path.basename(filename, ".js");
  const dirname = path.dirname(filename);
  const templatePath = resolveToCwd(path.join(dirname, basename + ".html"));
  return isFile(templatePath) ? templatePath : "";
}
