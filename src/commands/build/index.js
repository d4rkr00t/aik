/* @flow */
import runWebpackBuilder from "./webpack-build";
import createParams from "./../../utils/params";
import { installAllModules, createPackageJson } from "../../utils/npm";
import { updateFrameworkFlags } from "./../../utils/framework-detectors";

/**
 * Aik build command
 */
export default function aikBuild(input: string[], rawFlags: CLIFlags): Promise<*> {
  const [filename] = input;
  const flags = updateFrameworkFlags(filename, rawFlags);
  const params = createParams(filename, flags, "", true);
  createPackageJson(process.cwd());
  installAllModules(process.cwd());
  return runWebpackBuilder(filename, flags, params);
}
