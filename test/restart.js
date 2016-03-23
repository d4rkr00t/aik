import test from 'ava';
import identity from 'lodash/identity';

import restart from '../src/lib/restart';

const chalk = {
  yellow: identity,
  green: identity
};

const prc = {
  stdin: {
    setEncoding: identity
  },
  stdout: {
    write: identity
  }
};

test.cb('restart -> should call server.invalidate if rs in stdin', (t) => {
  prc.stdin.read = () => 'rs';
  prc.stdin.on = (event, cb) => cb();

  restart({
    prc,
    chalk,
    server: {
      invalidate() {
        t.end();
      }
    }
  });
});

test.cb('restart -> should not call server.invalidate if something else in stdin', (t) => {
  let invalidate = false;

  prc.stdin.read = () => '';
  prc.stdin.on = (event, cb) => {
    cb();
    t.false(invalidate);
    t.end();
  };

  restart({
    prc,
    chalk,
    server: {
      invalidate() {
        invalidate = true;
      }
    }
  });
});
