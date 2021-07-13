import assert from 'assert';
import { factorySpace } from 'micromark-factory-space';
import { markdownSpace } from 'micromark-util-character';
import { markdownLineEnding } from 'micromark-util-character';
import { codes } from 'micromark-util-symbol/codes.js';
import { constants } from 'micromark-util-symbol/constants.js';
import { types } from 'micromark-util-symbol/types.js';

import { factoryExactSpace } from './factory-exact-space.js';
import { factorySummary, is_cn_en } from './factory-summary.js';

const nonLazyLine = {
  tokenize: tokenizeNonLazyLine,
  partial: true,
};

const detailsContainer = {
  tokenize: tokenizeDetailsContainer,
  concrete: true,
};
export function details() {
  return {
    flow: { [codes.questionMark]: detailsContainer },
  };
}

function tokenizeDetailsContainer(effects, ok, nok) {
  const self = this;

  // const tail = self.events[self.events.length - 1];
  // const initialSize =
  // tail && tail[1].type === types.linePrefix
  //? tail[2].sliceSerialize(tail[1], true).length
  //: 0;

  let sizeOpen = 0;

  let previous;
  return open1;

  function open1(code) {
    assert(code === codes.questionMark, 'expected `?`');
    effects.enter('detailsContainer');
    effects.enter('detailsContainerFence');
    effects.enter('detailsContainerSequence');
    return open2(code);
  }
  function open2(code) {
    if (code === codes.questionMark) {
      effects.consume(code);
      sizeOpen++;
      return open2;
    }
    if (sizeOpen < constants.codeFencedSequenceSizeMin) {
      return nok(code);
    }
    effects.exit('detailsContainerSequence');
    return isExpanded;
  }
  function isExpanded(code) {
    if (code === codes.plusSign) {
      effects.enter('detailsExpanded');
      effects.consume(code);
      effects.exit('detailsExpanded');
    } else if (code === codes.space) {
      effects.consume(code);
    } else {
      return nok(code);
    }
    effects.exit('detailsContainerFence');
    return factorySummary.call(
      self,
      effects,
      factorySpace(effects, afterSummary, types.whitespace),
      nok,
      'detailsContainerSummary',
    );
  }
  /** @type {State} */
  function afterSummary(code) {
    if (code === codes.eof) {
      return afterOpening(code);
    }
    if (markdownLineEnding(code)) {
      // return effects.attempt(nonLazyLine, contentStart,
      // afterOpening)(code);
      effects.enter(types.lineEnding);
      effects.consume(code);
      effects.exit(types.lineEnding);
      return contentStart;
    }
    return nok(code);
  }
  /** @type {State} */
  function contentStart(code) {
    if (code === codes.eof) {
      effects.exit('detailsContainer');
      return ok(code);
    }
    effects.enter('detailsContainerContent');
    return lineStart(code);
  }
  /** @type {State} */
  function lineStart(code) {
    if (code === codes.eof) {
      return after(code);
    }
    if (!markdownSpace(code)) {
      return after(code);
    }
    // if (initialSize) {
    // return factorySpace(
    // effects,
    // chunkStart,
    // types.linePrefix,
    // initialSize + 1,
    //);
    //} else {
    // return chunkStart;
    //}
    return factoryExactSpace(effects, chunkStart, nok, types.linePrefix, 4);
  }
  /** @type {State} */
  function chunkStart(code) {
    if (code === codes.eof) {
      return after(code);
    }
    effects.enter(types.chunkDocument, {
      contentType: constants.contentTypeDocument,
      // previous,
    });
    // if (previous) previous.next = token;
    // previous = token;
    return contentContinue;
  }
  /** @type {State} */
  function contentContinue(code) {
    if (code === codes.eof) {
      effects.exit(types.chunkDocument);
      // self.parser.lazy[token.start.line] = false;
      return after(code);
    }
    if (markdownLineEnding(code)) {
      // return effects.check(nonLazyLine, nonLazyLineAfter,
      // lineAfter)(code);
      return nonLazyLineAfter;
    }
    effects.consume(code);
    return contentContinue;
  }
  /** @type {State} */
  // FIXME: change name for this func
  function nonLazyLineAfter(code) {
    effects.consume(code); // consume line ending
    effects.exit(types.chunkDocument);
    // self.parser.lazy[token.start.line] = false;
    return lineStart;
  }
  /** @type {State} */
  function lineAfter(code) {
    const token = effects.exit(types.chunkDocument);
    self.parser.lazy[token.start.line] = false;
    return after(code);
  }
  /** @type {State} */
  function after(code) {
    effects.exit('detailsContainerContent');
    effects.exit('detailsContainer');
    return ok(code);
  }
  /** @type {State} */
  function afterOpening(code) {
    effects.exit('detailsContainer');
    return ok(code);
  }
}
/** @type {Tokenizer} */
function tokenizeNonLazyLine(effects, ok, nok) {
  const self = this;

  return start;
  /** @type {State} */
  function start(code) {
    assert(markdownLineEnding(code), 'expected eol');
    effects.enter(types.lineEnding);
    effects.consume(code);
    effects.exit(types.lineEnding);
    return lineStart;
  }
  /** @type {State} */
  function lineStart(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
  }
}
