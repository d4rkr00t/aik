'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearConsole = clearConsole;
exports.isLikelyASyntaxError = isLikelyASyntaxError;
exports.formatMessage = formatMessage;
exports.onInvalidBuild = onInvalidBuild;
exports.onDone = onDone;
exports.createWebpackCompiler = createWebpackCompiler;
exports.default = createWebpackDevServer;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _webpackConfigBuilder = require('./webpack-config-builder');

var _webpackConfigBuilder2 = _interopRequireDefault(_webpackConfigBuilder);

var _chalk2 = require('chalk');

var _chalk3 = _interopRequireDefault(_chalk2);

var _webpackMessages = require('./webpack-messages');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SYNTAX_ERROR_LABEL = 'Syntax error:';

/**
 * Moves current line to the most top of console.
 */
function clearConsole() {
  process.stdout.write(_chalk3.default.dim('----------------------------------'));
  process.stdout.write('\x1B[2J\x1B[0f');
}

/**
 * Checks whether error is syntax error.
 *
 * @param {String} message
 *
 * @return {Boolean}
 */
function isLikelyASyntaxError(message) {
  return message.indexOf(SYNTAX_ERROR_LABEL) !== -1;
}

/**
 * Makes some common errors shorter.
 *
 * @param {String} message
 *
 * @return {String}
 */
function formatMessage(message) {
  return message
  // Babel syntax error
  .replace('Module build failed: SyntaxError:', SYNTAX_ERROR_LABEL)
  // Webpack file not found error
  .replace(/Module not found: Error: Cannot resolve 'file' or 'directory'/, 'Module not found:')
  // Internal stacks are generally useless so we strip them
  .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '') // at ... ...:x:y
  // Webpack loader names obscure CSS filenames
  .replace('./~/css-loader!./~/postcss-loader!', '');
}

/**
 * On invalid handler for webpack compiler.
 */
function onInvalidBuild() {
  clearConsole();
  console.log((0, _webpackMessages.compiling)(_chalk3.default)); // eslint-disable-line
}

/**
 * On done handler for webpack compiler.
 *
 * @param {Object} imports
 * @param {Function} imports.log
 * @param {Object} imports.chalk
 * @param {Flags} flags
 * @param {String} ngrokUrl
 * @param {Object} stats - webpack build stats
 *
 * @return {void}
 */
function onDone(imports, flags, ngrokUrl, stats) {
  var hasErrors = stats.hasErrors();
  var hasWarnings = stats.hasWarnings();
  var log = imports.log;
  var chalk = imports.chalk;


  clearConsole();

  if (!hasErrors && !hasWarnings) {
    return log((0, _webpackMessages.compiledSuccessfully)(chalk, flags, ngrokUrl));
  }

  var json = stats.toJson();
  var formattedWarnings = json.warnings.map(function (message) {
    return 'Warning in ' + formatMessage(message);
  });
  var formattedErrors = json.errors.map(function (message) {
    return 'Error in ' + formatMessage(message);
  });

  if (hasErrors) {
    log((0, _webpackMessages.failedToCompile)(chalk));

    // If there are any syntax errors, show just them.
    // This prevents a confusing ESLint parsing error
    // preceding a much more useful Babel syntax error.
    if (formattedErrors.some(isLikelyASyntaxError)) {
      formattedErrors = formattedErrors.filter(isLikelyASyntaxError);
    }

    // If errors exist, ignore warnings.
    return formattedErrors.forEach(function (message) {
      return log('\n', message);
    });
  }

  if (hasWarnings) {
    log((0, _webpackMessages.compiledWithWarnings)(chalk));
    formattedWarnings.forEach(function (message) {
      return log('\n', message);
    });
    log((0, _webpackMessages.eslintExtraWarning)(chalk));
  }
}

/**
 * Creates webpack compiler.
 *
 * @param {Object} config - webpack config
 * @param {Flags} flags
 * @param {String} ngrokUrl
 *
 * @return {Object}
 */
function createWebpackCompiler(config, flags, ngrokUrl) {
  var compiler = (0, _webpack2.default)(config);
  var imports = { log: console.log.bind(console), chalk: _chalk3.default }; // eslint-disable-line
  compiler.plugin('invalid', onInvalidBuild);
  compiler.plugin('done', onDone.bind(null, imports, flags, ngrokUrl));
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
function createWebpackDevServer(filename, flags, ngrokUrl) {
  var config = (0, _webpackConfigBuilder2.default)(filename, flags);
  var compiler = createWebpackCompiler(config, flags, ngrokUrl);
  var server = new _webpackDevServer2.default(compiler, {
    historyApiFallback: true,
    hot: true,
    colors: true,
    quiet: true,
    stats: { colors: true }
  });

  return new Promise(function (resolve, reject) {
    server.listen(flags.port, flags.host, function (err) {
      if (err) return reject(err);
      resolve(server);
    });
  });
}