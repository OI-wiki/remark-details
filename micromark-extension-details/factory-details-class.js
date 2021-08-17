import { markdownLineEnding, markdownSpace } from 'micromark-util-character';
import { codes } from 'micromark-util-symbol/codes.js';
import { constants } from 'micromark-util-symbol/constants.js';
import { types } from 'micromark-util-symbol/types.js';

export function factoryDetailsClass(effects, ok, nok) {
  const self = this;

  const classes = {
    note: 'note',
    warning: 'warning',
    question: 'question',
  };
  let detailsClass;
  let num = 0;

  return start;

  function start(code) {
    if (code === codes.lowercaseN) {
      detailsClass = classes.note;
    } else if (code === codes.lowercaseW) {
      detailsClass = classes.warning;
    } else if (code === codes.lowercaseQ) {
      detailsClass = classes.question;
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
