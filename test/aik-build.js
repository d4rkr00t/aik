import test from 'ava';
import identity from 'lodash/identity';

import { aikBuild } from '../src/lib/';

const cons = {
  log: identity,
  error: identity
};

const WAIT_DURATION = 5000;

test('aikBuild', t => {
  aikBuild(['mocks/index.js'], { build: '../_docs/', cssmodules: true }, cons)
    .then(() => {
      setTimeout(() => {
        t.pass();
        t.end();
      }, WAIT_DURATION);
    });
});
