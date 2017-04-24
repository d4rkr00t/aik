/* @flow */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { foundPackageJson } from "./utils/messages";

export function hasPackageJson(cwd: string) {
  try {
    fs.statSync(path.join(cwd, "package.json"));
    return true;
  } catch (error) {
    return false;
  }
}

export function hasNodeModules(cwd: string) {
  try {
    fs.statSync(path.join(cwd, "node_modules"));
    return true;
  } catch (error) {
    return false;
  }
}

export default function preinstallNpmModules(cwd: string) {
  if (!hasPackageJson(cwd)) return;
  if (hasNodeModules(cwd)) return;
  foundPackageJson();
  spawnSync("npm", ["install", "--silent"], { cwd, stdio: "inherit" });
}
