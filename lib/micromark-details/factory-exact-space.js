import { markdownSpace } from 'micromark-util-character';
export function factoryExactSpace(effects, ok, nok, type, number) {
    let size = 0;
    const prefix = function (code) {
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
    };
    return (code) => {
        if (markdownSpace(code)) {
            effects.enter(type);
            return prefix(code);
        }
    };
}
