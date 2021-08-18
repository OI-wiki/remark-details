import { Token, Extension, CompileContext } from "mdast-util-from-markdown/lib";

function enter(this: CompileContext, type: string, token: Token, name: string) {
	this.enter(
		{
			type: type as any,
			name: name ?? '',
			attributes: {},
			children: []
		},
		token,
	);
}

function getDetailsAttributes(ctx: CompileContext) {
	return ctx.getData('detailsAttributes') as (['open', boolean] | ['class', string])[];
}

export const fromMarkdownDetails: Extension = {
	enter: {
		detailsContainer: function (token) {
			this.setData('detailsAttributes', []);
			enter.call(this, 'detailsContainer', token, 'details');
		},
		detailsContainerSummary: function (token) {
			// pushin all the attributes for <details> tag before entering <summary> tag
			const attributes = getDetailsAttributes(this);
			const cleaned = {
				open: false,
				class: ""
			}
			const classes: string[] = [];
			for (const attribute of attributes) {
				if (attribute[0] === 'class')
					classes.push(attribute[1]);
				else
					cleaned.open = attribute[1];
			}
			cleaned.class = classes.join(' ');
			this.setData('detailsAttributes');
			(this.stack[this.stack.length - 1] as any).attributes = cleaned;
			enter.call(this, 'detailsContainerSummary', token, 'summary');
		},
	},
	exit: {
		detailsContainer: function (token) { this.exit(token); },
		detailsContainerSummary: function (token) { this.exit(token); },
		detailsExpanded: function (token) {
			getDetailsAttributes(this).push(['open', true]);
		},
		detailsContainerClassName: function (token) {
			getDetailsAttributes(this).push(['class', this.sliceSerialize(token)]);
		},
	},
};

export const detailsToMarkdown = {
	// TODO well if you want :sweat_smile:
};