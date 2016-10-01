'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onDone = onDone;
exports.createWebpackCompiler = createWebpackCompiler;
exports.default = createWebpackDevServer;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _configBuilder = require('./webpack/config-builder');

var _configBuilder2 = _interopRequireDefault(_configBuilder);

var _errorHelpers = require('./utils/error-helpers');

var _messages = require('./utils/messages');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * On done handler for webpack compiler.
 */
function onDone(filename, flags, params, stats) {
  const hasErrors = stats.hasErrors();
  const hasWarnings = stats.hasWarnings();

  (0, _messages.clearConsole)(true);

  if (!hasErrors && !hasWarnings) {
    return (0, _messages.devServerCompiledSuccessfullyMsg)(filename, flags, params);
  }

  const json = stats.toJson({}, true);
  const formattedWarnings = json.warnings.map(message => 'Warning in ' + (0, _errorHelpers.formatMessage)(message));
  let formattedErrors = json.errors.map(message => 'Error in ' + (0, _errorHelpers.formatMessage)(message));

  if (hasErrors) {
    (0, _messages.devServerFailedToCompileMsg)(filename, flags, params);

    // If there are any syntax errors, show just them.
    // This prevents a confusing ESLint parsing error
    // preceding a much more useful Babel syntax error.
    if (formattedErrors.some(_errorHelpers.isLikelyASyntaxError)) {
      formattedErrors = formattedErrors.filter(_errorHelpers.isLikelyASyntaxError);
    }

    // If errors exist, ignore warnings.
    return formattedErrors.forEach(message => console.log('\n', message)); // eslint-disable-line
  }

  if (hasWarnings) {
    (0, _messages.devServerCompiledWithWarningsMsg)(filename, flags, params);
    formattedWarnings.forEach(message => console.log('\n', message)); // eslint-disable-line
    (0, _messages.eslintExtraWarningMsg)();
  }
}

/**
 * Creates webpack compiler.
 */


function createWebpackCompiler(filename, flags, params, config) {
  const compiler = (0, _webpack2.default)(config);
  compiler.plugin('invalid', _messages.devServerInvalidBuildMsg);
  compiler.plugin('done', onDone.bind(null, filename, flags, params));
  return compiler;
}

/**
 * Creates webpack dev server.
 */
function createWebpackDevServer(filename, flags, params) {
  const config = (0, _configBuilder2.default)(filename, flags, params);
  const compiler = createWebpackCompiler(filename, flags, params, config);
  const server = new _webpackDevServer2.default(compiler, {
    historyApiFallback: true,
    hot: true,
    colors: true,
    quiet: true,
    stats: { colors: true }
  });

  return new Promise((resolve, reject) => {
    server.listen(flags.port, flags.host, err => {
      if (err) return reject(err);
      resolve(server);
    });
  });
}