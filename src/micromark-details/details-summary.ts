import { markdownLineEnding } from 'micromark-util-character'
import { codes } from 'micromark-util-symbol/codes.js';
import { constants } from 'micromark-util-symbol/constants.js';
import { types } from 'micromark-util-symbol/types.js';
import { Construct, State, Tokenizer } from 'micromark-util-types';
import { blankLine } from 'micromark-core-commonmark';

const tokenizeDetailsSummary: Tokenizer = function (effects, ok, nok) {
  const self = this;

  // At the start of a details container summary.
  // |???+ note "Title text"More text"
  //            ^
  const start: State = (code) => {
    if (self.previous === codes.space && code === codes.quotationMark) {
      effects.enter('detailsContainerSummaryWithQuotes');
      effects.consume(code);
      effects.enter('detailsContainerSummary');
      effects.enter(types.chunkText, {
        contentType: constants.contentTypeText,
      });
      return checkEnding;
    }
    return nok;
  };

  // After the start of a details container summary.
  // Check if it finds a quotation marker with only trailing spaces so that the summary ends.
  // |???+ note "Title text"More text"
  //             ^^^^^^^^^^^^^^^^^^^^^
  const checkEnding: State = (code) => {
    if (markdownLineEnding(code) || code === codes.eof) return nok;
    return effects.check(detailsSummaryEnding, after, summaryContent);
  };

  // At the details container summary.
  // |???+ note "Title text"More text"
  //             ^^^^^^^^^^^^^^^^^^^^
  const summaryContent: State = (code) => {
    effects.consume(code);
    return checkEnding;
  };

  // At the end of a details container summary.
  // |???+ note "Title text"More text"
  //                                 ^
  const after: State = (code) => {
    effects.exit(types.chunkText);
    effects.exit('detailsContainerSummary');
    effects.consume(code);
    effects.exit('detailsContainerSummaryWithQuotes');
    return ok;
  };

  return start;
};

const detailsSummaryEnding: Construct = {
  partial: true,
  tokenize(effects, ok, nok) {
    return (code) => {
      if (code === codes.quotationMark) {
        effects.consume(code);
        return effects.attempt(blankLine, ok, nok);
      }
      return nok;
    };
  },
};

export const detailsSummary: Construct = {
  partial: true,
  tokenize: tokenizeDetailsSummary,
};

