#!/usr/bin/env node

/* @flow */

import meow from 'meow';
import chalk from 'chalk';
import pkg from './package.json';
import { aikDevServer, aikBuild } from './lib/';

const cli = meow({
  help: [
    chalk.green('Usage'),
    '  $ aik filename.js',
    '',
    chalk.green('Options'),
    `  ${chalk.yellow('-b, --build')}       Build production version for given entry point. [Default output: dist]`,
    `  ${chalk.yellow('-u, --base')}        Base path from witch urls in build begins`,
    `  ${chalk.yellow('-p, --port')}        Web server port. ${chalk.dim('[Default: 4444]')}`,
    `  ${chalk.yellow('-h, --host')}        Web server host. ${chalk.dim('[Default: localhost]')}`,
    `  ${chalk.yellow('-r, --react')}       Enables react hot loader.`,
    `  ${chalk.yellow('-n, --ngrok')}       Exposes server to real world by ngrok.`,
    `  ${chalk.yellow('-o, --open')}        Opens web server url in default browser.`,
    `  ${chalk.yellow('-c, --cssmodules')}  Enables css modules.`,
    `  ${chalk.yellow('-v, --version')}     Shows version.`,
    `  ${chalk.yellow('--help')}            Shows help.`,
    '',
    chalk.green('Examples'),
    '  $ aik filename.js --port 3000 -n -c -r',
    chalk.dim('  Runs aik web server on 3000 port with ngrok, css modules support and react hot loader'),
    '',
    '  $ aik filename.js --build',
    chalk.dim('  Builds filename.js for production use and saves output to dist folder.')
  ]
}, {
  alias: {
    b: 'build',
    u: 'base',
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

const input = cli.input || [];
const flags = cli.flags || {};

if (!input.length || flags.help) {
  console.log(cli.help); // eslint-disable-line
} else if (flags.version) {
  console.log(pkg.version); // eslint-disable-line
} else if (flags.build) {
  aikBuild(input, flags)
    .catch((err) => console.error(chalk.red(err))); // eslint-disable-line
} else {
  aikDevServer(input, flags)
    .catch((err) => console.error(chalk.red(err))); // eslint-disable-line
}
