/* @flow */
import { execSync } from "child_process";
import fs from "fs";
import readline from "readline";
import opn from "opn";
import { outputFile } from "fs-extra";
import resolveModule from "resolve";
import createWebpackDevServer from "./webpack-dev-server";
import createNgrokTunnel from "./ngrok";
import createParams from "./../../utils/params";
import {
  devServerFileDoesNotExistMsg,
  devServerInvalidBuildMsg,
  fileDoesNotExistMsg,
  devServerReactRequired,
  devServerInstallingModuleMsg
} from "./../../utils/messages";
import preinstallNpmModules from "../../preinstall-npm-modules";

export function requestCreatingAnEntryPoint(
  filename: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("Create it? (Y/n): ", (answer: string) => {
      rl.close();
      if (!answer || answer === "Y" || answer === "y") {
        return resolve(true);
      }

      fileDoesNotExistMsg(filename);

      reject();
    });
  });
}

export function createFile(filename: string): Promise<*> {
  return new Promise((resolve, reject) => {
    outputFile(filename, "", err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function ifNeedToInstallModule(moduleName: string): boolean {
  try {
    resolveModule.sync(moduleName, { basedir: process.cwd() });
    return false;
  } catch (e) {
    return true;
  }
}

function installModule(moduleName: string) {
  execSync(`npm install ${moduleName} --silent`, { cwd: process.cwd() });
  devServerInstallingModuleMsg(moduleName);
}

/**
 * Aik dev server command
 */
export default async function aikDevServer(
  input: string[],
  flags: CLIFlags
): Promise<*> {
  const [filename] = input;

  try {
    fs.statSync(filename);
  } catch (error) {
    devServerFileDoesNotExistMsg(filename);

    const shouldCreateAnEntryPoint = await requestCreatingAnEntryPoint(
      filename
    );

    if (shouldCreateAnEntryPoint) {
      await createFile(filename);
    }
  }

  devServerInvalidBuildMsg();
  preinstallNpmModules(process.cwd());

  if (flags.react) {
    const needReact = ifNeedToInstallModule("react");
    const needReactDom = ifNeedToInstallModule("react-dom");

    if (needReact || needReactDom) {
      devServerReactRequired();
    }

    needReact && installModule("react");
    needReactDom && installModule("react-dom");
  }

  const ngrokUrl: NgrokUrl = flags.ngrok && (await createNgrokTunnel(flags));
  const params: AikParams = createParams(filename, flags, ngrokUrl, false);
  await createWebpackDevServer(filename, flags, params);

  if (flags.open) {
    opn(ngrokUrl ? ngrokUrl : `http://${flags.host}:${flags.port}`);
  }
}
