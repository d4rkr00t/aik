/* @flow */
import { execSync, spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import resolveModule from "resolve";
import { installingModuleMsg, foundPackageJson } from "./messages";

export function isModuleInstalled(moduleName: string): boolean {
  try {
    resolveModule.sync(moduleName, { basedir: process.cwd() });
    return true;
  } catch (e) {
    return false;
  }
}

export function installModule(moduleName: string) {
  execSync(`npm install ${moduleName} --silent`, { cwd: process.cwd() });
  installingModuleMsg(moduleName);
}

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

export function installAllModules(cwd: string) {
  if (!hasPackageJson(cwd)) return;
  if (hasNodeModules(cwd)) return;
  foundPackageJson();
  spawnSync("npm", ["install", "--silent"], { cwd, stdio: "inherit" });
}
