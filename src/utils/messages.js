/* @flow */

import chalk from "chalk";
import { isLikelyASyntaxError, formatMessage } from "./error-helpers";

/**
 * Moves current line to the most top of console.
 */
export function clearConsole(sep?: boolean) {
  sep &&
    process.stdout.write(chalk.dim("----------------------------------\n"));
  process.stdout.write(
    process.platform === "win32" ? "\x1Bc" : "\x1B[2J\x1B[3J\x1B[H"
  );
}

/**
 * Actually prints message to the console
 */
export function print(msg: string[]) {
  return console.log(msg.join("\n")); // eslint-disable-line
}

/**
 *
 *
 * Helpers
 *
 */

export function doneBadge() {
  return chalk.bgGreen.black(" DONE ");
}

export function warningBadge() {
  return chalk.bgYellow.black(" WARNING ");
}

export function waitBadge() {
  return chalk.bgBlue.black(" WAIT ");
}

export function errorBadge() {
  return chalk.bgRed.black(" ERROR ");
}

/**
 *
 * Common Messages
 *
 */

export function eslintExtraWarningMsg() {
  return print([
    "You may use special comments to disable some warnings.",
    "Use " +
      chalk.yellow("// eslint-disable-next-line") +
      " to ignore the next line.",
    "Use " +
      chalk.yellow("/* eslint-disable */") +
      " to ignore all warnings in a file."
  ]);
}

export function fileDoesNotExistMsg(filename: string) {
  clearConsole();
  return print([
    errorBadge() + chalk.red(" File doesn't exist."),
    "",
    `You are trying to use ${chalk.yellow('"' + filename + '"')} as entry point, but this file doesn't exist.`,
    `Please, choose existing file or create ${chalk.yellow('"' + filename + '"')} manualy.`
  ]);
}

/**
 *
 * Dev Server Messages
 *
 */

export function devServerBanner(
  filename: string,
  flags: CLIFlags,
  params: AikParams
): string[] {
  const msg: string[] = ["", chalk.magenta("Entry point:      ") + filename];

  if (params.template.short) {
    msg.push(chalk.magenta("Custom template:  ") + params.template.short);
  }

  msg.push(
    chalk.magenta("Server:           ") +
      chalk.cyan(`http://${flags.host}:${flags.port}`)
  );

  if (flags.oldPort) {
    msg.push(
      chalk.magenta("Port changed:     ") +
        `${chalk.bgRed.black(" " + flags.oldPort + " ")} -> ${chalk.bgGreen.black(" " + flags.port + " ")}`
    );
  }

  if (params.ngrok) {
    msg.push(chalk.magenta("Ngrok:            ") + chalk.cyan(params.ngrok));
  }

  if (flags.cssmodules) {
    msg.push(chalk.magenta("CSS Modules:      ") + chalk.yellow("enabled"));
  }

  if (flags.react) {
    msg.push(chalk.magenta("React Hot Loader: ") + chalk.yellow("enabled"));
  }

  return msg;
}

export function devServerInvalidBuildMsg() {
  clearConsole();
  return print([waitBadge() + " " + chalk.blue("Compiling...")]);
}

export function devServerCompiledSuccessfullyMsg(
  filename: string,
  flags: CLIFlags,
  params: AikParams,
  buildDuration: number
) {
  // eslint-disable-line
  const msg = devServerBanner(filename, flags, params);
  msg.unshift(
    doneBadge() +
      " " +
      chalk.green(`Compiled successfully in ${buildDuration}ms!`)
  );
  return print(msg);
}

export function devServerFailedToCompileMsg() {
  clearConsole(true);
  return print([errorBadge() + " " + chalk.red("Failed to compile.")]);
}

export function devServerCompiledWithWarningsMsg(
  filename: string,
  flags: CLIFlags,
  params: AikParams,
  buildDuration: number
) {
  // eslint-disable-line
  const msg = devServerBanner(filename, flags, params);
  msg.unshift(
    warningBadge() +
      " " +
      chalk.yellow(`Compiled with warnings in ${buildDuration}ms.`)
  );
  msg.push("", chalk.dim("---------"));
  return print(msg);
}

