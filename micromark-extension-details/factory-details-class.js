import { markdownLineEnding, markdownSpace } from 'micromark-util-character';
import { codes } from 'micromark-util-symbol/codes.js';

export function factoryDetailsClass(effects, ok, nok) {
  const self = this;

  const classes = {
    note: 'note',
    warning: 'warning',
  };
  let detailsClass;
  let num = 0;

  return start;

  function start(code) {
    if (code === codes.lowercaseN) {
      detailsClass = classes.note;
    } else if (code === codes.lowercaseW) {
      detailsClass = classes.warning;
    } else {
      return nok(code);
    }
    effects.enter('detailsContainerClassName');
    return className;
  }
  function className(code) {
    if (num === detailsClass.length) {
      if (markdownSpace(code)) {
        effects.exit('detailsContainerClassName');
        return ok(code);
      } else {
        return nok(code);
      }
    }
    if (detailsClass[num++] !== String.fromCharCode(code)) {
      return nok(code);
    }
    effects.consume(code);

    return className;
  }
}
