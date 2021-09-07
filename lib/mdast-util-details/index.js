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
export const detailsToMarkdown = {
// TODO well if you want :sweat_smile:
};
