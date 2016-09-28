/* @flow */

import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfigBuilder from './webpack/config';
import _chalk from 'chalk';
import { isLikelyASyntaxError, formatMessage } from './webpack/error-helpers';
import { getTemplatePath } from './webpack/config/helpers';
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
export function onDone(imports:WebpackMessageImports, flags:CLIFlags, filename:string, ngrokUrl:NgrokUrl, template:string, stats:Object) {
  const hasErrors = stats.hasErrors();
  const hasWarnings = stats.hasWarnings();
  const { log } = imports;

  clearConsole(imports, true);

  if (!hasErrors && !hasWarnings) {
    return devServerCompiledSuccessfullyMsg(imports, flags, filename, ngrokUrl, template);
  }

  const json = stats.toJson({}, true);
  const formattedWarnings = json.warnings.map(message => 'Warning in ' + formatMessage(message));
  let formattedErrors = json.errors.map(message => 'Error in ' + formatMessage(message));

  if (hasErrors) {
    devServerFailedToCompileMsg(imports, flags, filename, ngrokUrl, template);

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
    devServerCompiledWithWarningsMsg(imports, flags, filename, ngrokUrl, template);
    formattedWarnings.forEach(message => log('\n', message));
    eslintExtraWarningMsg(imports);
  }
}

/**
 * Creates webpack compiler.
 */
export function createWebpackCompiler(config:Object, flags:CLIFlags, filename:string, ngrokUrl:NgrokUrl, template:string) {
  const compiler = webpack(config);
  const imports = { log: console.log.bind(console), chalk: _chalk }; // eslint-disable-line
  const templateRelative = path.relative(process.cwd(), template);
  compiler.plugin('invalid', devServerInvalidBuildMsg.bind(null, imports));
  compiler.plugin('done', onDone.bind(null, imports, flags, filename, ngrokUrl, templateRelative));
  return compiler;
}

/**
 * Creates webpack dev server.
 */
export default function createWebpackDevServer(filename:string, flags:CLIFlags, ngrokUrl:NgrokUrl) : Promise<Object> {
  const template = getTemplatePath(filename);
  const config = webpackConfigBuilder(filename, flags, false, template, '');
  const compiler = createWebpackCompiler(config, flags, filename, ngrokUrl, template);
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
