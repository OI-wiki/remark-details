'use strict';
const test = require('ava');

const remark = require('remark');
const parse = require('remark-parse');
const de = require('../index.js');

const fs = require('fs');
const www = fs.readFileSync('tests/a.md');

// const doc = "中文abc中文$a_i$中文";
// .use(math)
// .use(sp)

test('main', (t) => {
  remark()
    .use(parse)
    .use(de)
    .process(www, function (err, res) {
      console.log('finished');
      // console.log(String(res));
      fs.writeFileSync('tmp', String(res));
    });
  t.pass();
});
