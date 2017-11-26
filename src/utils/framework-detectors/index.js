/* @flow */

import path from "path";
import fs from "fs";
import * as babylon from "babylon";
import isReact from "./react";

export function detectFramework(filename: string): Framework {
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
    return "react";
  }

  return null;
}
