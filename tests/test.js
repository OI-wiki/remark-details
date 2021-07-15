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
  // the main plugin written, based on micromark
  .use(details)
  // the function above, transform details related tags to html-compilable
  .use(htmlDetails)
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

function htmlDetails() {
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
T({
  value: `???+ 总结
    how to do this`,
  expected:
    '<details open><summary>总结</summary><p>how to do this</p></details>',
  message: 'details without note',
})();
T({
  value: `???+ note 总结
    how to do this`,
  expected:
    '<details open class="note"><summary>总结</summary><p>how to do this</p></details>',
  message: 'details with note',
})();
T({
  value: `???+ note 总结
    how to do this
    how to do that`,
  expected: `<details open class="note"><summary>总结</summary><p>how to do this
how to do that</p></details>`,
  message: 'details with note',
})();
T({
  value: `???+ note 总结
    to be or not to be
    that is the question

but now it is not`,
  expected: `<details open class="note"><summary>总结</summary><p>to be or not to be
that is the question</p></details>
<p>but now it is not</p>`,
  message: 'details with note',
})();
T({
  value: `???+ note 总结
    to be or not to be
    that is the question

but now it is not`,
  expected: `<details open class="note"><summary>总结</summary><p>to be or not to be
that is the question</p></details>
<p>but now it is not</p>`,
  message: 'details with note',
})();
T({
  value: `???+ warning 总结
    The sunlight claps the earth,
    and the moonbeams kiss the sea:
    what are all these kissings worth,
    \`\`\`cpp
    for (int i = 0; i <= 100; i++) {
        cout << "if thou kiss not me?" << endl;
    }
    \`\`\`

if not me, who`,
  expected: `<details open class="warning"><summary>总结</summary><p>The sunlight claps the earth,
and the moonbeams kiss the sea:
what are all these kissings worth,</p><pre><code class="language-cpp">for (int i = 0; i &#x3C;= 100; i++) {
    cout &#x3C;&#x3C; "if thou kiss not me?" &#x3C;&#x3C; endl;
}
</code></pre></details>
<p>if not me, who</p>`,
  message: 'details with note and code',
})();
T({
  value: `???+ note 总结
    > I have drunken deep of joy,
    And I will taste no other wine tonight

thats it`,
  expected: `<details open class="note"><summary>总结</summary><blockquote>
<p>I have drunken deep of joy,
And I will taste no other wine tonight</p>
</blockquote></details>
<p>thats it</p>`,
  message: 'details with note and blockquote',
});
