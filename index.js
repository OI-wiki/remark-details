'use strict';

import { details as syntax } from './micromark-extension-details/index.js';
// import fromMarkdown from 'mdast-util-footnote/from-markdown';
// import toMarkdown from 'mdast-util-footnote/to-markdown';

let warningIssued;

export default function details(options) {
  const data = this.data();
  // warning for old remarks
  if (
    !warningIssued &&
    ((this.Parser &&
      this.Parser.prototype &&
      this.Parser.prototype.blockTokenizers) ||
      (this.Compiler &&
        this.Compiler.prototype &&
        this.Compiler.prototype.visitors))
  ) {
    warningIssued = true;
    console.warn(
      '[remark-details] Warning: please upgrade to remark 13 to use this plugin',
    );
  }

  add('micromarkExtensions', syntax(options));
  // add('fromMarkdownExtensions', fromMarkdown);
  // add('toMarkdownExtensions', toMarkdown);

  function add(field, value) {
    /* istanbul ignore if - other extensions. */
    if (data[field]) data[field].push(value);
    else data[field] = [value];
  }
}
