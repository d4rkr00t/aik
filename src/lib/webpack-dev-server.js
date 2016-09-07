import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfigBuilder from './webpack-config-dev';
import _chalk from 'chalk';

import { isLikelyASyntaxError, formatMessage } from './webpack-error-helpers';

import {
  clearConsole,
  eslintExtraWarningMsg,
  devServerInvalidBuildMsg,
  devServerCompiledSuccessfullyMsg,
  devServerFailedToCompileMsg,
  devServerCompiledWithWarningsMsg
} from './webpack-messages';

/**
 * On done handler for webpack compiler.
 *
 * @param {Object} imports
 * @param {Function} imports.log
 * @param {Object} imports.chalk
 * @param {Flags} flags
 * @param {String} filename
 * @param {String} ngrokUrl
 * @param {Object} stats - webpack build stats
 *
 * @return {void}
 */
export function onDone(imports, flags, filename, ngrokUrl, stats) {
  const hasErrors = stats.hasErrors();
  const hasWarnings = stats.hasWarnings();
  const { log } = imports;

  clearConsole(imports, true);

  if (!hasErrors && !hasWarnings) {
    return devServerCompiledSuccessfullyMsg(imports, flags, filename, ngrokUrl);
  }

  const json = stats.toJson({}, true);
  const formattedWarnings = json.warnings.map(message => 'Warning in ' + formatMessage(message));
  let formattedErrors = json.errors.map(message => 'Error in ' + formatMessage(message));

  if (hasErrors) {
    devServerFailedToCompileMsg(imports, flags, filename, ngrokUrl);

    // If there are any syntax errors, show just them.
    // This prevents a confusing ESLint parsing error
    // preceding a much more useful Babel syntax error.
    if (formattedErrors.some(isLikelyASyntaxError)) {
      formattedErrors = formattedErrors.filter(isLikelyASyntaxError);
    }

    // If errors exist, ignore warnings.
    return formattedErrors.forEach(message => log('\n', message));
  }

  if (hasWarnings) {
    devServerCompiledWithWarningsMsg(imports, flags, filename, ngrokUrl);
    formattedWarnings.forEach(message => log('\n', message));
    eslintExtraWarningMsg(imports);
  }
}

/**
 * Creates webpack compiler.
 *
 * @param {Object} config - webpack config
 * @param {Flags} flags
 * @param {String} filename
 * @param {String} ngrokUrl
 *
 * @return {Object}
 */
export function createWebpackCompiler(config, flags, filename, ngrokUrl) {
  const compiler = webpack(config);
  const imports = { log: console.log.bind(console), chalk: _chalk }; // eslint-disable-line
  compiler.plugin('invalid', devServerInvalidBuildMsg.bind(null, imports));
  compiler.plugin('done', onDone.bind(null, imports, flags, filename, ngrokUrl));
  return compiler;
}

/**
 * Creates webpack dev server.
 *
 * @param {String} filename
 * @param {Flags} flags
 * @param {String} ngrokUrl
 *
 * @return {Promise}
 */
export default function createWebpackDevServer(filename, flags, ngrokUrl) {
  const config = webpackConfigBuilder(filename, flags);
  const compiler = createWebpackCompiler(config, flags, filename, ngrokUrl);
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
