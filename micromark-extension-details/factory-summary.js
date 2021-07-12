import { markdownSpace } from 'micromark-util-character';
import { codes } from 'micromark-util-symbol/codes.js';

export function factorySummary(effects, ok, nok, type) {
  const self = this;
  console.log(`consume: `);

  return start;

  function start(code) {
    console.log(`code is: ${code}`);
    if (is_cn_en(code)) {
      effects.enter(type);
      effects.consume(code);
      return summary;
    }
    return nok(code);
  }
  function summary(code) {
    if (
      code === codes.dash ||
      code === codes.underscore ||
      markdownSpace(code) ||
      is_cn_en(code)
    ) {
      effects.consume(code);
      console.log(`consume: ${code}`);
      return summary;
    }

    console.log('OK');
    effects.exit(type);
    return ok(code);
  }
}

/**
 * @param {Code} code
 */
export function is_cn_en(code) {
  if (code === null) return false;
  const cn =
    /[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/;
  const en = /[0-9A-Za-z]/;
  const ch = String.fromCharCode(code);
  return cn.test(ch) || en.test(ch);
}
