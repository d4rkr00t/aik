import test from 'ava';
import identity from 'lodash/identity';

import aik from '../lib/';

const cons = {
  log: identity,
  error: identity
};

test('aik', () => {
  return aik('cli.js', { host: 'localhost', port: 1234, ngrok: true, cssmodules: true, react: true }, cons);
});
