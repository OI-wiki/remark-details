export function detailsHtml(options = {}) {
  return {
    enter: {
      detailsContainer() {
        return enter.call(this, 'containerDetails');
      },
      detailsContainerSummary() {
        this.tag('<summary>');
        this.buffer();
      },
      detailsContainerContent() {
        // TODO
      },
    },
    exit: {
      detailsContainer() {
        this.tag('</details>');
      },
      detailsContainerSummary() {
        const data = this.resume();
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
}
/**
 * @this {CompileContext}
 * @param {DirectiveType} type
 */
function enter(type) {
  let stack = this.getData('detailsStack');
  if (!stack) this.setData('detailsStack', (stack = []));
  stack.push({ type, name: '' });
}

function exit() {
  const details = this.getData('detailsStack').pop();
  let found;
  let result;

  // TODO
}

// export function detailsHtml(options = {}) {
// return {
// enter: {
// detailsContainer() {
// this.tag('<details');
//},
// detailsContainerSummary() {
// this.tag('<summary>');
// this.buffer();
//},
// detailsContainerContent() {
//// TODO
//},
//},
// exit: {
// detailsContainer() {
// this.tag('</details>');
//},
// detailsContainerSummary() {
// const data = this.resume();
// this.tag('</summary>');
//},
// detailsExpanded() {
// this.tag(' open');
//},
// detailsContainerFence() {
// this.tag('>');
//},
//},
//};
