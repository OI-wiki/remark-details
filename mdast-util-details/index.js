const types = {
  containerDirective: 'containerDirective',
};

export const detailsFromMarkdown = {
  enter: {
    detailsContainer: enterContainer,
  },
  exit: {
    detailsContainer: exit,
  },
};

/** @type {FromMarkdownHandle} */
function enterContainer(token) {
  enter.call(this, types.containerDirective, token);
}
/**
 * @this {ThisParameterType<FromMarkdownHandle>}
 * @param {string} type
 * @param {Parameters<FromMarkdownHandle>[0]} token
 */
function enter(type, token) {
  this.enter({ type, name: '', attributes: {}, children: [] }, token);
}

function exit(token) {
  this.exit(token);
}
