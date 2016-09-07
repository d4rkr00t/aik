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

var _webpackConfigDev = require('./webpack-config-dev');

var _webpackConfigDev2 = _interopRequireDefault(_webpackConfigDev);

var _chalk2 = require('chalk');

var _chalk3 = _interopRequireDefault(_chalk2);

var _webpackErrorHelpers = require('./webpack-error-helpers');

var _webpackMessages = require('./webpack-messages');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
function onDone(imports, flags, filename, ngrokUrl, stats) {
  var hasErrors = stats.hasErrors();
  var hasWarnings = stats.hasWarnings();
  var log = imports.log;


  (0, _webpackMessages.clearConsole)(imports, true);

  if (!hasErrors && !hasWarnings) {
    return (0, _webpackMessages.devServerCompiledSuccessfullyMsg)(imports, flags, filename, ngrokUrl);
  }

  var json = stats.toJson();
  var formattedWarnings = json.warnings.map(function (message) {
    return 'Warning in ' + (0, _webpackErrorHelpers.formatMessage)(message);
  });
  var formattedErrors = json.errors.map(function (message) {
    return 'Error in ' + (0, _webpackErrorHelpers.formatMessage)(message);
  });

  if (hasErrors) {
    (0, _webpackMessages.devServerFailedToCompileMsg)(imports, flags, filename, ngrokUrl);

    // If there are any syntax errors, show just them.
    // This prevents a confusing ESLint parsing error
    // preceding a much more useful Babel syntax error.
    if (formattedErrors.some(_webpackErrorHelpers.isLikelyASyntaxError)) {
      formattedErrors = formattedErrors.filter(_webpackErrorHelpers.isLikelyASyntaxError);
    }

    // If errors exist, ignore warnings.
    return formattedErrors.forEach(function (message) {
      return log('\n', message);
    });
  }

  if (hasWarnings) {
    (0, _webpackMessages.devServerCompiledWithWarningsMsg)(imports, flags, filename, ngrokUrl);
    formattedWarnings.forEach(function (message) {
      return log('\n', message);
    });
    (0, _webpackMessages.eslintExtraWarningMsg)(imports);
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
function createWebpackCompiler(config, flags, filename, ngrokUrl) {
  var compiler = (0, _webpack2.default)(config);
  var imports = { log: console.log.bind(console), chalk: _chalk3.default }; // eslint-disable-line
  compiler.plugin('invalid', _webpackMessages.devServerInvalidBuildMsg.bind(null, imports));
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
function createWebpackDevServer(filename, flags, ngrokUrl) {
  var config = (0, _webpackConfigDev2.default)(filename, flags);
  var compiler = createWebpackCompiler(config, flags, filename, ngrokUrl);
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