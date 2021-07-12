export function detailsHtml(options = {}) {
  return {
    enter: {
      detailsContainer() {
        this.tag('<details');
      },
      detailsContainerSummary() {
        this.tag('<summary>');
      },
      detailsContainerContent() {
        this.buffer();
      },
    },
    exit: {
      detailsContainer() {
        this.tag('</details>');
      },
      detailsContainerSummary() {
        this.tag('</summary>');
      },
      detailsExpanded() {
        this.tag(' open');
      },
      detailsContainerFence() {
        this.tag('>');
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
