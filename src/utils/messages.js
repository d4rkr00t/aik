/* @flow */

import chalk from "chalk";
import { formatMessages } from "./error-helpers";
import { getExtName as getBabelExtName } from "./babelrc";

/**
 * Moves current line to the most top of console.
 */
export function clearConsole(sep?: boolean) {
  sep && process.stdout.write(chalk.dim("----------------------------------\n"));
  process.stdout.write(process.platform === "win32" ? "\x1Bc" : "\x1B[2J\x1B[3J\x1B[H");
}

/**
 * Actually prints message to the console
 */
export function print(msg: string[], clear?: boolean = false, clearWithSep?: boolean = false) {
  if (clear) clearConsole(clearWithSep);
  return console.log(msg.join("\n")); // eslint-disable-line
}

/**
 *
 *
 * Helpers
 *
 */

export function addTopSpace(msg: string[]): string[] {
  return [""].concat(msg);
}

export function addBottomSpace(msg: string[]): string[] {
  return [].concat(msg, "");
}

// TODO: string[] | string[][]
export function joinWithSeparator(sep: string, msg: any): string[] {
  return msg.reduce((acc: string[], item: string | string[], index) => {
    acc = acc.concat(item);
    if (index < msg.length - 1) {
      acc.push(sep);
    }
    return acc;
  }, []);
}

export function joinWithSpace(msg: any): string[] {
  return joinWithSeparator("", msg);
}

export function greenBadge(label: string): string {
  return chalk.bgGreen.black(` ${label} `);
}

export function yellowBadge(label: string): string {
  return chalk.bgYellow.black(` ${label} `);
}

export function blueBadge(label: string): string {
  return chalk.bgBlue.black(` ${label} `);
}

export function redBadge(label: string): string {
  return chalk.bgRed.black(` ${label} `);
}

export function doneBadge(): string {
  return greenBadge("DONE");
}

export function warningBadge(): string {
  return yellowBadge("WARNING");
}

export function waitBadge(): string {
  return blueBadge("WAIT");
}

export function errorBadge(): string {
  return redBadge("ERROR");
}

export function separator() {
  return chalk.dim("---------");
}

/**
 *
 * Common Messages
 *
 */

export function eslintExtraWarningMsg(): string[] {
  return [
    "You may use special comments to disable some warnings.",
    "Use " + chalk.yellow("// eslint-disable-next-line") + " to ignore the next line.",
    "Use " + chalk.yellow("/* eslint-disable */") + " to ignore all warnings in a file."
  ];
}

export function fileDoesNotExistMsg(filename: string): string[] {
  return [
    errorBadge() + chalk.red(" File doesn't exist."),
    "",
    `You are trying to use ${chalk.yellow('"' + filename + '"')} as an entry point, but this file doesn't exist.`,
    `Please, choose an existing file or create ${chalk.yellow('"' + filename + '"')} manualy.`
  ];
}

export function foundPackageJson(): string[] {
  return [
    warningBadge() + " " + chalk.yellow('File "package.json" has been discovered.'),
    "",
    `Since ${chalk.yellow('"node_modules"')} folder doesn't exist and in order to avoid possible artifacts caused by`,
    `accidentally updated versions of npm modules Aik will run ${chalk.yellow('"npm install"')} in current directory.`,
    "",
    waitBadge() + " " + chalk.blue("Installing npm modules...")
  ];
}

export function packageJsonHasNotBeenFound(): string[] {
  return [
    warningBadge() + " " + chalk.yellow('File "package.json" hasn\'t been found.'),
    "",
    `In order to make subsequent builds more ${chalk.yellow("predictable")} Aik needs to create one.`,
    "",
    waitBadge() + " " + chalk.blue("Creating package.json...")
  ];
}

export function installingModuleMsg(moduleName: string): string[] {
  return [`Installing module "${chalk.yellow(moduleName)}" from npm...`];
}

export function configParsingError({
  configName,
  configPath,
  error
}: {
  configName: string,
  configPath: string,
  error: Error
}): Array<string> {
  return [
    errorBadge() + " " + chalk.red(`Error parsing "${configName}"`),
    "",
    `${chalk.yellow(configName + " path:")}`,
    ` > ${configPath}`,
    "",
    error.stack || error.message
  ];
}

