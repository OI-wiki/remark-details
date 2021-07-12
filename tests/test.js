import stringify from 'rehype-stringify';
import parse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified from 'unified';

import details from '../index.js';

unified()
  .use(parse)
  .use(details)
  //.use(htmlDirective)
  .use(remark2rehype)
  .use(stringify)
  .process('???+hello world\nfindou', (err, res) => {
    console.log(String(res));
  });

function htmlDirectives() {
  return transform;

  function transform(tree) {
    visit(
      tree,
      ['textDirective', 'leafDirective', 'containerDirective'],
      ondirective,
    );
  }

  function ondirective(node) {
    var data = node.data || (node.data = {});
    var hast = h(node.name, node.attributes);

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
  }
}
