'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.askPermission = askPermission;
exports.track = track;

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _insight = require('insight');

var _insight2 = _interopRequireDefault(_insight);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

const trackingCode = 'UA-88006586-1';
const trackingProvider = 'google';
const insight = new _insight2.default({ trackingCode: trackingCode, trackingProvider: trackingProvider, pkg: _package2.default });

function askPermission(cb) {
  if (insight.optOut === undefined) {
    // eslint-disable-line
    return insight.askPermission(null, cb);
  }
  cb();
}

function track(path, input, flags) {
  if (insight.optOut) return;

  const filteredFlags = Object.keys(flags).reduce((acc, flag) => {
    if (flag.length > 1) {
      acc[flag] = flags[flag];
    }

    return acc;
  }, {});

  if (!input[0]) {
    return flags.version ? setImmediate(() => insight.track('aik', 'version')) : setImmediate(() => insight.track('aik', 'help'));
  }

  setImmediate(() => insight.track.apply(insight, ['aik'].concat(_toConsumableArray(path), ['?' + _querystring2.default.stringify(filteredFlags)])));
}