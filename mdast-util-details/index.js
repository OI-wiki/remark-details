const types = {
  containerDetails: 'containerDetails',
};

export const detailsFromMarkdown = {
  enter: {
    detailsContainer: enterContainer,
    detailsContainerSummary: enterSummary,
  },
  exit: {
    detailsContainer: exit,
    detailsContainerSummary: exitSummary,
  },
};

/** @type {FromMarkdownHandle} */
function enterContainer(token) {
  enter.call(this, types.containerDetails, token);
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
