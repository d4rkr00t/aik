#! /usr/bin/env node
import meow from 'meow';
import chalk from 'chalk';
import aik from './lib/';
import isEmpty from 'lodash/lang/isEmpty';

const cli = meow({
  help: [
    chalk.green('Usage'),
    '  $ aik filename.js',
    '',
    chalk.green('Options'),
    `  ${chalk.yellow('-p, --port')}        Web server port. ${chalk.dim('[Default: 8080]')}`,
    `  ${chalk.yellow('-h, --host')}        Web server host. ${chalk.dim('[Default: localhost]')}`,
    `  ${chalk.yellow('-n, --ngrok')}       Exposes server to real world by ngrok.`,
    `  ${chalk.yellow('-c, --cssmodules')}  Enables css modules.`,
    `  ${chalk.yellow('--help')}            Shows help.`,
    '',
    chalk.green('Examples'),
    '  $ aik filename.js --port 3000 -n -c',
    chalk.dim('  Runs aik web server on 3000 port with ngrok and css modules support')
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
