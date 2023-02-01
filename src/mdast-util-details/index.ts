import {CompileContext, Extension, Token} from 'mdast-util-from-markdown/lib';
import { Options as toMarkdownExtensions, Context, Handle } from 'mdast-util-to-markdown'
import { containerPhrasing } from 'mdast-util-to-markdown/lib/util/container-phrasing.js'
import { containerFlow } from 'mdast-util-to-markdown/lib/util/container-flow.js'
import { indentLines } from 'mdast-util-to-markdown/lib/util/indent-lines.js'
import { Node } from 'mdast-util-to-markdown/lib';
function enter(this: CompileContext, type: string, token: Token, name: string) {
    this.enter(
        {type: type as any, name: name ?? '', attributes: {}, children: []},
        token,
    );
}

function getDetailsAttributes(ctx: CompileContext) {
    return ctx.getData('detailsAttributes') as (
               ['open', boolean] | ['class', string])[];
}

export const fromMarkdownDetails: Extension = {
    enter: {
        detailsContainer: function(token) {
            this.setData('detailsAttributes', []);
            enter.call(this, 'detailsContainer', token, 'details');
        },
        detailsContainerSummary: function(token) {
            // pushin all the attributes for <details> tag before entering
            // <summary> tag
            const attributes = getDetailsAttributes(this);
            const cleaned: {open: boolean, class?: string} = {
                open: false,
            } 
            const classes: string[] = [];
            for (const attribute of attributes) {
                if (attribute[0] === 'class')
                    classes.push(attribute[1]);
                else
                    cleaned.open = attribute[1];
            }
            if (classes.length > 0) cleaned.class = classes.join(' ');
            this.setData('detailsAttributes');
            (this.stack[this.stack.length - 1] as any).attributes = cleaned;
            enter.call(this, 'detailsContainerSummary', token, 'summary');
        },
    },
    exit: {
        detailsContainer: function(token) {
            this.exit(token);
        },
        detailsContainerSummary: function(token) {
            this.exit(token);
        },
        detailsExpanded: function(token) {
            getDetailsAttributes(this).push(['open', true]);
        },
        detailsContainerClassName: function(token) {
            getDetailsAttributes(this).push(
                ['class', this.sliceSerialize(token)]);
        },
    },
};

function map(line, _, blank) {
    return '    ' + line
}

function details_summary_handle(node: any, parent: Node, context: Context) {
    let value = containerPhrasing(node, context, { before: '\n', after: ' ' })
    value += '\n'
    return value
}

function details_handle(node: any, parent: Node, context: Context) {
    const exit = context.enter('details' as any)
    let header = '???';
    // console.log(node)
    if (node.attributes?.open === true) {
        header += '+ '
    } else {
        header += ' '
    }
    if (node.attributes?.class) {
        header += node.attributes.class + ' '
    }
    let original_children = [...node.children]
    node.children = original_children.slice(0, 1)
    header += containerFlow(node, context)
    node.children = original_children.slice(1, original_children.length)
    let value = containerFlow(node, context)
    value = indentLines(value, map)
    exit()
    return header + value;
}

const handlers: Record<Node['type'], Handle> = {
    'detailsContainer': details_handle,
    'detailsContainerSummary': details_summary_handle,
} as any;

export const detailsToMarkdown: toMarkdownExtensions = {
    handlers: handlers
};
