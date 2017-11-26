/* @flow */
import chalk from "chalk";

export function flagDeprecationWarnings(flags: CLIFlags, callback: () => {}) {
  if (flags.react) {
    // eslint-disable-next-line
    console.log(
      chalk.yellow(
        "Deprecation warning: --react/-r flag is going to be removed in Aik version 0.18, please use autodetecting capabilities of aik to determine framework."
      )
    );
    setTimeout(callback, 5000);
    return;
  }

  callback();
}
