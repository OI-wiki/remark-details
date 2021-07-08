'use strict'

const fromMarkdown = require('mdast-util-footnote/from-markdown')
const toMarkdown = require('mdast-util-footnote/to-markdown')
const warningIssued

module.exports = details

function details(options) {
    const data = this.data();
    // warning for old remarks
    if (!warningIssued &&
        ((this.Parser && this.Parser.prototype &&
          this.Parser.prototype.blockTokenizers) ||
         (this.Compiler && this.Compiler.prototype &&
          this.Compiler.prototype.visitors))) {
        warningIssued = true
        console.warn(
            '[remark-footnotes] Warning: please upgrade to remark 13 to use this plugin')
    }

    // add('micromarkExtensions', syntax(options))
    add('fromMarkdownExtensions', fromMarkdown)
    add('toMarkdownExtensions', toMarkdown)

    function add(field, value) {
        /* istanbul ignore if - other extensions. */
        if (data[field])
            data[field].push(value)
            else data[field] = [value]
    }
}
