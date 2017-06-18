/* @flow */

import historyApiFallback from "connect-history-api-fallback";
import resolveModule from "resolve";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import webpackConfigBuilder from "./../../webpack/config-builder";
import detectPort from "./../../utils/detect-port";
import testUtils from "./../../utils/test-utils";
import { formatMessages } from "./../../utils/error-helpers";
import {
  print,
  addTopSpace,
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
  devServerModuleDoesntExists
} from "./../../utils/messages";

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
    print(
      devServerCompiledSuccessfullyMsg(filename, flags, params, buildDuration),
      /* clear console */ true,
      /* add sep */ true
    );
    testUtils();
    return;
  }

  const json = stats.toJson({}, true);
  const formattedWarnings = formatMessages(json.warnings);
  const formattedErrors = formatMessages(json.errors);

  if (hasErrors) {
    if (
      formattedErrors.filter(err => err.match("Cannot resolve module")).length
    ) {
      invalidate(formattedErrors);
      testUtils();
      return;
    }

    print(
      devServerFailedToCompileMsg(),
      /* clear console */ true,
      /* add sep */ true
    );

    // If errors exist, ignore warnings.
    if (formattedErrors.length) {
      print(
        addTopSpace(
          joinWithSeparator(`\n\n${separator()}\n\n`, formattedErrors)
        )
      );
      testUtils();
      return;
    }
  }

  if (hasWarnings && formattedWarnings.length) {
    print(
      joinWithSeparator(`\n${separator()}\n`, [
        joinWithSpace([
          devServerCompiledWithWarningsMsg(
            filename,
            flags,
            params,
            buildDuration
          ),
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
  compiler.plugin("invalid", () =>
    print(devServerInvalidBuildMsg(), /* clear console */ true)
  );
  compiler.plugin(
    "done",
    onDone.bind(null, filename, flags, params, compiler, invalidate)
  );
  return compiler;
}

/**
 * Creates webpack dev server.
 */
export default async function createWebpackDevServer(
  filename: string,
  flags: CLIFlags,
  params: AikParams
): Promise<Object> {
  const port = await detectPort(parseInt(flags.port, 10), flags.host);

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
      print(
        devServerRestartMsg(moduleName),
        /* clear console */ true,
        /* add sep */ true
      );
      server.close();
      createWebpackDevServer(filename, flags, params);
    } catch (e) {
      print(
        devServerModuleDoesntExists(moduleName, fileWithError),
        /* clear console */ true,
        /* add sep */ true
      );
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
    quiet: true,
    disableHostCheck: true,
    overlay: { errors: true },
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
}
