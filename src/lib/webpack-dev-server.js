/* @flow */

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfigBuilder from './webpack/config';
import { isLikelyASyntaxError, formatMessage } from './webpack/error-helpers';
import {
  clearConsole,
  eslintExtraWarningMsg,
  devServerInvalidBuildMsg,
  devServerCompiledSuccessfullyMsg,
  devServerFailedToCompileMsg,
  devServerCompiledWithWarningsMsg
} from './webpack/messages';

/**
 * On done handler for webpack compiler.
 */
export function onDone(filename:string, flags:CLIFlags, params:AikParams, stats:Object) {
  const hasErrors = stats.hasErrors();
  const hasWarnings = stats.hasWarnings();

  clearConsole(true);

  if (!hasErrors && !hasWarnings) {
    return devServerCompiledSuccessfullyMsg(filename, flags, params);
  }

  const json = stats.toJson({}, true);
  const formattedWarnings = json.warnings.map(message => 'Warning in ' + formatMessage(message));
  let formattedErrors = json.errors.map(message => 'Error in ' + formatMessage(message));

  if (hasErrors) {
    devServerFailedToCompileMsg(filename, flags, params);

    // If there are any syntax errors, show just them.
    // This prevents a confusing ESLint parsing error
    // preceding a much more useful Babel syntax error.
    if (formattedErrors.some(isLikelyASyntaxError)) {
      formattedErrors = formattedErrors.filter(isLikelyASyntaxError);
    }

    // If errors exist, ignore warnings.
    return formattedErrors.forEach(message => console.log('\n', message));
  }

  if (hasWarnings) {
    devServerCompiledWithWarningsMsg(filename, flags, params);
    formattedWarnings.forEach(message => console.log('\n', message));
    eslintExtraWarningMsg();
  }
}

/**
 * Creates webpack compiler.
 */
export function createWebpackCompiler(filename:string, flags:CLIFlags, params:AikParams, config:Object) {
  const compiler = webpack(config);
  compiler.plugin('invalid', devServerInvalidBuildMsg);
  compiler.plugin('done', onDone.bind(null, filename, flags, params));
  return compiler;
}

/**
 * Creates webpack dev server.
 */
export default function createWebpackDevServer(filename:string, flags:CLIFlags, params:AikParams) : Promise<Object> {
  const config = webpackConfigBuilder(filename, flags, params);
  const compiler = createWebpackCompiler(filename, flags, params, config);
  const server = new WebpackDevServer(compiler, {
    historyApiFallback: true,
    hot: true,
    colors: true,
    quiet: true,
    stats: { colors: true }
  });

  return new Promise((resolve, reject) => {
    server.listen(flags.port, flags.host, (err) => {
      if (err) return reject(err);
      resolve(server);
    });
  });
}
