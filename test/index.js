import test from 'ava';
import identity from 'lodash/identity';

import { aikDevServer } from '../lib/';

const cons = {
  log: identity,
  error: identity
};

test('aik dev server', () => {
  return aikDevServer(
    ['mocks/index.js'], { host: 'localhost', port: 1234, ngrok: true, cssmodules: true, react: true }, cons
  );
});
