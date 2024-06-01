import { Element, Node, Root } from 'hast';
import { unified, Plugin, Transformer } from 'unified';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';
import testCase, { fromPath } from './test-case.js';
import remarkDetails from '../lib/index.js';

const htmlDetails: Plugin<[], Root, Root> = function (): Transformer<Root> {
  return (tree: Root) => {
    visit(tree, ['detailsContainer', 'detailsContainerSummary'], (node: Node | any) => {
      var data = node.data || (node.data = {});
      var hast = h(node.name, node.attributes) as unknown as Element;
      data.hName = hast.tagName;
      data.hProperties = hast.properties;
    });
  }
}
const processor = input => {
  return unified()
    .use(remarkParse)
    // the main plugin written, based on micromark
    .use(remarkDetails)
    // the function above, transform details related tags to html-compilable
    .use(htmlDetails)
    .use(remark2rehype)
    .use(rehypeStringify)
    .processSync(input).value as string;
}

const res = processor(
  `
???+ note 总结
    how to do this

    how to do that

    !!! example
        what happened if we nested details

        and this
    and continue

234`
)

console.log(res)
