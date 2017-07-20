/* @flow */

import path from "path";
import fs from "fs";
import * as babylon from "babylon";
import isReact from "./react";

export default function detectFramework(filename: string, flags: CLIFlags): FrameworkFlags {
  if (flags.react) {
    return {};
  }

  const filepath = path.join(process.cwd(), filename);
  const fileContent = fs.readFileSync(filepath, "utf8");
  const ast = babylon.parse(fileContent, {
    sourceType: "module",
    plugins: [
      "jsx",
      "flow",
      "typescript",
      "objectSpread",
      "decorators",
      "classProperties",
      "classPrivateProperties",
      "exportExtensions",
      "asyncGenerators",
      "functionBind",
      "functionSent",
      "dynamicImport",
      "numericSeparator",
      "optionalChaining",
      "importMeta",
      "bigInt"
    ]
  });

  if (isReact(ast)) {
    return { react: true };
  }

  return {};
}

export function updateFrameworkFlags(filename: string, flags: CLIFlags): CLIFlags {
  return Object.assign({}, flags, detectFramework(filename, flags));
}

export function getFrameworkNameFromFlags(flags: CLIFlags): string {
  if (flags.react) {
    return "react";
  }

  return "none";
}
