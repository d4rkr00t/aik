import test from 'ava';
import 'babel-core/register';

import aik from '../lib/';

test('aik', () => {
  return aik('cli.js', { host: 'localhost', port: 1234, ngrok: true, cssmodules: true });
});
