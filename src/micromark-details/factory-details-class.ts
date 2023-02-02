import { markdownSpace } from 'micromark-util-character';
import { codes } from 'micromark-util-symbol/codes.js';
import { State, Tokenizer } from 'micromark-util-types';

export const factoryDetailsClass: Tokenizer = function (effects, ok, nok) {
	let detailsClass: 'note' | 'abstract' | 'info' | 'tip' | 'success' | 'failure' | 'bug' | 'danger' | 'example' | 'warning' | 'question';
	let num = 0;
	const className: State = function (code) {
		if (num === detailsClass.length) {
			if (markdownSpace(code)) {
				effects.exit('detailsContainerClassName');
				return ok(code);
			} else {
				return nok(code);
			}
		}
		if (detailsClass[num++] !== String.fromCharCode(code as number))
			return nok(code);
		effects.consume(code);
		return className;
	};
	return (code) => {
		switch (code) {
			case codes.lowercaseN:
				detailsClass = 'note';
				break;
			case codes.lowercaseA:
				detailsClass = 'abstract';
				break;
			case codes.lowercaseI:
				detailsClass = 'info';
				break;
			case codes.lowercaseT:
				detailsClass = 'tip';
				break;
			case codes.lowercaseS:
				detailsClass = 'success';
				break;
			case codes.lowercaseF:
				detailsClass = 'failure';
				break;
			case codes.lowercaseB:
				detailsClass = 'bug';
				break;
			case codes.lowercaseD:
				detailsClass = 'danger';
				break;
			case codes.lowercaseE:
				detailsClass = 'example';
				break;
			case codes.lowercaseW:
				detailsClass = 'warning';
				break;
			case codes.lowercaseQ:
				detailsClass = 'question';
				break;
			default:
				return nok(code);
		}
		effects.enter('detailsContainerClassName');
		return className;
	};
};
