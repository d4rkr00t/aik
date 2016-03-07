'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = aikDevServer;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _opn = require('opn');

var _opn2 = _interopRequireDefault(_opn);

var _webpack = require('./webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _ngrok = require('./ngrok');

var _ngrok2 = _interopRequireDefault(_ngrok);

var _restart = require('./restart');

var _restart2 = _interopRequireDefault(_restart);

var _banner = require('./banner');

var _banner2 = _interopRequireDefault(_banner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Aik dev server
 *
 * @param {String[]} input
 * @param {Flags} flags
 * @param {Object} console
 *
 * @return {Type}
 */
function aikDevServer(input, flags, console) {
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


    console.log((0, _banner2.default)(flags, ngrokUrl, _chalk2.default)); // eslint-disable-line

    return results;
  }).then(function (results) {
    var _results3 = _slicedToArray(results, 1);

    var server = _results3[0];


    (0, _restart2.default)(input, flags, { prc: process, server: server, chalk: _chalk2.default });

    return results;
  }).catch(function (err) {
    console.error(_chalk2.default.red(err)); // eslint-disable-line

    throw err;
  });
}

/**
 * CLI Flags
 *
 * @typedef {Object} Flags
 *
 * @property {String} port
 * @property {String} host
 * @property {String} react
 * @property {Boolean} ngrok
 * @property {Boolean} open
 * @property {Boolean} cssmodules
 */