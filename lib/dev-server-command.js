'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.requestCreatingAnEntryPoint = requestCreatingAnEntryPoint;
exports.createFile = createFile;

var _child_process = require('child_process');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _opn = require('opn');

var _opn2 = _interopRequireDefault(_opn);

var _fsExtra = require('fs-extra');

var _resolve = require('resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _webpackDevServer = require('./webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _ngrok = require('./ngrok');

var _ngrok2 = _interopRequireDefault(_ngrok);

var _params = require('./utils/params');

var _params2 = _interopRequireDefault(_params);

var _messages = require('./utils/messages');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function requestCreatingAnEntryPoint(filename) {
  return new Promise((resolve, reject) => {
    const rl = _readline2.default.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Create it? (Y/n): ', answer => {
      rl.close();
      if (!answer || answer === 'Y' || answer === 'y') {
        return resolve(true);
      }

      (0, _messages.fileDoesNotExistMsg)(filename);

      reject();
    });
  });
}

function createFile(filename) {
  return new Promise((resolve, reject) => {
    (0, _fsExtra.outputFile)(filename, '', err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function installModule(moduleName) {
  return new Promise(resolve => {
    try {
      _resolve2.default.sync(moduleName, { basedir: process.cwd() });
      (0, _messages.devServerSkipInstallingModuleMsg)(moduleName);
    } catch (e) {
      (0, _child_process.execSync)(`npm install ${moduleName} --silent`, { cwd: process.cwd() });
      (0, _messages.devServerInstallingModuleMsg)(moduleName);
    }

    resolve();
  });
}

/**
 * Aik dev server command
 */

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (input, flags) {
    var _input = _slicedToArray(input, 1);

    const filename = _input[0];


    try {
      _fs2.default.statSync(filename);
    } catch (error) {
      (0, _messages.devServerFileDoesNotExistMsg)(filename);

      const shouldCreateAnEntryPoint = yield requestCreatingAnEntryPoint(filename);
      if (shouldCreateAnEntryPoint) {
        yield createFile(filename);
      }
    }

    (0, _messages.devServerInvalidBuildMsg)();

    if (flags.react) {
      (0, _messages.devServerReactRequired)();
      yield installModule('react');
      yield installModule('react-dom');
    }

    const ngrokUrl = flags.ngrok && (yield (0, _ngrok2.default)(flags));
    const params = (0, _params2.default)(filename, flags, ngrokUrl, false);
    yield (0, _webpackDevServer2.default)(filename, flags, params);

    if (flags.open) {
      (0, _opn2.default)(ngrokUrl ? ngrokUrl : `http://${flags.host}:${flags.port}`);
    }
  });

  function aikDevServer(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return aikDevServer;
})();