/**
 *
 * Dev Server Messages
 *
 */

export function devServerBanner({ host, port, oldPort, ngrok, filename, template, babelrc }: AikParams): string[] {
  const serverUrl = `http://${host}:${port}`;
  const msg: string[] = [
    chalk.bold(
      `> Open ${chalk.yellow(serverUrl)}` + (ngrok ? ` or ${chalk.yellow(ngrok)} ${chalk.grey("[ngrok]")}` : "")
    )
  ];

  if (oldPort) {
    msg.push(`${chalk.bold("> Port changed")} ${redBadge(oldPort.toString())} → ${greenBadge(port.toString())}`);
  }

  msg.push("", chalk.magenta("Entry point: ") + filename);

  if (template.short) {
    msg.push(chalk.magenta("Template:    ") + template.short);
  }

  if (babelrc.path) {
    msg.push(...addTopSpace(babelrcBanner({ babelrc })));
  }

  if (babelrc.clashing.presets.length || babelrc.clashing.plugins.length) {
    msg.push(...addTopSpace(babelrcClashnigMsg({ babelrc })));
  }

  return msg;
}

export function devServerInvalidBuildMsg(): string[] {
  return [waitBadge() + " " + chalk.blue("Compiling...")];
}

export function devServerCompiledSuccessfullyMsg(params: AikParams, buildDuration: number): string[] {
  const msg = devServerBanner(params);
  msg.unshift("");
  msg.unshift(doneBadge() + " " + chalk.green(`Compiled successfully in ${buildDuration}ms!`));
  return msg;
}

export function devServerFailedToCompileMsg(): string[] {
  return [errorBadge() + " " + chalk.red("Failed to compile.")];
}

export function devServerCompiledWithWarningsMsg(params: AikParams, buildDuration: number): string[] {
  const msg = devServerBanner(params);
  msg.unshift("");
  msg.unshift(warningBadge() + " " + chalk.yellow(`Compiled with warnings in ${buildDuration}ms.`));
  msg.push("", separator());
  return msg;
}

export function devServerFileDoesNotExistMsg(filename: string): string[] {
  return [warningBadge() + chalk.yellow(` File "${filename}" doesn\'t exist.`)];
}

export function devServerRestartMsg(module: string): string[] {
  return [
    warningBadge() + " " + chalk.yellow(`New npm module was added (${module}).`),
    "",
    `Restarting of the ${chalk.yellow('"webpack-dev-server"')} is requried.`,
    "",
    "Please be patient and wait until restart completes, otherwise some changes might not be tracked."
  ];
}

export function devServerUsageOfNotInstalledModule(module: string, filename: string): string[] {
  return [
    warningBadge() +
      " " +
      chalk.yellow(`Imported module '${chalk.bold(module)}' is not installed...`) +
      " " +
      chalk.dim(`[${filename}]`),
    ""
  ];
}

export function devServerModuleNotFoundNpm(module: string, filename: string): string[] {
  return [
    errorBadge() +
      " " +
      chalk.red(`Imported module '${chalk.bold(module)}' hasn't been found on npm!`) +
      " " +
      chalk.dim(`[${filename}]`),
    "",
    `It's likely caused by a ${chalk.yellow("typo")} in the module name. Fix the ${chalk.yellow(
      "module name"
    )} and changes will be picked up ${chalk.yellow("automatically")}.`
  ];
}

export function devServerFrameworkDetectedRestartMsg(framework: Framework): string[] {
  return framework
    ? [
        warningBadge() + " " + chalk.yellow(`Usage of '${framework}' detected.`),
        "",
        `Restarting ${chalk.yellow('"webpack-dev-server"')}...`,
        "",
        "Please be patient and wait until restart completes, otherwise some changes might not be tracked."
      ]
    : [];
}

export function devServerReactRequired(): string[] {
  return [
    warningBadge() + " " + chalk.yellow('"react" required.'),
    "",
    `In order to make ${chalk.yellow('"react-hot-loader"')} work, ${chalk.yellow('"react"')} and ${chalk.yellow(
      '"react-dom"'
    )} are required.`,
    "",
    waitBadge() + " " + chalk.blue("Installing required modules...")
  ];
}

/**
 *
 * Build Messages
 *
 */

