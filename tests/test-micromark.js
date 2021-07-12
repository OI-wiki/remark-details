import test from 'ava';
import { micromark } from 'micromark';

import {
  details as syntax,
  detailsHtml as html,
} from '../micromark-extension-details/index.js';

test('first', (t) => {
  const value = `???+arnsono asrineta\ns`;
  const a = micromark(value, {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });
  console.log(a);
  t.pass();
});
