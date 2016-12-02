'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onDone = onDone;
exports.createWebpackCompiler = createWebpackCompiler;
exports.default = createWebpackDevServer;

var _detectPort = require('detect-port');

var _detectPort2 = _interopRequireDefault(_detectPort);

var _connectHistoryApiFallback = require('connect-history-api-fallback');

var _connectHistoryApiFallback2 = _interopRequireDefault(_connectHistoryApiFallback);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _configBuilder = require('./webpack/config-builder');

var _configBuilder2 = _interopRequireDefault(_configBuilder);

var _testUtils = require('./utils/test-utils');

var _testUtils2 = _interopRequireDefault(_testUtils);

var _errorHelpers = require('./utils/error-helpers');

var _messages = require('./utils/messages');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * On done handler for webpack compiler.
 */
function onDone(filename, flags, params, stats) {
  const hasErrors = stats.hasErrors();
  const hasWarnings = stats.hasWarnings();
  const buildDuration = stats.endTime - stats.startTime;

  (0, _messages.clearConsole)(true);

  if (!hasErrors && !hasWarnings) {
    (0, _messages.devServerCompiledSuccessfullyMsg)(filename, flags, params, buildDuration);
    (0, _testUtils2.default)();
    return;
  }

  const json = stats.toJson({}, true);
  const formattedWarnings = json.warnings.map(message => 'Warning in ' + (0, _errorHelpers.formatMessage)(message));
  let formattedErrors = json.errors.map(message => 'Error in ' + (0, _errorHelpers.formatMessage)(message));

  if (hasErrors) {
    (0, _messages.devServerFailedToCompileMsg)();

    // If there are any syntax errors, show just them.
    // This prevents a confusing ESLint parsing error
    // preceding a much more useful Babel syntax error.
    if (formattedErrors.some(_errorHelpers.isLikelyASyntaxError)) {
      formattedErrors = formattedErrors.filter(_errorHelpers.isLikelyASyntaxError);
    }

    // If errors exist, ignore warnings.
    formattedErrors.forEach(message => console.log('\n', message)); // eslint-disable-line
    (0, _testUtils2.default)();
    return;
  }

  if (hasWarnings) {
    (0, _messages.devServerCompiledWithWarningsMsg)(filename, flags, params, buildDuration);
    formattedWarnings.forEach(message => console.log('\n', message)); // eslint-disable-line
    (0, _messages.eslintExtraWarningMsg)();
  }

  (0, _testUtils2.default)();
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
  return (0, _detectPort2.default)(flags.port).then(port => {
    if (port !== flags.port) {
      flags.oldPort = flags.port;
      flags.port = port;
    }

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

        server.use((0, _connectHistoryApiFallback2.default)({
          disableDotRule: true,
          htmlAcceptHeaders: ['text/html']
        }));

        resolve(server);
      });
    });
  });
}