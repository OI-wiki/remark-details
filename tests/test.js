'use strict';
import test from 'ava';

import unified from 'unified';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import fs from 'fs';
import de from '../index.js';

const www = fs.readFileSync('tests/c.md');

// const doc = "中文abc中文$a_i$中文";
// .use(math)
// .use(sp)

test('main', (t) => {
  unified()
    .use(parse)
    .use(stringify)
    .use(de)
    .process(www, function (err, res) {
      console.log('finished');
      // console.log(String(res));
      fs.writeFileSync('tmp', String(res));
    });
  t.pass();
});