export function builderBanner({ filename, template, base, babelrc }: AikParams): string[] {
  const msg = [waitBadge() + " " + chalk.blue("Building..."), "", chalk.magenta("Entry point: ") + filename];

  if (template.short) {
    msg.push(chalk.magenta("Template:    ") + template.short);
  }

  if (base) {
    msg.push(chalk.magenta("Base path:   ") + base);
  }

  if (babelrc.path) {
    msg.push(...addTopSpace(babelrcBanner({ babelrc })));
  }

  if (babelrc.clashing.presets.length || babelrc.clashing.plugins.length) {
    msg.push(...addTopSpace(babelrcClashnigMsg({ babelrc })));
  }

  return msg;
}

export function builderRemovingDistMsg(distPath: string): string[] {
  return [chalk.yellow("Removing folder: ") + distPath];
}

export function builderRunningBuildMsg(): string[] {
  return [chalk.yellow("Running webpack production build...")];
}

export function builderErrorMsg(err: string[]): string[] {
  const msg = formatMessages(err);

  return [errorBadge() + " " + chalk.red("Failed to create a production build. Reason:"), ""].concat(msg);
}

export function builderSuccessMsg(distShortName: string, buildStats: BuildStats): string[] {
  const assets = buildStats.assets;
  const longestNameSize = assets.reduce((acc, item) => (item.name.length > acc ? item.name.length : acc), 0) + 1;
  const padStringPlaceholder = " ".repeat(longestNameSize);
  const padString = (placeholder: string, str: string) => (str + placeholder).substr(0, placeholder.length);

  return [
    doneBadge() + chalk.green(` in ${buildStats.buildDuration}ms`),
    "",
    chalk.green(`Aik has successfully generated a bundle in the ${chalk.cyan('"' + distShortName + '"')} folder!`),
    chalk.green("The bundle is optimized and ready to be deployed to production."),
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
  ];
}

/**
 *
 *
 * Babelrc messages
 *
 *
 */

export function babelrcBanner({ babelrc }: { babelrc: Babelrc }): Array<string> {
  const group = (name: string, list: Array<string>, prefix: string, isLast: boolean) =>
    list.length
      ? [` ${isLast ? "└─" : "├─"} ${name}: ${chalk.dim(list.map(ext => getBabelExtName({ ext, prefix })).join(", "))}`]
      : [];

  return [
    chalk.magenta("Custom .babelrc"),
    ` ├─ path:    ${chalk.dim(babelrc.path)}`,
    ...group("presets", babelrc.names.presets, "babel-preset-", !babelrc.names.plugins.length),
    ...group("plugins", babelrc.names.plugins, "babel-plugin-", true)
  ];
}

export function babelrcCannotResolveError(
  babelrc: string,
  presets: Array<string>,
  plugins: Array<string>
): Array<string> {
  const group = (name: string, list: Array<string>) =>
    list.length
      ? [chalk.magenta(name), ...list.map(item => ` – ${item}   ${chalk.dim("[ npm i " + item + " ]")}`), ""]
      : [];

  return [
    errorBadge() + " " + chalk.red("Error parsing .babelrc – cannot resolve some presets/plugins:"),
    "",
    `${chalk.yellow(".babelrc path:")}`,
    ` > ${babelrc}`,
    "",
    ...group("Presets:", presets),
    ...group("Plugins:", plugins),
    chalk.bold(`Try to install them using npm / yarn:`),
    ` > npm install --save-dev ${presets.concat(plugins).join(" ")}`,
    ` > yarn add ${presets.concat(plugins).join(" ")}`
  ];
}

export function babelrcClashnigMsg({ babelrc }: { babelrc: Babelrc }): Array<string> {
  const group = (name: string, list: Array<string>) =>
    list.length ? [chalk.magenta(name), ...list.map(item => ` – ${item}`), ""] : [];

  return [
    warningBadge() + " " + chalk.yellow("Clashing settings in .babelrc:"),
    "",
    chalk.bold(`Aik has following presets/plugins enabled by default and in order to prevent inconsistency`),
    chalk.bold(`and unexpected behaviours Aik will ignore clashing settings from the custom babelrc.`),
    "",
    ...group("Clashing presets:", babelrc.clashing.presets),
    ...group("Clashing plugins:", babelrc.clashing.plugins)
  ];
}
