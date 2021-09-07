import { Extension } from 'mdast-util-from-markdown/lib';
export const detailsHtml: Extension = {
	enter: {
		detailsContainer() {
			(this as any).tag('<details');
		},
		detailsContainerClassName() {
			(this as any).tag(` class="`);
		},
		detailsContainerSummary() {
			(this as any).tag('>');
			(this as any).tag('<summary>');
			this.buffer();
		},
		detailsContainerContent() {
			// this.tag('<p>');
		},
	},
	exit: {
		detailsContainer() {
			(this as any).tag('</details>');
		},
		detailsContainerClassName(token) {
			(this as any).tag(this.sliceSerialize(token));
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
		detailsContainerFence() {},
		detailsContainerContent() {
			// this.tag('</p>');
		},
	},
};
