import { h } from 'hastscript';
import { visit } from 'unist-util-visit';
import { detailsFromMarkdown, detailsToMarkdown } from './mdast-util-details/index.js';
import { details } from './micromark-details/index.js';
// Supported types: <https://squidfunk.github.io/mkdocs-material/reference/admonitions/#supported-types>.
const detailsClassNameSet = new Set([
    'note', 'abstract', 'info', 'tip', 'success', 'question',
    'warning', 'failure', 'danger', 'bug', 'example', 'quote'
]);
const defaultClassName = 'note';
const capitalize = (s) => s[0].toUpperCase() + s.slice(1);
let warningIssued = false;
const remarkDetails = function (options = { normalize: false }) {
    var _a, _b, _c, _d;
    const data = this.data();
    // warning for old remarks
    if (!warningIssued &&
        (((_b = (_a = this.Parser) === null || _a === void 0 ? void 0 : _a.prototype) === null || _b === void 0 ? void 0 : _b.blockTokenizers) ||
            ((_d = (_c = this.Compiler) === null || _c === void 0 ? void 0 : _c.prototype) === null || _d === void 0 ? void 0 : _d.visitors))) {
        warningIssued = true;
        console.warn('[remark-details] Warning: please upgrade to remark 13 to use this plugin');
    }
    function add(field, value) {
        /* istanbul ignore if - other extensions. */
        if (data[field])
            data[field].push(value);
        else
            data[field] = [value];
    }
    add('micromarkExtensions', details);
    add('fromMarkdownExtensions', detailsFromMarkdown);
    add('toMarkdownExtensions', detailsToMarkdown);
    return transform;
    function transform(tree) {
        visit(tree, ['detailsContainer', 'detailsContainerSummary'], ondetails);
    }
    function ondetails(node) {
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
                        { type: 'text', value: capitalize(classes.length ? classes.slice(classes.lastIndexOf(' ') + 1) : defaultClassName) },
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
