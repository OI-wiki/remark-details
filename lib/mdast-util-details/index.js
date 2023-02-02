import { containerPhrasing } from 'mdast-util-to-markdown/lib/util/container-phrasing.js';
import { containerFlow } from 'mdast-util-to-markdown/lib/util/container-flow.js';
import { indentLines } from 'mdast-util-to-markdown/lib/util/indent-lines.js';
function enter(type, token, name) {
    this.enter({ type: type, name: name !== null && name !== void 0 ? name : '', attributes: {}, children: [] }, token);
}
function getDetailsAttributes(ctx) {
    return ctx.getData('detailsAttributes');
}
export const fromMarkdownDetails = {
    enter: {
        detailsContainer: function (token) {
            this.setData('detailsAttributes', []);
            enter.call(this, 'detailsContainer', token, 'details');
        },
        detailsContainerSummary: function (token) {
            // pushin all the attributes for <details> tag before entering
            // <summary> tag
            const attributes = getDetailsAttributes(this);
            const cleaned = {
                open: false,
            };
            const classes = [];
            for (const attribute of attributes) {
                if (attribute[0] === 'class')
                    classes.push(attribute[1]);
                else
                    cleaned.open = attribute[1];
            }
            if (classes.length > 0)
                cleaned.class = classes.join(' ');
            this.setData('detailsAttributes');
            this.stack[this.stack.length - 1].attributes = cleaned;
            enter.call(this, 'detailsContainerSummary', token, 'summary');
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
            getDetailsAttributes(this).push(['open', true]);
        },
        detailsContainerClassName: function (token) {
            getDetailsAttributes(this).push(['class', this.sliceSerialize(token)]);
        },
    },
};
function map(line, _, blank) {
    return '    ' + line;
}
function details_summary_handle(node, parent, context) {
    let value = containerPhrasing(node, context, { before: '\n', after: ' ' });
    value += '\n';
    return value;
}
function details_handle(node, parent, context) {
    var _a, _b;
    const exit = context.enter('details');
    let header = '???';
    // console.log(node)
    if (((_a = node.attributes) === null || _a === void 0 ? void 0 : _a.open) === true) {
        header += '+ ';
    }
    else {
        header += ' ';
    }
    if ((_b = node.attributes) === null || _b === void 0 ? void 0 : _b.class) {
        header += node.attributes.class + ' ';
    }
    let original_children = [...node.children];
    node.children = original_children.slice(0, 1);
    header += containerFlow(node, context);
    node.children = original_children.slice(1, original_children.length);
    let value = containerFlow(node, context);
    value = indentLines(value, map);
    exit();
    return header + value;
}
const handlers = {
    'detailsContainer': details_handle,
    'detailsContainerSummary': details_summary_handle,
};
export const detailsToMarkdown = {
    handlers: handlers
};
