/* @flow */
import fs from "fs";
import readline from "readline";
import opn from "opn";
import { outputFile } from "fs-extra";
import createWebpackDevServer from "./webpack-dev-server";
import createNgrokTunnel from "./ngrok";
import createParams from "./../../utils/params";
import detectPort from "./../../utils/detect-port";
import { updateFrameworkFlags } from "./../../utils/framework-detectors";
import {
  print,
  addBottomSpace,
  devServerFileDoesNotExistMsg,
  devServerInvalidBuildMsg,
  fileDoesNotExistMsg
} from "./../../utils/messages";
import { installAllModules, createPackageJson } from "../../utils/npm";

export function requestCreatingAnEntryPoint(filename: string): Promise<boolean> {
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

      print(fileDoesNotExistMsg(filename), /* clear console */ true);

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

async function prepareEntryPoint(filename: string) {
  try {
    fs.statSync(filename);
  } catch (error) {
    print(addBottomSpace(devServerFileDoesNotExistMsg(filename)), /* clear console */ true);

    const shouldCreateAnEntryPoint = await requestCreatingAnEntryPoint(filename);

    if (shouldCreateAnEntryPoint) {
      await createFile(filename);
    }
  }
}

/**
 * Updates port if specified one has already been taken
 */
export async function updatePort(flags: CLIFlags): Promise<CLIFlags> {
  const port = await detectPort(parseInt(flags.port, 10), flags.host);
  if (port !== flags.port) {
    return Object.assign({}, flags, {
      oldPort: flags.port,
      port
    });
  }

  return flags;
}

/**
 * Aik dev server command
 */
export default async function aikDevServer(input: string[], rawFlags: CLIFlags): Promise<*> {
  const [filename] = input;
  let flags = rawFlags;

  await prepareEntryPoint(filename);

  print(devServerInvalidBuildMsg(), /* clear console */ true);

  createPackageJson(process.cwd());
  installAllModules(process.cwd());

  flags = await updatePort(flags);
  flags = updateFrameworkFlags(filename, flags);

  const ngrokUrl: NgrokUrl = flags.ngrok && (await createNgrokTunnel(flags));
  const params: AikParams = createParams(filename, flags, ngrokUrl, false);

  return new Promise(async function(resolve, reject) {
    createWebpackDevServer(filename, flags, params, reject);

    if (flags.open) {
      opn(ngrokUrl ? ngrokUrl : `http://${flags.host}:${flags.port}`);
    }
  });
}
