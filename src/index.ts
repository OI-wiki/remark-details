import { Plugin } from "unified";
import { syntax } from './micromark-details/index.js';
import { detailsFromMarkdown } from './mdast-util-details/index.js';

let warningIssued;
const remarkDetails: Plugin = function () {
	const data = this.data() as Record<string, unknown[] | undefined>;
	// warning for old remarks
	if (!warningIssued && (this.Parser?.prototype?.blockTokenizers || this.Compiler?.prototype?.visitors)) {
		warningIssued = true;
		console.warn('[remark-details] Warning: please upgrade to remark 13 to use this plugin',);
	}

	function add(field: string, value: unknown) {
		/* istanbul ignore if - other extensions. */
		if (data[field])
			data[field]!.push(value);
		else
			data[field] = [value];
	}

	add('micromarkExtensions', syntax);
	add('fromMarkdownExtensions', detailsFromMarkdown);
}
export default remarkDetails;
