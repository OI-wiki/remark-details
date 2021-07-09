export const detailsHtml = {
  enter: {
    detailsMarker() {
      this.tag('<details ');
    },
    detailsExpended() {
      this.tag('open');
    },
    detailsSummary() {
      this.tag('<summary>');
    },
  },
  exit: {
    detailsMarker() {
      this.tag('>');
    },
    detailsSummary() {
      this.tag('</summary>');
    },
    details() {
      this.tag('</details>');
    },
  },
};
