/* @flow */
import fs from "fs";
import readline from "readline";
import opn from "opn";
import { outputFile } from "fs-extra";
import createWebpackDevServer from "./webpack-dev-server";
import createNgrokTunnel from "./ngrok";
import createParams from "./../../utils/params";
import {
  print,
  addBottomSpace,
  devServerFileDoesNotExistMsg,
  devServerInvalidBuildMsg,
  fileDoesNotExistMsg,
  devServerReactRequired
} from "./../../utils/messages";
import {
  installAllModules,
  isModuleInstalled,
  installModule,
  createPackageJson
} from "../../utils/npm";

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
    print(
      addBottomSpace(devServerFileDoesNotExistMsg(filename)),
      /* clear console */ true
    );

    const shouldCreateAnEntryPoint = await requestCreatingAnEntryPoint(
      filename
    );

    if (shouldCreateAnEntryPoint) {
      await createFile(filename);
    }
  }
}

function prepareForReact() {
  const needReact = !isModuleInstalled("react");
  const needReactDom = !isModuleInstalled("react-dom");

  if (needReact || needReactDom) {
    print(devServerReactRequired());
  }

  needReact && installModule("react");
  needReactDom && installModule("react-dom");
}

/**
 * Aik dev server command
 */
export default async function aikDevServer(
  input: string[],
  flags: CLIFlags
): Promise<*> {
  const [filename] = input;

  await prepareEntryPoint(filename);

  print(devServerInvalidBuildMsg(), /* clear console */ true);

  createPackageJson(process.cwd());
  installAllModules(process.cwd());

  if (flags.react) {
    prepareForReact();
  }

  const ngrokUrl: NgrokUrl = flags.ngrok && (await createNgrokTunnel(flags));
  const params: AikParams = createParams(filename, flags, ngrokUrl, false);
  await createWebpackDevServer(filename, flags, params);

  if (flags.open) {
    opn(ngrokUrl ? ngrokUrl : `http://${flags.host}:${flags.port}`);
  }
}
