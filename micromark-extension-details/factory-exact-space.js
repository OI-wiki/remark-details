import { markdownSpace } from 'micromark-util-character';

/**
 * @param {Effects} effects
 * @param {State} ok
 * @param {State} nok
 * @param {string} type
 * @param {number} number
 * @returns {State}
 */
export function factoryExactSpace(effects, ok, nok, type, number) {
  let size = 0;
  return start;
  /** @type {State} */
  function start(code) {
    if (markdownSpace(code)) {
      effects.enter(type);
      return prefix(code);
    }
  }
  /** @type {State} */
  function prefix(code) {
    if (markdownSpace(code) && ++size <= number) {
      effects.consume(code);
      return prefix;
    }

    effects.exit(type);
    if (size === number) {
      return ok(code);
    } else {
      return nok(code);
    }
  }
}
