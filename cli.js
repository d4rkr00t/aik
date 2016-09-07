#! /usr/bin/env node
'use strict';

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _updateNotifier = require('update-notifier');

var _updateNotifier2 = _interopRequireDefault(_updateNotifier);

var _package = require('./package.json');

var _package2 = _interopRequireDefault(_package);

var _lib = require('./lib/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _updateNotifier2.default)({ pkg: _package2.default }).notify();

var cli = (0, _meow2.default)({
  help: [_chalk2.default.green('Usage'), '  $ aik filename.js', '', _chalk2.default.green('Options'), '  ' + _chalk2.default.yellow('-b, --build') + '       Build production version for given entry point. [Default output: dist]', '  ' + _chalk2.default.yellow('-p, --port') + '        Web server port. ' + _chalk2.default.dim('[Default: 4444]'), '  ' + _chalk2.default.yellow('-h, --host') + '        Web server host. ' + _chalk2.default.dim('[Default: localhost]'), '  ' + _chalk2.default.yellow('-r, --react') + '       Enables react hot loader.', '  ' + _chalk2.default.yellow('-n, --ngrok') + '       Exposes server to real world by ngrok.', '  ' + _chalk2.default.yellow('-o, --open') + '        Opens web server url in default browser.', '  ' + _chalk2.default.yellow('-c, --cssmodules') + '  Enables css modules.', '  ' + _chalk2.default.yellow('-v, --version') + '     Shows version.', '  ' + _chalk2.default.yellow('--help') + '            Shows help.', '', _chalk2.default.green('Examples'), '  $ aik filename.js --port 3000 -n -c -r', _chalk2.default.dim('  Runs aik web server on 3000 port with ngrok, css modules support and react hot loader'), '', '  $ aik filename.js --build', _chalk2.default.dim('  Builds filename.js for production use and saves output to dist folder.')]
}, {
  alias: {
    b: 'build',
    p: 'port',
    h: 'host',
    r: 'react',
    n: 'ngrok',
    o: 'open',
    c: 'cssmodules',
    v: 'version'
  },
  default: {
    port: 4444,
    host: 'localhost'
  }
});

var input = cli.input || [];
var flags = cli.flags || {};

if ((0, _isEmpty2.default)(input) || flags.help) {
  console.log(cli.help); // eslint-disable-line
} else if (flags.version) {
  console.log(_package2.default.version); // eslint-disable-line
} else if (flags.build) {
  (0, _lib.aikBuild)(input, flags, console);
} else {
  (0, _lib.aikDevServer)(input, flags, console);
}