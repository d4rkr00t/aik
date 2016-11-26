/* @flow */

import querystring from 'querystring';
import Insight from 'insight';
import pkg from '../package.json';

const trackingCode = 'UA-88006586-1';
const trackingProvider = 'google';
const insight = new Insight({ trackingCode, trackingProvider, pkg });

export function askPermission(cb: Function) {
  if (insight.optOut === undefined) { // eslint-disable-line
    return insight.askPermission(null, cb);
  }
  cb();
}

export function track(path: string[], input: string[], flags: CLIFlags) {
  if (insight.optOut) return;

  const filteredFlags = Object.keys(flags).reduce((acc, flag) => {
    if (flag.length > 1) {
      acc[flag] = flags[flag];
    }

    return acc;
  }, {});

  if (!input[0]) {
    return flags.version
      ? setImmediate(() => insight.track('aik', 'version'))
      : setImmediate(() => insight.track('aik', 'help'));
  }

  setImmediate(() => insight.track('aik', ...path, '?' + querystring.stringify(filteredFlags)));
}
