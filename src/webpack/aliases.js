/* @flow */
import resolveToCwd from "./../utils/resolve-to-cwd";
import { resolveModuleToCwd } from "./../utils/npm";

type Aliases = { [string]: string };
const aliases: Aliases = {};

export default function createAliases(filename: string, flags: CLIFlags): Aliases {
  if (flags.react) {
    return Object.assign({}, aliases, {
      aikReactEntryPoint: resolveToCwd(filename),
      react: resolveModuleToCwd("react"),
      "react-dom": resolveModuleToCwd("react-dom")
    });
  }

  return aliases;
}
