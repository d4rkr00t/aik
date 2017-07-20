/* @flow */

import historyApiFallback from "connect-history-api-fallback";
import resolveModule from "resolve";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import webpackConfigBuilder from "./../../webpack/config-builder";
import testUtils from "./../../utils/test-utils";
import detectFramework, { getFrameworkNameFromFlags } from "./../../utils/framework-detectors";
import { formatMessages } from "./../../utils/error-helpers";
import isEmptyObject from "./../../utils/is-empty-object";
import {
  print,
  addTopSpace,
  addBottomSpace,
  joinWithSpace,
  joinWithSeparator,
  separator,
  clearConsole,
  eslintExtraWarningMsg,
  devServerInvalidBuildMsg,
  devServerCompiledSuccessfullyMsg,
  devServerFailedToCompileMsg,
  devServerCompiledWithWarningsMsg,
  devServerRestartMsg,
  devServerModuleDoesntExists,
  devServerFrameworkDetectedRestartMsg,
  devServerReactRequired
} from "./../../utils/messages";

import { isModuleInstalled, installModule } from "../../utils/npm";

/**
 * On done handler for webpack compiler.
 */
export function onDone(
  filename: string,
  flags: CLIFlags,
  params: AikParams,
  compiler: any,
  invalidate: Function,
  stats: Object
) {
  const hasErrors = stats.hasErrors();
  const hasWarnings = stats.hasWarnings();
  const buildDuration: number = stats.endTime - stats.startTime;

  clearConsole(true);

  //
  // Framework Detection:
  //
  // On every file change check if one of the supported frameworks is being used,
  // and if it is then Aik has to restart webpack-dev-server.
  //

  const framework = detectFramework(filename, flags);
  if (!isEmptyObject(framework)) {
    invalidate([], Object.assign({}, flags, framework));
    testUtils();
    return;
  }

  //
  // Compiled Succesfully
  //

  if (!hasErrors && !hasWarnings) {
    print(
      devServerCompiledSuccessfullyMsg(filename, flags, params, buildDuration),
      /* clear console */ true,
      /* add sep */ true
    );
    testUtils();
    return;
  }

  //
  // Process Compilation Errors
  //

  const json = stats.toJson({}, true);
  const formattedWarnings = formatMessages(json.warnings);
  const formattedErrors = formatMessages(json.errors);

  if (hasErrors) {
    if (formattedErrors.filter(err => err.match("Cannot resolve module")).length) {
      invalidate(formattedErrors);
      testUtils();
      return;
    }

    print(devServerFailedToCompileMsg(), /* clear console */ true, /* add sep */ true);

    // If errors exist, ignore warnings.
    if (formattedErrors.length) {
      print(addTopSpace(joinWithSeparator(`\n\n${separator()}\n\n`, formattedErrors)));
      testUtils();
      return;
    }
  }

  if (hasWarnings && formattedWarnings.length) {
    print(
      joinWithSeparator(`\n${separator()}\n`, [
        joinWithSpace([
          devServerCompiledWithWarningsMsg(filename, flags, params, buildDuration),
          formattedWarnings.join(`\n\n${separator()}\n\n`)
        ]),
        eslintExtraWarningMsg()
      ]),
      /* clear console */ true,
      /* add sep */ true
    );
  }

  testUtils();
}

export function onInvalidate(
  filename: string,
  params: AikParams,
  flags: CLIFlags,
  server: WebpackDevServer,
  errors: string[],
  reject: Function,
  updatedFlags?: CLIFlags
) {
  if (!server) return;

  //
  // Flags Updated:
  //
  // If flags has been updated we need to restart webpack-dev-server
  //

  if (updatedFlags) {
    server.close();
    const frameworkName = getFrameworkNameFromFlags(updatedFlags);
    print(
      addBottomSpace(devServerFrameworkDetectedRestartMsg(frameworkName)),
      /* clear console */ true,
      /* add sep */ true
    );
    createWebpackDevServer(filename, updatedFlags, params, reject);
    return;
  }

  //
  // Module Not Found:
  //
  // There are 2 possible behaviours for when module is not found:
  // – If it's been installed and webpack doesn't see it, Aik just restarts webpack-dev-server
  // – If it's not installed Aik prints an error message
  //

  const error = errors[0] || "";
  const fileWithError = (error.match(/Error in (.+)\n/) || [])[1];
  let moduleName = (error.match(/Module not found: Error: Cannot resolve module '(.+)'/) || [])[1];

  if (!moduleName) return;

  moduleName = moduleName.replace(/'/gim, "");

  try {
    server.close();
    resolveModule.sync(moduleName, { basedir: process.cwd() });
    print(devServerRestartMsg(moduleName), /* clear console */ true, /* add sep */ true);
    createWebpackDevServer(filename, flags, params, reject);
  } catch (e) {
    print(devServerModuleDoesntExists(moduleName, fileWithError), /* clear console */ true, /* add sep */ true);
  }
}

/**
 * Creates webpack compiler.
 */
export function createWebpackCompiler(
  filename: string,
  flags: CLIFlags,
  params: AikParams,
  config: Object,
  invalidate: Function
) {
  const compiler = webpack(config);
  compiler.plugin("invalid", () => print(devServerInvalidBuildMsg(), /* clear console */ true));
  compiler.plugin("done", onDone.bind(null, filename, flags, params, compiler, invalidate));
  return compiler;
}

/**
 * Installs packages required for react
 */
export function prepareForReact() {
  const needReact = !isModuleInstalled("react");
  const needReactDom = !isModuleInstalled("react-dom");

  if (needReact || needReactDom) {
    print(devServerReactRequired());
  }

  needReact && installModule("react");
  needReactDom && installModule("react-dom");
}

/**
 * Creates webpack dev server.
 */
function createWebpackDevServer(filename: string, flags: CLIFlags, params: AikParams, reject: Function): void {
  let server: WebpackDevServer; // eslint-disable-line

  //
  // Additional steps Aik needs to perform before setting up webpack-dev-server
  //

  if (flags.react) {
    prepareForReact();
  }

  //
  // Set up everything that's required for webpack-dev-server
  //

  const invalidate = (errors: string[], updatedFlags?: CLIFlags) => {
    onInvalidate(filename, params, flags, server, errors, reject, updatedFlags);
  };

  const config = webpackConfigBuilder(filename, flags, params);
  const compiler = createWebpackCompiler(filename, flags, params, config, invalidate);

  //
  // Starting Webpack Dev Server
  //

  server = new WebpackDevServer(compiler, {
    // Enable gzip compression of generated files.
    compress: true,

    // Silence WebpackDevServer's own logs since they're generally not useful.
    // It will still show compile warnings and errors with this setting.
    clientLogLevel: "none",

    historyApiFallback: true,
    hot: true,
    quiet: true,
    disableHostCheck: true,
    overlay: { errors: true },
    stats: { colors: true }
  });

  server.listen(flags.port, flags.host, err => {
    if (err) {
      reject(err);
    }

    server.use(
      historyApiFallback({
        disableDotRule: true,
        htmlAcceptHeaders: ["text/html"]
      })
    );
  });
}

export default createWebpackDevServer;
