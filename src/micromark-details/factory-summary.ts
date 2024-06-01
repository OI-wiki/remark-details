import { markdownLineEnding } from 'micromark-util-character';
import { constants } from 'micromark-util-symbol/constants.js';
import { types } from 'micromark-util-symbol/types.js';
import { Code, Effects, State } from 'micromark-util-types';

export function factorySummary(
	effects: Effects,
	ok: State,
	nok: State,
	type: string,
): State {
	function summary(code: Code) {
		if (!markdownLineEnding(code)) {
			effects.consume(code);
			return summary;
		}
		effects.exit(types.chunkText);
		effects.exit(type);
		return ok(code);
	}
	return (code) => {
		if (!markdownLineEnding(code)) {
			effects.enter(type);
			effects.enter(types.chunkText, {
				contentType: constants.contentTypeText,
			});
			effects.consume(code);
			return summary;
		}
		return nok(code);
	};
}
