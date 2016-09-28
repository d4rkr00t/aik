'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onDone = onDone;
exports.createWebpackCompiler = createWebpackCompiler;
exports.default = createWebpackDevServer;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _config = require('./webpack/config');

var _config2 = _interopRequireDefault(_config);

var _chalk2 = require('chalk');

var _chalk3 = _interopRequireDefault(_chalk2);

var _errorHelpers = require('./webpack/error-helpers');

var _helpers = require('./webpack/config/helpers');

var _messages = require('./webpack/messages');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * On done handler for webpack compiler.
 */
function onDone(imports, flags, filename, ngrokUrl, template, stats) {
  var hasErrors = stats.hasErrors();
  var hasWarnings = stats.hasWarnings();
  var log = imports.log;


  (0, _messages.clearConsole)(imports, true);

  if (!hasErrors && !hasWarnings) {
    return (0, _messages.devServerCompiledSuccessfullyMsg)(imports, flags, filename, ngrokUrl, template);
  }

  var json = stats.toJson({}, true);
  var formattedWarnings = json.warnings.map(function (message) {
    return 'Warning in ' + (0, _errorHelpers.formatMessage)(message);
  });
  var formattedErrors = json.errors.map(function (message) {
    return 'Error in ' + (0, _errorHelpers.formatMessage)(message);
  });

  if (hasErrors) {
    (0, _messages.devServerFailedToCompileMsg)(imports, flags, filename, ngrokUrl, template);

    // If there are any syntax errors, show just them.
    // This prevents a confusing ESLint parsing error
    // preceding a much more useful Babel syntax error.
    if (formattedErrors.some(_errorHelpers.isLikelyASyntaxError)) {
      formattedErrors = formattedErrors.filter(_errorHelpers.isLikelyASyntaxError);
    }

    // If errors exist, ignore warnings.
    return formattedErrors.forEach(function (message) {
      return log('\n', message);
    });
  }

  if (hasWarnings) {
    (0, _messages.devServerCompiledWithWarningsMsg)(imports, flags, filename, ngrokUrl, template);
    formattedWarnings.forEach(function (message) {
      return log('\n', message);
    });
    (0, _messages.eslintExtraWarningMsg)(imports);
  }
}

/**
 * Creates webpack compiler.
 */
function createWebpackCompiler(config, flags, filename, ngrokUrl, template) {
  var compiler = (0, _webpack2.default)(config);
  var imports = { log: console.log.bind(console), chalk: _chalk3.default }; // eslint-disable-line
  var templateRelative = _path2.default.relative(process.cwd(), template);
  compiler.plugin('invalid', _messages.devServerInvalidBuildMsg.bind(null, imports));
  compiler.plugin('done', onDone.bind(null, imports, flags, filename, ngrokUrl, templateRelative));
  return compiler;
}

/**
 * Creates webpack dev server.
 */
function createWebpackDevServer(filename, flags, ngrokUrl) {
  var template = (0, _helpers.getTemplatePath)(filename);
  var config = (0, _config2.default)(filename, flags, false, template, '');
  var compiler = createWebpackCompiler(config, flags, filename, ngrokUrl, template);
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