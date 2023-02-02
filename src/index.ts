import { Node, Root } from 'hast';
import { h } from 'hastscript';
import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

import { fromMarkdownDetails, detailsToMarkdown } from './mdast-util-details/index.js';
import { syntax } from './micromark-details/index.js';

interface DetailsNode extends Node {
	name: string;
	attributes: { open: boolean; class?: string };
}

let warningIssued = false;
const remarkDetails: Plugin = function (options) {
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

	add('micromarkExtensions', syntax);
	add('fromMarkdownExtensions', fromMarkdownDetails);
	add('toMarkdownExtensions', detailsToMarkdown)

	return transform;

	function transform(tree) {
		visit(tree, ['detailsContainer', 'detailsContainerSummary'], ondetails);
	}

	function ondetails(node: DetailsNode) {
		var data = node.data || (node.data = {});
		var hast = h(node.name, node.attributes);
		data.hName = hast.tagName;
		data.hProperties = hast.properties;
	}
};
export default remarkDetails;
