import test from 'ava';
import chalk from 'chalk';
import { micromark } from 'micromark';

import {
  details as syntax,
  detailsHtml as html,
} from '../micromark-extension-details/index.js';

function T(num, value) {
  test(`test case #${num}`, async (t) => {
    const res = micromark(value, {
      extensions: [syntax()],
      htmlExtensions: [html()],
    });
    console.log(chalk.blue(`==Test case#${num}==`));
    console.log(value);
    console.log('=======>');
    console.log(res);
    console.log();
    t.pass();
  });
}

T(1, `???+总结如下\nfind`);
T(
  2,
  `???+总结如下
    how to do the thing`,
);
T(
  3,
  `???+总结如下
how to do the thing`,
);
T(
  4,
  `???+总结如下
    how to do this
    how to do that
and that`,
);
