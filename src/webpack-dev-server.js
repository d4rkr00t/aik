/* @flow */

import detectPort from 'detect-port';
import historyApiFallback from 'connect-history-api-fallback';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfigBuilder from './webpack/config-builder';
import testUtils from './utils/test-utils';
import { isLikelyASyntaxError, formatMessage } from './utils/error-helpers';
import {
  clearConsole,
  eslintExtraWarningMsg,
  devServerInvalidBuildMsg,
  devServerCompiledSuccessfullyMsg,
  devServerFailedToCompileMsg,
  devServerCompiledWithWarningsMsg
} from './utils/messages';

/**
 * On done handler for webpack compiler.
 */
export function onDone(filename: string, flags: CLIFlags, params: AikParams, stats: Object) {
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
  const formattedWarnings = json.warnings.map(message => 'Warning in ' + formatMessage(message));
  let formattedErrors = json.errors.map(message => 'Error in ' + formatMessage(message));

  if (hasErrors) {
    devServerFailedToCompileMsg();

    // If there are any syntax errors, show just them.
    // This prevents a confusing ESLint parsing error
    // preceding a much more useful Babel syntax error.
    if (formattedErrors.some(isLikelyASyntaxError)) {
      formattedErrors = formattedErrors.filter(isLikelyASyntaxError);
    }


    // If errors exist, ignore warnings.
    formattedErrors.forEach(message => console.log('\n', message)); // eslint-disable-line
    testUtils();
    return;
  }

  if (hasWarnings) {
    devServerCompiledWithWarningsMsg(filename, flags, params, buildDuration);
    formattedWarnings.forEach(message => console.log('\n', message)); // eslint-disable-line
    eslintExtraWarningMsg();
  }

  testUtils();
}

/**
 * Creates webpack compiler.
 */
export function createWebpackCompiler(filename: string, flags: CLIFlags, params: AikParams, config: Object) {
  const compiler = webpack(config);
  compiler.plugin('invalid', devServerInvalidBuildMsg);
  compiler.plugin('done', onDone.bind(null, filename, flags, params));
  return compiler;
}

/**
 * Creates webpack dev server.
 */
export default function createWebpackDevServer(filename: string, flags: CLIFlags, params: AikParams): Promise<Object> {
  return detectPort(flags.port).then(port => {
    if (port !== flags.port) {
      flags.oldPort = flags.port;
      flags.port = port;
    }

    const config = webpackConfigBuilder(filename, flags, params);
    const compiler = createWebpackCompiler(filename, flags, params, config);
    const server = new WebpackDevServer(compiler, {
      // Enable gzip compression of generated files.
      compress: true,

      // Silence WebpackDevServer's own logs since they're generally not useful.
      // It will still show compile warnings and errors with this setting.
      clientLogLevel: 'none',
      historyApiFallback: true,
      hot: true,
      colors: true,
      quiet: true,
      stats: { colors: true }
    });

    return new Promise((resolve, reject) => {
      server.listen(flags.port, flags.host, (err) => {
        if (err) return reject(err);

        server.use(historyApiFallback({
          disableDotRule: true,
          htmlAcceptHeaders: ['text/html']
        }));

        resolve(server);
      });
    });
  });
}
