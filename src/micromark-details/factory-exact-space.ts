import { markdownSpace } from 'micromark-util-character';
import { Code, Effects, State } from 'micromark-util-types';

export function factoryExactSpace(effects: Effects, ok: State, nok: State, type: string, number: number): State {
	let size = 0;
	const prefix: State = function (code) {
		if (size === number) {
			effects.exit(type);
			return ok(code);
		}
		if (markdownSpace(code) && ++size <= number) {
			effects.consume(code);
			return prefix;
		}
		effects.exit(type);
		return nok(code);
	}
	return (code) => {
		if (markdownSpace(code)) {
			effects.enter(type);
			return prefix(code);
		}
	}
}
