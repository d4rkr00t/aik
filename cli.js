#!/usr/bin/env node

/* @flow */

// Need that because of regenerator runtime
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
    ].join("\n")
  },
  {
    alias: {
      b: "build",
      u: "base",
      p: "port",
      h: "host",
      n: "ngrok",
      o: "open",
      v: "version"
    }
  }
);

const input = cli.input || [];
const flags = cli.flags || {};

const errorHandler = err => {
  if (err.formattedMessage) {
    aik.print(err.formattedMessage, /* clear */ true);
  } else {
    // eslint-disable-next-line
    console.log(chalk.red(err.stack || err));
  }
};

aik.deprecation.flagDeprecationWarnings(flags, () => {
  insight.askPermission(() => {
    if (!input.length) {
      insight.track([], input, flags);
      console.log(cli.help); // eslint-disable-line
    } else if (flags.build) {
      insight.track(["build"], input, flags);
      aik.build(input, flags).catch(errorHandler);
    } else {
      insight.track(["dev-server"], input, flags);
      aik.devServer(input, flags).catch(errorHandler);
    }
  });
});
