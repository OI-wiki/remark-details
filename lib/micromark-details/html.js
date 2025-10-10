export const detailsHtml = {
    enter: {
        detailsContainer() {
            this.tag('<details');
        },
        detailsContainerClasses() {
            this.tag(` class="`);
        },
        detailsContainerClassName(token) {
            this.tag(this.sliceSerialize(token));
        },
        detailsContainerClassWhitespace() {
            this.tag(' ');
        },
        detailsContainerSummary() {
            this.tag('<summary>');
            this.buffer();
        },
    },
    exit: {
        detailsContainer() {
            this.tag('</details>');
        },
        detailsContainerClasses() {
            this.tag(`"`);
        },
        detailsContainerSummary() {
            const data = this.resume();
            this.raw(data);
            this.tag('</summary>');
        },
        detailsExpanded() {
            this.tag(' open');
        },
        detailsContainerHeader() {
            this.tag('>');
        },
    },
};
