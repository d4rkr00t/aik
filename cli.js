#! /usr/bin/env node
'use strict';

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _lib = require('./lib/');

var _lib2 = _interopRequireDefault(_lib);

var _isEmpty = require('lodash/lang/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cli = (0, _meow2.default)({
  help: ['Usage', '  $ aik filename.js', '', 'Options', '  -p, --port  Web server port. [Default: 8080]', '  -h, --host  Web server host. [Default: localhost]', '  -n, --ngrok  Exposes server to real world by ngrok.', '  -c, --cssmodules  Enables css modules.', '  --help  Shows help.', '', 'Examples', '  $ aik filename.js --port 3000 -n -cm', '  Runs aik web server on 3000 port with ngrok and css modules support']
}, {
  alias: {
    p: 'port',
    h: 'host',
    n: 'ngrok',
    c: 'cssmodules'
  },
  default: {
    port: 8080,
    host: 'localhost'
  }
});

var input = cli.input || [];
var flags = cli.flags || {};

if ((0, _isEmpty2.default)(input) || flags.help) {
  console.log(cli.help); // eslint-disable-line
} else {
    (0, _lib2.default)(input, flags);
  }