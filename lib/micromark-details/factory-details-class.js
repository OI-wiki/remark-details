import { markdownSpace } from 'micromark-util-character';
import { codes } from 'micromark-util-symbol/codes.js';
export const factoryDetailsClass = function (effects, ok, nok) {
    let detailsClass;
    let num = 0;
    const className = function (code) {
        if (num === detailsClass.length) {
            if (markdownSpace(code)) {
                effects.exit('detailsContainerClassName');
                return ok(code);
            }
            else {
                return nok(code);
            }
        }
        if (detailsClass[num++] !== String.fromCharCode(code))
            return nok(code);
        effects.consume(code);
        return className;
    };
    return code => {
        switch (code) {
            case codes.lowercaseN:
                detailsClass = 'note';
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
