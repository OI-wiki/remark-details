export const detailsFromMarkdown = {
  enter: {
    detailsContainer: enterContainer,
    detailsContainerSummary: enterSummary,
  },
  exit: {
    detailsContainer: exit,
    detailsContainerSummary: exit,
    detailsExpanded: exitExpanded,
    detailsContainerClassName: exitClassName,
  },
};

export const detailsToMarkdown = {
  // TODO well if you want :sweat_smile:
};

function enterContainer(token) {
  enter.call(this, 'detailsContainer', token, 'details');
}
function enterSummary(token) {
  // pushin all the attributes for <details> tag before entering <summary> tag
  const attributes = this.getData('detailsAttributes');
  const cleaned = {};
  let index = -1;
  let attribute;
  while (++index < attributes.length) {
    attribute = attributes[index];
    if (attribute[0] === 'class' && cleaned.class) {
      cleaned.class += ' ' + attribute[1];
    } else {
      cleaned[attribute[0]] = attribute[1];
    }
  }

  this.setData('detailsAttributes');
  this.stack[this.stack.length - 1].attributes = cleaned;

  enter.call(this, 'detailsContainerSummary', token, 'summary');
}
function enter(type, token, name) {
  this.enter(
    { type: type, name: name || '', attributes: {}, children: [] },
    token,
  );
}

function exitExpanded(token) {
  this.setData('detailsAttributes', []);
  this.getData('detailsAttributes').push(['open', true]);
}
function exitClassName(token) {
  this.getData('detailsAttributes').push(['class', this.sliceSerialize(token)]);
}
function exit(token) {
  this.exit(token);
}
