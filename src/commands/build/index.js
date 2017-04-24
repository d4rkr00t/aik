/* @flow */
import runWebpackBuilder from "./webpack-build";
import createParams from "./../../utils/params";

/**
 * Aik build command
 */
export default function aikBuild(input: string[], flags: CLIFlags): Promise<*> {
  const [filename] = input;
  const params = createParams(filename, flags, "", true);
  return runWebpackBuilder(filename, flags, params);
}