export function devServerFileDoesNotExistMsg(filename: string) {
  clearConsole();
  return print([
    warningBadge() + ` File "${chalk.yellow(filename)}" doesn\'t exist.`,
    ""
  ]);
}

export function devServerRestartMsg(module: string) {
  clearConsole(true);
  return print([
    warningBadge() +
      " " +
      chalk.yellow(`New npm module was added (${module}).`),
    "",
    "Restarting webpack-dev-server is requried.",
    "",
    "Please be patient and wait until restart completes, otherwise some changes might not be tracked.",
    ""
  ]);
}

export function devServerModuleDoesntExists(module: string, filename: string) {
  clearConsole(true);
  return print([
    errorBadge() + " " + chalk.red(`Module '${module}' doesn't exists.`),
    "",
    `Error in ${filename}`,
    "",
    `Webpack tried to resolve module ${chalk.bgYellow.black(" " + module + " ")} which doesn't exist.`,
    "",
    `It's likely caused by ${chalk.yellow("typo")} in the module name.`,
    ""
  ]);
}

export function devServerReactRequired() {
  return print([
    warningBadge() + " " + chalk.yellow('"react" required.'),
    "",
    'In order to make "react-hot-loader" work, "react" and "react-dom" are required.',
    "",
    chalk.blue("Installing required modules..."),
    ""
  ]);
}

export function devServerInstallingModuleMsg(moduleName: string) {
  return print([`Installing module "${chalk.yellow(moduleName)}" ...`]);
}

export function devServerSkipInstallingModuleMsg(moduleName: string) {
  return print([
    `Module "${chalk.yellow(moduleName)}" has already been installed ${chalk.dim("[skipping].")}`
  ]);
}

/**
 *
 * Build Messages
 *
 */

export function builderBanner(
  filename: string,
  flags: CLIFlags,
  params: AikParams
) {
  clearConsole();

  const msg = [
    waitBadge() + " " + chalk.blue("Building..."),
    "",
    chalk.magenta("Entry point:     ") + filename
  ];

  if (params.template.short) {
    msg.push(chalk.magenta("Custom template: ") + params.template.short);
  }

  const base = flags.base;
  if (base && typeof base === "string") {
    msg.push(chalk.magenta("Base path:       ") + base);
  }

  msg.push(
    chalk.magenta("CSS Modules:     ") +
      (flags.cssmodules ? chalk.green("enabled") : "disabled")
  );

  return print(msg);
}

export function builderRemovingDistMsg(distPath: string) {
  return print(["", chalk.yellow("Removing folder: ") + distPath]);
}

export function builderRunningBuildMsg() {
  return print([chalk.yellow("Running webpack production build...")]);
}

export function builderErrorMsg(err: { message: string } | string) {
  clearConsole(true);

  let msg: string = typeof err.message === "string"
    ? err.message
    : err.toString();

  if (isLikelyASyntaxError(msg)) {
    msg = formatMessage(msg);
  }
  return print([
    errorBadge() +
      " " +
      chalk.red("Failed to create a production build. Reason:"),
    msg
  ]);
}

export function builderSuccessMsg(
  distShortName: string,
  buildStats: BuildStats
) {
  clearConsole(true);

  const assets = buildStats.assets;
  const longestNameSize =
    assets.reduce(
      (acc, item) => (item.name.length > acc ? item.name.length : acc),
      0
    ) + 1;
  const padStringPlaceholder = " ".repeat(longestNameSize);
  const padString = (placeholder: string, str: string) =>
    (str + placeholder).substr(0, placeholder.length);

  return print([
    doneBadge() + ` in ${buildStats.buildDuration}ms`,
    "",
    chalk.green(
      `Successfully generated a bundle in the ${chalk.cyan('"' + distShortName + '"')} folder!`
    ),
    chalk.green(
      "The bundle is optimized and ready to be deployed to production."
    ),
    "",
    chalk.bgMagenta.black(" ASSETS "),
    "",
    buildStats.assets
      .map(asset => {
        return [
          `${chalk.magenta(padString(padStringPlaceholder, asset.name + ":"))}`,
          `${asset.size.toFixed(2)}kb, ${asset.sizeGz.toFixed(2)}kb gzip`
        ].join(" ");
      })
      .join("\n")
  ]);
}
