import { codes } from 'micromark-util-symbol/codes.js';

export function factorySummary(effects, ok, nok, type) {
  const self = this;

  return start;

  function start(code) {
    if (is_cn_en(code)) {
      effects.enter(type);
      effects.consume(code);
      return summary;
    }
    return nok(code);
  }
  function name(code) {
    if (code === codes.dash || coed === codes.underscore || is_cn_en(code)) {
      effects.consume(code);
      return name;
    }

    // TODO: handle \n
    effects.exit(type);
    return;
  }
}

export function is_cn_en(char) {
  if (typeof char === 'undefined') {
    return false;
  }
  let cn =
    /[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/;
  let en = /[0-9A-Za-z]/;
  return cn.test(char) || en.test(char);
}
