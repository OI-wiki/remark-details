export const detailsFromMarkdown = {
  enter: {
    detailsContainer: enterContainer,
  },
  exit: {
    detailsContainer: exit,
    detailsExpanded: exitExpanded,
    detailsContainerClassName: exitClassName,
  },
};

export const detailsToMarkdown = {
  //
};

function enterContainer(token) {
  enter.call(this, 'details', token);
}

function enter(type, token) {
  this.enter({ type: type, name: '', attributes: {}, children: [] }, token);
}

function exitExpanded(token) {
  this.setData('detailsAttributes', []);
  this.getData('detailsAttributes').push(['open', true]);
}
function exitClassName(token) {
  this.getData('detailsAttributes').push(['class', this.sliceSerialize(token)]);

  const attributes = this.getData('detailsAttributes');
  const cleaned = {};
  let index = -1;
  let attribute;
  // pushin all the attributes
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
}
function exit(token) {
  this.exit(token);
}
