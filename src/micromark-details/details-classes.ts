import { factorySpace } from 'micromark-factory-space';
import { markdownLineEnding } from 'micromark-util-character'
import { codes } from 'micromark-util-symbol/codes.js';
import { Code, Construct, State, Tokenizer } from 'micromark-util-types';

export const alphanumeric = (code: Code) => {
  const regex = /[\p{L}\p{N}_\-]/u;
  return code !== null && code > -1 && regex.test(String.fromCharCode(code));
};

const tokenizeDetailsClasses: Tokenizer = function (effects, ok, nok) {
  // At the start of a class name or its leading spaces.
  // |???+ note  summary info "Title"
  //       ^   ^        ^
  const start: State = (code) => {
    return factorySpace(
      effects,
      beforeDetailsClassName,
      'detailsContainerClassWhitespace'
    );
  };

  // At the start of a class name.
  // |???+ note  summary info "Title"
  //       ^     ^       ^
  const beforeDetailsClassName: State = (code) => {
    if (alphanumeric(code)) {
      effects.enter('detailsContainerClassName');
      return detailsClassName;
    }
    return nok;
  };

  // At the class name.
  // |???+ note  summary info "Title"
  //       ^^^^  ^^^^^^^ ^^^^
  const detailsClassName: State = (code) => {
    if (alphanumeric(code)) {
      effects.consume(code);
      return detailsClassName;
    } else if (code === codes.space || markdownLineEnding(code) || code === codes.eof) {
      return afterDetailsClassName;
    } else {
      return nok;
    }
  };

  // At the end of a class name.
  // Recursively check if there is any more class name.
  // |???+ note  summary info "Title"
  //           ^        ^    ^
  const afterDetailsClassName: State = (code) => {
    effects.exit('detailsContainerClassName');
    return effects.attempt(detailsClasses, ok, ok);
  };

  return start;
};

export const detailsClasses: Construct = {
  partial: true,
  tokenize: tokenizeDetailsClasses,
};
