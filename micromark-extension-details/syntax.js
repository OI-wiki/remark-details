import assert from 'assert';
import { factorySpace } from 'micromark-factory-space';
import { markdownSpace } from 'micromark-util-character';
import { codes } from 'micromark-util-symbol/codes.js';
import { constants } from 'micromark-util-symbol/constants.js';
import { types } from 'micromark-util-symbol/types.js';

export const details = {
  name: 'details',
  tokenize: tokenizeDetails,
  continuation: { tokenize: tokenizeDetailsContinuation },
  exit,
};

function tokenizeDetails(effects, ok, nok) {
  const self = this;

  return open1;

  function open1(code) {
    assert(code === codes.questionMark, 'expected `?`');
    const state = selef.containerState;
    assert(state, 'expected `containerState` to be defined in container');
    if (!state.open) {
      effects.enter('details', { _container: true });
      state.open = true;
    }
    effects.enter('detailsPrefix');
    effects.enter('detailsMarker');
    effects.consume(code);
    return open2;
  }
  function open2(code) {
    return code === codes.questionMark ? open3(code) : nok(code);
  }
  function open3(code) {
    if (code !== codes.questionMark) return nok(code);
    effects.consume(code);
    return isExpended;
  }
  function isExpended(code) {
    if (code === codes.plusSign) {
      effects.enter('detailsExpended');
      effects.consume(code);
      effects.exit('detailsExpended');
      effects.exit('detailsMarker');
    } else if (code === codes.space) {
      effects.consume(code);
      effects.exit('detailsMarker');
      return summaryStart;
    } else {
      return nok(code);
    }
  }
  function summaryStart(code) {
    if (code === codes.lf) {
      effects.exit('detailsPrefix');
      return ok(code);
    }
    effects.enter('detailsSummary');
    effects.consume(code);
    return summaryInside;
  }
  function summaryInside(code) {
    if (code === codes.lf) {
      effects.exit('detailsSummary');
      effects.exit('detailsPrefix');
      return ok(code);
    }
    return summaryInside(code);
  }
}

function tokenizeDetailsContinuation(effects, ok, nok) {
  return factorySpace(
    effects,
    effects.attempt(details),
    types.linePrefix,
    this.parser.constructs.disable.null.includes('codeIndented')
      ? undefined
      : constants.tabSize,
  );
}

function exit(effects) {
  effects.exit('details');
}
