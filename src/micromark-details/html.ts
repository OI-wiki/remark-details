import { Extension } from 'mdast-util-from-markdown/lib';
export const detailsHtml: Extension = {
	enter: {
		detailsContainer() {
			(this as any).tag('<details');
		},
		detailsContainerClasses() {
			(this as any).tag(` class="`);
		},
		detailsContainerClassName(token) {
			(this as any).tag(this.sliceSerialize(token));
		},
		detailsContainerClassWhitespace() {
			(this as any).tag(' ');
		},
		detailsContainerSummary() {
			(this as any).tag('<summary>');
			this.buffer();
		},
	},
	exit: {
		detailsContainer() {
			(this as any).tag('</details>');
		},
		detailsContainerClasses() {
			(this as any).tag(`"`);
		},
		detailsContainerSummary() {
			const data = this.resume();
			(this as any).raw(data);
			(this as any).tag('</summary>');
		},
		detailsExpanded() {
			(this as any).tag(' open');
		},
		detailsContainerHeader() {
			(this as any).tag('>');
		},
	},
};
