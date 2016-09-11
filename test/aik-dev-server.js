import test from 'ava';
import identity from 'lodash/identity';

import { aikDevServer } from '../src/lib/';

const cons = {
  log: identity,
  error: identity
};

const WAIT_DURATION = 5000;

test.cb('aikDevServer -> all flags', t => {
  aikDevServer(['mocks/index.js'], { host: 'localhost', port: 1234, ngrok: true, cssmodules: true, react: true }, cons)
    .then(() => {
      setTimeout(() => {
        t.pass();
        t.end();
      }, WAIT_DURATION);
    });
});

test.cb('aikDevServer -> only ngrok', t => {
  aikDevServer(['mocks/index.js'], { host: 'localhost', port: 1235, ngrok: true }, cons)
    .then(() => {
      setTimeout(() => {
        t.pass();
        t.end();
      }, WAIT_DURATION);
    });
});

test.cb('aikDevServer -> only cssmodules', t => {
  aikDevServer(['mocks/index.js'], { host: 'localhost', port: 1236, cssmodules: true }, cons)
    .then(() => {
      setTimeout(() => {
        t.pass();
        t.end();
      }, WAIT_DURATION);
    });
});

test.cb('aikDevServer -> only rect hot loader', t => {
  aikDevServer(['mocks/index.js'], { host: 'localhost', port: 1237, react: true }, cons)
    .then(() => {
      setTimeout(() => {
        t.pass();
        t.end();
      }, WAIT_DURATION);
    });
});

test.cb('aikDevServer -> syntax error', t => {
  aikDevServer(['mocks/index_syntax_error.js'], { host: 'localhost', port: 1238 }, cons)
    .then(() => {
      setTimeout(() => {
        t.pass();
        t.end();
      }, WAIT_DURATION);
    });
});

test.cb('aikDevServer -> eslint error', t => {
  aikDevServer(['mocks/index_eslint_error.js'], { host: 'localhost', port: 1239 }, cons)
    .then(() => {
      setTimeout(() => {
        t.pass();
        t.end();
      }, WAIT_DURATION);
    });
});
