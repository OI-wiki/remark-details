export function detailsHtml(options = {}) {
  return {
    enter: {
      detailsContainer() {
        this.tag('<details');
      },
      detailsContainerClassName() {
        this.tag(` class="`);
      },
      detailsContainerSummary() {
        this.tag('>');
        this.tag('<summary>');
        this.buffer();
      },
      detailsContainerContent() {
        // this.tag('<p>');
      },
    },
    exit: {
      detailsContainer() {
        this.tag('</details>');
      },
      detailsContainerClassName(token) {
        this.tag(this.sliceSerialize(token));
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
      detailsContainerFence() {},
      detailsContainerContent() {
        // this.tag('</p>');
      },
    },
  };

  /**
   * @this {CompileContext}
   * @param {DirectiveType} type
   */
  // function enter(type) {
  // let stack = this.getData('detailsStack');
  // if (!stack) this.setData('detailsStack', (stack = []));
  // stack.push({ type, name: '' });
  //}

  // function exit() {
  // const details = this.getData('detailsStack').pop();
  // let found;
  // let result;

  // if (own.call(option, ))
  //}
}
