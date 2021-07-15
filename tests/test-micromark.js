import test from 'ava';
import chalk from 'chalk';
import fs from 'fs';
import { micromark } from 'micromark';

import {
  details as syntax,
  detailsHtml as html,
} from '../micromark-extension-details/index.js';

// function T(num, value, file) {
// test(`test case #${num}`, async (t) => {
// if (file) {
// value = String(fs.readFileSync(`tests/${file}.in.md`));
//}
// const res = micromark(value, {
// extensions: [syntax()],
// htmlExtensions: [html()],
//});
// console.log(chalk.blue(`==Test case#${num}==`));
// console.log(value);
// console.log('=======>');
// console.log(res);
// console.log();
// t.pass();
//});
//}

// interface config {
// value: string,
// expected: string,
// isFile?: boolean,
// message?: string,
//}
let num = 0;
function T(config) {
  if (config.isFile) {
    return function (
      value = config.value,
      expected = config.expected,
      message = config.message,
    ) {
      num++;
      test(`test case ${num}`, (t) => {
        const outfile = String(fs.readFileSync(expected));
        const res = micromark(String(fs.readFileSync(value)), {
          extensions: [syntax()],
          htmlExtensions: [html()],
        });
        t.is(String(res), String(outfile), message);
      });
    };
  } else {
    return function (
      value = config.value,
      expected = config.expected,
      message = config.message,
    ) {
      num++;
      test(`test case ${num}`, (t) => {
        const res = micromark(value, {
          extensions: [syntax()],
          htmlExtensions: [html()],
        });
        console.log(res);
        t.is(String(res), String(expected), message);
      });
    };
  }
}

T({
  value: 'hello world',
  expected: '<p>hello world</p>',
  message: 'basic test',
})();
T({
  value: '???+总结如下\n',
  expected: '<details open><summary>总结如下</summary>\n</details>',
  message: 'no content details',
})();
T({
  value: '???+ note 总结\n',
  expected: '<details open class="note"><summary>总结</summary>\n</details>',
  message: 'no content details with note',
})();
T({
  value: '???+ warning 总结\n',
  expected: '<details open class="warning"><summary>总结</summary>\n</details>',
  message: 'no content details with warning',
})();
// T(
// 2,
//`???+总结如下
// how to do the thing`,
//);
// T(
// 3,
//`???+总结如下
// how to do the thing`,
//);
// T(
// 4,
//`???+总结如下
// how to do this
// how to do that
// and that`,
//);
// T(5, null, 1);
// T(6, null, 2);
// T(7, null, 3);
// T(8, null, 4);
// T(9, null, 5);
// T(10, null, 6);
// T(
// 11,
//`!!!+总结如下
// or nothing`,
//);
// T(
// 12,
//`???+ note  总结如下
// how to do the thing`,
//);
// T(
// 13,
//`???  warning  总结如下
// how to do the thing

// thats all
// thankyou`,
//);
// T(14, null, 7);
