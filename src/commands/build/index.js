/* @flow */
import runWebpackBuilder from "./webpack-build";
import createParams from "./../../utils/params";
import { installAllModules, createPackageJson } from "../../utils/npm";

/**
 * Aik build command
 */
export default async function aikBuild(input: string[], flags: CLIFlags): Promise<*> {
  const [filename] = input;
  const params = await createParams({ filename, flags, isProd: true });
  createPackageJson(process.cwd());
  installAllModules(process.cwd());
  return runWebpackBuilder(params);
}
