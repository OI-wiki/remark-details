import { factorySpace } from 'micromark-factory-space';
import { markdownSpace } from 'micromark-util-character';
import { markdownLineEnding } from 'micromark-util-character';
import { codes } from 'micromark-util-symbol/codes.js';
import { constants } from 'micromark-util-symbol/constants.js';
import { types } from 'micromark-util-symbol/types.js';
import { Extension, State, Token, Tokenizer } from 'micromark-util-types';

import { factoryDetailsClass } from './factory-details-class.js';
import { factoryExactSpace } from './factory-exact-space.js';
import { factorySummary } from './factory-summary.js';

const tokenizeDetailsContainer: Tokenizer = function (effects, ok, nok) {
	const ctx = this;
	let previous: Token;
	let sizeOpen = 0;
	let openingMark: number; // can be "?" or "!"

	const open: State = (code) => {
		effects.enter('detailsContainer');
		effects.enter('detailsContainerFence');
		effects.enter('detailsContainerSequence');
		if (code === codes.questionMark) {
			openingMark = codes.questionMark;
			return open2(code);
		} else if (code === codes.exclamationMark) {
			openingMark = codes.exclamationMark;
			return open2(code);
		} else {
			return nok(code);
		}
	};
	const open2: State = function (code) {
		if (code === openingMark) {
			effects.consume(code);
			sizeOpen++;
			return open2;
		}
		if (sizeOpen < constants.codeFencedSequenceSizeMin) return nok(code);
		effects.exit('detailsContainerSequence');
		return isExpanded;
	};

	const isExpanded: State = function (code) {
		if (code === codes.plusSign) {
			effects.enter('detailsExpanded');
			effects.consume(code);
			effects.exit('detailsExpanded');
		} else if (code !== codes.space) {
			return nok(code);
		}
		effects.exit('detailsContainerFence');

		// first get space, than try if there is class name
		// if so try again for space, and then get summary
		// if not just get summary
		return factorySpace(
			effects,
			effects.attempt(
				detailsClass,
				factorySpace(
					effects,
					factorySummary.call(
						ctx,
						effects,
						factorySpace(effects, afterSummary, types.whitespace),
						nok,
						'detailsContainerSummary',
					),
					types.whitespace,
				),
				factorySummary.call(
					ctx,
					effects,
					factorySpace(effects, afterSummary, types.whitespace),
					nok,
					'detailsContainerSummary',
				),
			),
			types.whitespace,
		);
	};

	const afterSummary: State = function (code) {
		if (code === codes.eof) return afterOpening(code);
		if (markdownLineEnding(code)) {
			// return effects.attempt(nonLazyLine, contentStart,
			// afterOpening)(code);
			effects.enter(types.lineEnding);
			effects.consume(code);
			effects.exit(types.lineEnding);
			return contentStart;
		}
		return nok(code);
	};
	const contentStart: State = function (code) {
		if (code === codes.eof) {
			effects.exit('detailsContainer');
			return ok(code);
		}
		effects.enter('detailsContainerContent');
		return lineStart(code);
	};
	const lineStart: State = function (code) {
		if (code === codes.eof) return after(code);
		if (!markdownSpace(code)) return after;
		return factoryExactSpace(effects, chunkStart, nok, types.linePrefix, 4);
	};
	const chunkStart: State = function (code) {
		if (code === codes.eof) {
			return after(code);
		}
		const token = effects.enter(types.chunkDocument, {
			contentType: constants.contentTypeDocument,
			previous,
		});
		if (previous) previous.next = token;
		previous = token;
		return contentContinue;
	};
	const contentContinue: State = function (code) {
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
	};
	// FIXME: change name for this func
	const nonLazyLineAfter: State = function (code) {
		effects.consume(code); // consume line ending
		effects.exit(types.chunkDocument);
		// self.parser.lazy[token.start.line] = false;
		return lineStart;
	};
	const lineAfter: State = function (code) {
		const token = effects.exit(types.chunkDocument);
		ctx.parser.lazy[token.start.line] = false;
		return after(code);
	};
	const after: State = function (code) {
		effects.exit('detailsContainerContent');
		effects.exit('detailsContainer');
		return ok(code);
	};
	const afterOpening: State = function (code) {
		effects.exit('detailsContainer');
		return ok(code);
	};
	return open;
};

const tokenizeDetailsClass: Tokenizer = factoryDetailsClass;

const detailsClass = {
	tokenize: tokenizeDetailsClass,
};

const detailsContainer = {
	tokenize: tokenizeDetailsContainer,
	concrete: true,
};

const syntax: Extension = {
	flow: {
		[codes.questionMark]: detailsContainer,
		[codes.exclamationMark]: detailsContainer,
	},
};

export default syntax;
