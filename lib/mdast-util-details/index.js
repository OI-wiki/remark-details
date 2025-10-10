import { containerPhrasing } from 'mdast-util-to-markdown/lib/util/container-phrasing.js';
import { containerFlow } from 'mdast-util-to-markdown/lib/util/container-flow.js';
import { indentLines } from 'mdast-util-to-markdown/lib/util/indent-lines.js';
export const detailsFromMarkdown = {
    enter: {
        detailsContainer: function (token) {
            this.setData('detailsAttributes', { open: false });
            this.enter({
                // @ts-expect-error
                type: 'detailsContainer',
                name: 'details',
                attributes: {},
                children: [],
            }, token);
        },
        detailsContainerSummary: function (token) {
            this.enter({
                // @ts-expect-error
                type: 'detailsContainerSummary',
                name: 'summary',
                children: [],
            }, token);
        },
        detailsContainerClasses: function (token) {
            this.getData('detailsAttributes').class = '';
        },
    },
    exit: {
        detailsContainer: function (token) {
            this.exit(token);
        },
        detailsContainerSummary: function (token) {
            this.exit(token);
        },
        detailsExpanded: function (token) {
            this.getData('detailsAttributes').open = true;
        },
        detailsContainerClassName: function (token) {
            this.getData('detailsAttributes').class += this.sliceSerialize(token);
        },
        detailsContainerClassWhitespace: function (token) {
            this.getData('detailsAttributes').class += ' ';
        },
        detailsContainerHeader: function (token) {
            this.stack[this.stack.length - 1].attributes = this.getData('detailsAttributes');
            this.setData('detailsAttributes');
        },
    },
};
function details_summary_handle(node, parent, context, info) {
    // @ts-expect-error
    let value = containerPhrasing(node, context, { before: '\n', after: '\n' });
    return ' "' + value + '"';
}
function details_handle(node, parent, context, info) {
    const exit = context.enter('details');
    let header = '???';
    if (node.attributes.open)
        header += '+';
    if (node.attributes.class)
        header += ' ' + node.attributes.class;
    let original_children = [...node.children];
    if (original_children.length > 0 && original_children[0].name === 'summary') {
        node.children = original_children.slice(0, 1);
        // @ts-expect-error
        header += containerFlow(node, context);
        node.children = original_children.slice(1);
    }
    // @ts-expect-error
    let value = containerFlow(node, context);
    value = indentLines(value, (line, number, blank) => ('    ' + line));
    exit();
    return header + '\n' + value;
}
const handlers = {
    'detailsContainer': details_handle,
    'detailsContainerSummary': details_summary_handle,
};
export const detailsToMarkdown = {
    handlers: handlers
};
