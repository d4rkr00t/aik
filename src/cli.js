#! /usr/bin/env node

import meow from 'meow';
import aik from './lib/';

const cli = meow({
  help: [
    'Usage',
    '  $ aik [input]',
    '',
    'Options',
    '  --foo  Lorem ipsum. [Default: false]',
    '',
    'Examples',
    '  $ aik',
    '  unicorns & rainbows',
    '  $ aik ponies',
    '  ponies & rainbows'
  ]
});

const input = cli.input || [];
const flags = cli.flags || {};

console.log(cli.help); // eslint-disable-line

aik(input, flags);
