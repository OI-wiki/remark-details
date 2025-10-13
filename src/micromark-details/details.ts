import { factorySpace } from 'micromark-factory-space';
import { markdownLineEnding, markdownSpace } from 'micromark-util-character'
import { codes } from 'micromark-util-symbol/codes.js';
import { types } from 'micromark-util-symbol/types.js';
import { Construct, Extension, Exiter, State, Tokenizer, TokenTypeMap } from 'micromark-util-types';
import { blankLine } from 'micromark-core-commonmark';

import { alphanumeric, detailsClasses } from './details-classes.js';
import { detailsSummary } from './details-summary.js';

const detailsContentTabSize: number = 4;
const detailsIndentType: keyof TokenTypeMap = types.listItemIndent;

const tokenizeDetailsContainer: Tokenizer = function (effects, ok, nok) {
  const self = this;
  let sizeOpen: number = 0;
  let openingMark: number;
  
  // At the start of details block.
  // |???+ note "Title"
  //  ^
  const start: State = (code) => {
    if (code === codes.questionMark) {
      openingMark = code;
      effects.enter('detailsContainer', {_container: true});
      self.containerState!.type = 'detailsContainer';
      effects.enter('detailsContainerHeader');
      effects.enter('detailsContainerSequence');
      return sequenceOpen;
    } else {
      return nok;
    }
  };

  // In the opening sequence of the details block marker.
  // |???+ note "Title"
  //  ^^^
  const sequenceOpen: State = (code) => {
    if (code === openingMark) {
      effects.consume(code);
      sizeOpen++;
      return sequenceOpen;
    }
    if (sizeOpen != 3) return nok;
    effects.exit('detailsContainerSequence');
    return isExpanded;
  };

  // At the marker for default opening state.
  // |???+ note "Title"
  //     ^
  const isExpanded: State = (code) => {
    if (code === codes.plusSign) {
      effects.enter('detailsExpanded');
      effects.consume(code);
      effects.exit('detailsExpanded');
    }
    return afterDetailsContainerStart;
  };

  // At the optional space after the details block marker.
  // |???+ note "Title"
  //      ^
  const afterDetailsContainerStart: State = (code) => {
    if (code === codes.space) {
      effects.enter(types.whitespace);
      effects.consume(code);
      effects.exit(types.whitespace);
    }
    return beforeContainerClasses;
  };

  // At the start of the container classes.
  // It should recognize all unicode letters, unicode numbers, underscore and hyphen before a quotation marker.
  // The container classes are optional if the container summary is present.
  // |???+ note "Title"
  //       ^
  const beforeContainerClasses: State = (code) => {
    if (alphanumeric(code)) {
      effects.enter('detailsContainerClasses');
      return effects.attempt(detailsClasses, afterContainerClasses, nok);
    }
    effects.exit('detailsContainerHeader');
    return factorySpace(
      effects,
      effects.attempt(detailsSummary, afterContainerSummary, nok),
      types.whitespace
    )
  };

  // After the end of the container classes.
  // Since at lease one container class has been found, the container summary is optional.
  // |???+ note "Title"
  //           ^
  const afterContainerClasses: State = (code) => {
    effects.exit('detailsContainerClasses');
    effects.exit('detailsContainerHeader');
    return factorySpace(
      effects,
      effects.attempt(detailsSummary, afterContainerSummary, afterContainerSummary),
      types.whitespace
    )
  };

  // After the end of the container summary.
  // |???+ note "Title"
  //                   ^
  const afterContainerSummary: State = (code) => {
    return factorySpace(effects, after, types.whitespace);
  };

  // At the end of the container header line.
  // |???+ note "Title"  ␊
  //                     ^
  const after: State = (code) => {
    if (markdownLineEnding(code) || code === codes.eof) {
      return ok;
    }
    return nok;
  };

  return start;
};

const tokenizeDetailsContainerContinuation: Tokenizer = function (effects, ok, nok) {
  // At the beginning of a blank line, continue to check the next line.
  const onBlank: State = (code) => {
    return factorySpace(
      effects,
      ok,
      detailsIndentType,
      detailsContentTabSize + 1
    );
  };

  // At the beginning of a nonblank line, attempt to parse the details indent.
  // If it fails, it closes the current container.
  const notBlank: State = (code) => {
    if (!markdownSpace(code)) return nok;
    return effects.attempt(detailsIndent, ok, nok);
  };

  return effects.check(blankLine, onBlank, notBlank);
};

const tokenizeDetailsContainerEnd: Exiter = function (effects) {
  effects.exit('detailsContainer');
}

const tokenizeDetailsIndent: Tokenizer = function (effects, ok, nok) {
  const self = this;

  // After the end of the details indent.
  // |    Text.
  //      ^
  const afterIndent: State = (code) => {
    const tail = self.events[self.events.length - 1]
    return tail &&
      tail[1].type === detailsIndentType &&
      tail[2].sliceSerialize(tail[1], true).length === detailsContentTabSize
      ? ok
      : nok
  };

  return factorySpace(effects, afterIndent, detailsIndentType, detailsContentTabSize + 1);
};

const detailsContainer: Construct = {
  tokenize: tokenizeDetailsContainer,
  name: 'detailsContainer',
  continuation: {tokenize: tokenizeDetailsContainerContinuation},
  exit: tokenizeDetailsContainerEnd,
};

const detailsIndent: Construct = {
  partial: true,
  tokenize: tokenizeDetailsIndent,
};

const details: Extension = {
  document: {
    [codes.questionMark]: detailsContainer,
  },
};

export default details;
