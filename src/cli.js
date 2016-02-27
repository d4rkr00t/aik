#! /usr/bin/env node
import meow from 'meow';
import aik from './lib/';
import isEmpty from 'lodash/lang/isEmpty';

const cli = meow({
  help: [
    'Usage',
    '  $ aik filename.js',
    '',
    'Options',
    '  -p, --port  Web server port. [Default: 8080]',
    '  -h, --host  Web server host. [Default: localhost]',
    '  -n, --ngrok  Exposes server to real world by ngrok.',
    '  -c, --cssmodules  Enables css modules.',
    '  --help  Shows help.',
    '',
    'Examples',
    '  $ aik filename.js --port 3000 -n -cm',
    '  Runs aik web server on 3000 port with ngrok and css modules support'
  ]
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

const input = cli.input || [];
const flags = cli.flags || {};

if (isEmpty(input) || flags.help) {
  console.log(cli.help); // eslint-disable-line
} else {
  aik(input, flags);
}
