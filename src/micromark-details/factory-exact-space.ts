import { markdownLineEnding, markdownLineEndingOrSpace, markdownSpace } from 'micromark-util-character';
import { Code, Construct, Effects, State, Tokenizer } from 'micromark-util-types';

export function factoryExactSpace(
	effects: Effects,
	ok: State,
	nok: State,
	type: string,
	number: number,
): State {
	let size = 0;
	const prefix: State = function (code) {
		if (size === number) {
			effects.exit(type);
			return ok(code);
		}
		if (markdownSpace(code)) {
			++size;
			effects.consume(code);
			return prefix;
		}
		// if (markdownLineEnding(code)) {
		// 	effects.consume(code);
		// 	size = 0;
		// 	return prefix;
		// }
		console.log(`factoryExactSpace: nok. code=${code}`);
		effects.exit(type);
		return nok(code);
	};
	return (code) => {
		if (markdownSpace(code)) {
			// if (markdownLineEndingOrSpace(code)) {
			effects.enter(type);
			return prefix(code);
		}
	};
}

const Exact4SpaceOrEmptyLineTokenizer: Tokenizer = function (effects: Effects, ok: State, nok: State): State {
	let current_space_count = 0;
	const eat_space: State = function (code: Code): void | State {
		console.log(`eat_space: code=${code}`)
		if (current_space_count === 4) {
			console.log(`eat_space: current_space_count === 4`)
			effects.exit('exact4SpaceOrEmptyLine');
			return ok(code);
		}
		if (markdownSpace(code)) {
			console.log(`eat_space: markdownSpace`)
			++current_space_count;
			effects.consume(code);
			return eat_space;
		}
		if (markdownLineEnding(code)) {
			console.log(`eat_space: markdownLineEnding`)
			effects.consume(code);
			current_space_count = 0;
			return eat_space;
		}
		console.log(`eat_space: nok. code=${code}`)
		effects.exit('exact4SpaceOrEmptyLine');
		return nok(code);
	}
	return (code: Code): void | State => {
		if (markdownLineEndingOrSpace(code)) {
			effects.enter('exact4SpaceOrEmptyLine');
			return eat_space(code);
		}
	}
}

export const Exact4SpaceOrEmptyLineClass: Construct = {
	tokenize: Exact4SpaceOrEmptyLineTokenizer,
	partial: true,
};
