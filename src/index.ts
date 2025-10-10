import { Node, Root } from 'hast';
import { h } from 'hastscript';
import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

import { detailsFromMarkdown, detailsToMarkdown } from './mdast-util-details/index.js';
import { details } from './micromark-details/index.js';

interface DetailsNode extends Node {
  name: string;
  attributes: { open: boolean; class: string };
  children: Node[];
}

// Supported types: <https://squidfunk.github.io/mkdocs-material/reference/admonitions/#supported-types>.
const detailsClassNameSet = new Set([
  'note', 'abstract', 'info', 'tip', 'success', 'question', 
  'warning', 'failure','danger', 'bug', 'example', 'quote'
]);
const defaultClassName = 'note';

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

let warningIssued = false;
const remarkDetails: Plugin = function (options = {normalize: false}) {
  const data = this.data() as Record<string, unknown[] | undefined>;
  // warning for old remarks
  if (
    !warningIssued &&
    (this.Parser?.prototype?.blockTokenizers ||
      this.Compiler?.prototype?.visitors)
  ) {
    warningIssued = true;
    console.warn(
      '[remark-details] Warning: please upgrade to remark 13 to use this plugin',
    );
  }

  function add(field: string, value: unknown) {
    /* istanbul ignore if - other extensions. */
    if (data[field]) data[field]!.push(value);
    else data[field] = [value];
  }

  add('micromarkExtensions', details);
  add('fromMarkdownExtensions', detailsFromMarkdown);
  add('toMarkdownExtensions', detailsToMarkdown);

  return transform;

  function transform(tree) {
    visit(tree, ['detailsContainer', 'detailsContainerSummary'], ondetails);
  }

  function ondetails(node: DetailsNode) {
    var data = node.data || (node.data = {});

    // Normalize the details container classes and summary. Only for OI Wiki.
    if (options.normalize && node.type === 'detailsContainer') {
      // Only supported types are allowed to be a class name.
      const classes = node.attributes.class;
      node.attributes.class = defaultClassName;
      if (classes) {
        for (const clazz of classes.toLowerCase().split(' ')) {
          if (detailsClassNameSet.has(clazz)) {
            node.attributes.class = clazz;
            break;
          }
        }
      }
      // Add the summary as the capitalized last class name if not existing yet.
      if (node.children.length === 0 || node.children[0].type !== 'detailsContainerSummary') {
        node.children.unshift({
          type: 'detailsContainerSummary',
          // @ts-expect-error
          name: 'summary',
          generated: true,
          children: [
            { type: 'text', value: capitalize(
              classes.length ? classes.slice(classes.lastIndexOf(' ') + 1) : defaultClassName
            ) },
          ],
        });
      }
    }

    var hast = h(node.name, node.attributes);
    data.hName = hast.tagName;
    data.hProperties = hast.properties;
  }
};
export default remarkDetails;
