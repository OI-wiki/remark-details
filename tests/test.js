import test from 'ava';
import { h } from 'hastscript';
import stringify from 'rehype-stringify';
import remark from 'remark';
import parse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified from 'unified';
import { visit } from 'unist-util-visit';

import details from '../index.js';

let num = 0;
const pluginned = remark()
  .use(parse)
  .use(details) // the main plugin written, based on micromark
  // the function above, transform details related tags to html-compilable
  .use(htmlDirectives)
  .use(remark2rehype)
  .use(stringify);

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
        pluginned.process(String(fs.readFileSync(value)), (err, res) => {
          t.is(String(res), String(outfile), message);
        });
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
        pluginned.process(value, (err, res) => {
          // console.log('RESULT: ', String(res));
          t.is(String(res), String(expected), message);
        });
      });
    };
  }
}

function htmlDirectives() {
  return transform;

  function transform(tree) {
    visit(tree, ['detailsContainer', 'detailsContainerSummary'], ondetails);
  }

  function ondetails(node) {
    var data = node.data || (node.data = {});
    var hast = h(node.name, node.attributes);

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
  }
}
// pluginned.process('???+ note 总结\n', (err, res) => {
// console.log(String(res));
//});

T({
  value: 'hello world',
  expected: '<p>hello world</p>',
  message: 'basic test',
})();
T({
  value: '???+总结如下\n',
  expected: '<details open><summary>总结如下</summary></details>',
  message: 'no content details',
})();
T({
  value: '???+ note 总结\n',
  expected: '<details open class="note"><summary>总结</summary></details>',
  message: 'no content details with note',
})();
