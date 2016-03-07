'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.banner = banner;
exports.default = aikDevServer;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _opn = require('opn');

var _opn2 = _interopRequireDefault(_opn);

var _webpack = require('./webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _ngrok = require('./ngrok');

var _ngrok2 = _interopRequireDefault(_ngrok);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Generates banner for aik.
 *
 * @param {String} filename
 * @param {Flags} flags
 * @param {String} ngrokUrl
 *
 * @return {String}
 */
function banner(filename, flags, ngrokUrl) {
  return '\n  /$$$$$$  /$$$$$$ /$$   /$$\n /$$__  $$|_  $$_/| $$  /$$/\n| $$    $$  | $$  | $$ /$$/\n| $$$$$$$$  | $$  | $$$$$/\n| $$__  $$  | $$  | $$  $$\n| $$  | $$  | $$  | $$  $$\n| $$  | $$ /$$$$$$| $$   $$\n|__/  |__/|______/|__/  __/\n\n     ' + _chalk2.default.yellow('Frontend Playground') + '\n\n' + _chalk2.default.magenta('Server:') + '            ' + _chalk2.default.cyan('http://' + flags.host + ':' + flags.port) + '\n' + _chalk2.default.magenta('CSS Modules:') + '       ' + (flags.cssmodules ? _chalk2.default.green('enabled') : _chalk2.default.dim('disabled')) + '\n' + _chalk2.default.magenta('Ngrok:') + '             ' + (flags.ngrok ? _chalk2.default.green(ngrokUrl) : _chalk2.default.dim('disabled')) + '\n' + _chalk2.default.magenta('React Hot Loader:') + '  ' + (flags.react ? _chalk2.default.green('enabled') : _chalk2.default.dim('disabled')) + '\n';
}

/**
 * Aik dev server
 *
 * @param {String[]} input
 * @param {Flags} flags
 *
 * @return {Type}
 */
function aikDevServer(input, flags) {
  var _input = _slicedToArray(input, 1);

  var filename = _input[0];

  var promiseList = [(0, _webpack2.default)(filename, flags), flags.ngrok && (0, _ngrok2.default)(flags)];

  return Promise.all(promiseList).then(function (results) {
    if (flags.open) {
      var _results = _slicedToArray(results, 2);

      var ngrokUrl = _results[1];


      (0, _opn2.default)(flags.ngrok ? ngrokUrl : 'http://' + flags.host + ':' + flags.port);
    }

    return results;
  }).then(function (results) {
    var _results2 = _slicedToArray(results, 2);

    var ngrokUrl = _results2[1];


    console.log(banner(filename, flags, ngrokUrl)); // eslint-disable-line
  }).catch(function (err) {
    console.error(_chalk2.default.red(err)); // eslint-disable-line

    throw err;
  });
}

/**
 * CLI Flags
 * @typedef {Object} Flags
 * @property {String} port
 * @property {String} host
 * @property {String} react
 * @property {Boolean} ngrok
 * @property {Boolean} cssmodules
 */