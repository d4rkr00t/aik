'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.aikDevServer = aikDevServer;
exports.aikBuild = aikBuild;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _opn = require('opn');

var _opn2 = _interopRequireDefault(_opn);

var _webpackDevServer = require('./webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _webpackBuild = require('./webpack-build');

var _webpackBuild2 = _interopRequireDefault(_webpackBuild);

var _ngrok = require('./ngrok');

var _ngrok2 = _interopRequireDefault(_ngrok);

var _params = require('./utils/params');

var _params2 = _interopRequireDefault(_params);

var _messages = require('./utils/messages');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Aik dev server command
 */
function aikDevServer(input, flags) {
  (0, _messages.devServerInvalidBuildMsg)();

  var _input = _slicedToArray(input, 1);

  const filename = _input[0];

  const promiseList = [flags.ngrok && (0, _ngrok2.default)(flags)];

  return Promise.all(promiseList).then((_ref) => {
    var _ref2 = _slicedToArray(_ref, 1);

    let ngrokUrl = _ref2[0];

    const params = (0, _params2.default)(filename, flags, ngrokUrl, false);
    return (0, _webpackDevServer2.default)(filename, flags, params).then(server => [server, ngrokUrl]);
  }).then(results => {
    var _results = _slicedToArray(results, 2);

    const server = _results[0];
    const ngrokUrl = _results[1];

    if (flags.open) {
      (0, _opn2.default)(ngrokUrl ? ngrokUrl : `http://${ flags.host }:${ flags.port }`);
    }
    return results;
  });
}

/**
 * Aik build command
 */
function aikBuild(input, flags) {
  var _input2 = _slicedToArray(input, 1);

  const filename = _input2[0];

  const params = (0, _params2.default)(filename, flags, '', true);
  return (0, _webpackBuild2.default)(filename, flags, params);
}