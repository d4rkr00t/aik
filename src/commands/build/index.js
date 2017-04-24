/* @flow */
import runWebpackBuilder from "./webpack-build";
import createParams from "./../../utils/params";
import preinstallNpmModules from "../../preinstall-npm-modules";

/**
 * Aik build command
 */
export default function aikBuild(input: string[], flags: CLIFlags): Promise<*> {
  const [filename] = input;
  const params = createParams(filename, flags, "", true);
  preinstallNpmModules(process.cwd());
  return runWebpackBuilder(filename, flags, params);
}
