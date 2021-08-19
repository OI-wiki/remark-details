import { markdownLineEnding } from 'micromark-util-character';
import { constants } from 'micromark-util-symbol/constants.js';
import { types } from 'micromark-util-symbol/types.js';
export function factorySummary(effects, ok, nok, type) {
    function summary(code) {
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
export const chineseOrEnglish = /[0-9A-Za-z\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/;
