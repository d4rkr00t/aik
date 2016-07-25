import test from 'ava';
import identity from 'lodash/identity';

import banner from '../src/lib/banner';

const chalk = {
  yellow: identity,
  magenta: identity,
  cyan: identity,
  green: identity,
  dim: identity
};

test('banner -> css modules', (t) => {
  t.regex(banner({ cssmodules: true }, '', chalk), /CSS Modules:\s+enabled/);
  t.regex(banner({ cssmodules: false }, '', chalk), /CSS Modules:\s+disabled/);
});

test('banner -> ngrok', (t) => {
  t.regex(banner({ ngrok: true }, 'url', chalk), /Ngrok:\s+url/);
  t.regex(banner({ ngrok: false }, '', chalk), /Ngrok:\s+disabled/);
});

test('banner -> css modules', (t) => {
  t.regex(banner({ react: true }, '', chalk), /React Hot Loader:\s+enabled/);
  t.regex(banner({ react: false }, '', chalk), /React Hot Loader:\s+disabled/);
});
