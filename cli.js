#!/usr/bin/env node

/* @flow */

require("babel-polyfill");

const meow = require("meow");
const chalk = require("chalk");
const aik = require("./lib");
const insight = aik.analytics;
const cli = meow(
  {
    help: [
      chalk.green("Usage"),
      "  $ aik filename.js",
      "",
      chalk.green("Options"),
      `  ${chalk.yellow("-b, --build")}       Build production version for given entry point. [Default output: dist]`,
      `  ${chalk.yellow("-u, --base")}        Base path with which URLs in build begins`,
      `  ${chalk.yellow("-p, --port")}        Web server port. ${chalk.dim("[Default: 4444]")}`,
      `  ${chalk.yellow("-h, --host")}        Web server host. ${chalk.dim("[Default: localhost]")}`,
      `  ${chalk.yellow("-n, --ngrok")}       Exposes server to the real world by ngrok.`,
      `  ${chalk.yellow("-o, --open")}        Opens web server URL in the default browser.`,
      `  ${chalk.yellow("-v, --version")}     Shows version.`,
      `  ${chalk.yellow("--help")}            Shows help.`,
      "",
      chalk.green("Examples"),
      "  $ aik filename.js --port 3000 -n",
      chalk.dim("  Runs aik web server on 3000 port with ngrok."),
      "",
      "  $ aik filename.js --build",
      chalk.dim("  Builds filename.js for production use and saves the output to dist folder.")
    ]
  },
  {
    alias: {
      b: "build",
      u: "base",
      p: "port",
      h: "host",
      r: "react",
      n: "ngrok",
      o: "open",
      v: "version"
    }
  }
);

const input = cli.input || [];
const flags = cli.flags || {};

aik.deprecation.flagDeprecationWarnings(flags, () => {
  insight.askPermission(() => {
    if (!input.length) {
      insight.track([], input, flags);
      console.log(cli.help); // eslint-disable-line
    } else if (flags.build) {
      insight.track(["build"], input, flags);
      aik.build(input, flags).catch(err => err && console.error(chalk.red(err))); // eslint-disable-line
    } else {
      insight.track(["dev-server"], input, flags);
      aik.devServer(input, flags).catch(
        // eslint-disable-next-line
        err => err && console.error(chalk.red(err.stack))
      );
    }
  });
});
