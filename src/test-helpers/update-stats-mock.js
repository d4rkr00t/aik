/* @flow */

import path from "path";
import fs from "fs";
import { execSync } from "child_process";

export const updateStatsMock = function updateStatsMock(name: string) {
  const fixturesDir = path.join(process.cwd(), "__fixtures__", "webpack-stats", name);
  const pathToFixture = path.join(fixturesDir, "index.js");
  const pathToConfig = path.join(fixturesDir, "webpack.config.js");
  const stats = path.join(fixturesDir, "stats.json");
  try {
    execSync(
      `./node_modules/.bin/webpack ${pathToFixture} --output-path='${fixturesDir}' --mode development --config ${pathToConfig} --json > ${stats}`,
      {
        stdio: "ignore"
      }
    );
  } catch (e) {} // eslint-disable-line
  return JSON.parse(fs.readFileSync(stats, "utf8"));
};
