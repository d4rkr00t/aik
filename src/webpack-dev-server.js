/* @flow */

import historyApiFallback from "connect-history-api-fallback";
import resolveModule from "resolve";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import webpackConfigBuilder from "./webpack/config-builder";
import detectPort from "./utils/detect-port";
import testUtils from "./utils/test-utils";
import { isLikelyASyntaxError, formatMessage } from "./utils/error-helpers";
import {
  clearConsole,
  eslintExtraWarningMsg,
  devServerInvalidBuildMsg,
  devServerCompiledSuccessfullyMsg,
  devServerFailedToCompileMsg,
  devServerCompiledWithWarningsMsg,
  devServerRestartMsg,
  devServerModuleDoesntExists
} from "./utils/messages";

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
  // eslint-disable-line
  const hasErrors = stats.hasErrors();
  const hasWarnings = stats.hasWarnings();
  const buildDuration: number = stats.endTime - stats.startTime;

  clearConsole(true);

  if (!hasErrors && !hasWarnings) {
    devServerCompiledSuccessfullyMsg(filename, flags, params, buildDuration);
    testUtils();
    return;
  }

  const json = stats.toJson({}, true);
  const formattedWarnings = json.warnings.map(
    message => "Warning in " + formatMessage(message)
  );
  let formattedErrors = json.errors.map(
    message => "Error in " + formatMessage(message)
  );

  if (hasErrors) {
    if (
      formattedErrors.filter(err => err.match("Cannot resolve module")).length
    ) {
      invalidate(formattedErrors);
      testUtils();
      return;
    }

    devServerFailedToCompileMsg();

    // If there are any syntax errors, show just them.
    // This prevents a confusing ESLint parsing error
    // preceding a much more useful Babel syntax error.
    if (formattedErrors.some(isLikelyASyntaxError)) {
      formattedErrors = formattedErrors.filter(isLikelyASyntaxError);
    }

    // If errors exist, ignore warnings.
    formattedErrors.forEach(message => console.log("\n", message)); // eslint-disable-line
    testUtils();
    return;
  }

  if (hasWarnings) {
    devServerCompiledWithWarningsMsg(filename, flags, params, buildDuration);
    formattedWarnings.forEach(message => console.log("\n", message)); // eslint-disable-line
    eslintExtraWarningMsg();
  }

  testUtils();
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
  // eslint-disable-line
  const compiler = webpack(config);
  compiler.plugin("invalid", devServerInvalidBuildMsg);
  compiler.plugin(
    "done",
    onDone.bind(null, filename, flags, params, compiler, invalidate)
  );
  return compiler;
}

/**
 * Creates webpack dev server.
 */
export default function createWebpackDevServer(
  filename: string,
  flags: CLIFlags,
  params: AikParams
): Promise<Object> {
  return detectPort(parseInt(flags.port, 10), flags.host).then(port => {
    if (port !== flags.port) {
      flags.oldPort = flags.port;
      flags.port = port;
    }

    let server: WebpackDevServer; // eslint-disable-line
    const invalidate = (errors: string[]) => {
      if (!server) return;

      const error = errors[0] || "";
      const fileWithError = (error.match(/Error in (.+)\n/) || [])[1];
      let moduleName = (error.match(
        /Module not found: Error: Cannot resolve module '(.+)'/
      ) || [])[1];

      if (!moduleName) return;

      moduleName = moduleName.replace(/'/gim, "");

      try {
        resolveModule.sync(moduleName, { basedir: process.cwd() });
        devServerRestartMsg(moduleName);
        server.close();
        createWebpackDevServer(filename, flags, params);
      } catch (e) {
        // eslint-disable-line
        devServerModuleDoesntExists(moduleName, fileWithError);
      }
    };
    const config = webpackConfigBuilder(filename, flags, params);
    const compiler = createWebpackCompiler(
      filename,
      flags,
      params,
      config,
      invalidate
    );

    server = new WebpackDevServer(compiler, {
      // Enable gzip compression of generated files.
      compress: true,

      // Silence WebpackDevServer's own logs since they're generally not useful.
      // It will still show compile warnings and errors with this setting.
      clientLogLevel: "none",
      historyApiFallback: true,
      hot: true,
      overlay: {
        errors: true
      },
      quiet: true,
      stats: { colors: true }
    });

    return new Promise((resolve, reject) => {
      server.listen(flags.port, flags.host, err => {
        if (err) return reject(err);

        server.use(
          historyApiFallback({
            disableDotRule: true,
            htmlAcceptHeaders: ["text/html"]
          })
        );

        resolve(server);
      });
    });
  });
}
