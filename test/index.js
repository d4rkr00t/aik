import test from 'ava';
import 'babel-core/register';

import aik from '../src/lib/';

test('aik', (t) => {
  t.ok(aik());
});
