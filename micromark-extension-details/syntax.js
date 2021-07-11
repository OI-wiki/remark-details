import assert from 'assert';
import {factorySpace} from 'micromark-factory-space';
import {markdownSpace} from 'micromark-util-character';
import {codes} from 'micromark-util-symbol/codes.js';
import {constants} from 'micromark-util-symbol/constants.js';
import {types} from 'micromark-util-symbol/types.js';
import {factorySummary} from './factory-summary.js';

const detailsContainer = {
    tokenize: tokenizeDetailsContainer,
    concrete: true,
};
export function details() {
    return {
        flow: {[codes.questionMark]: detailsContainer},
    };
}

function tokenizeDetailsContainer(effects, ok, nok) {
    const self = this;
    let sizeOpen = 0;

    return open1;

    function open1(code) {
        assert(code === codes.questionMark, 'expected `?`');
        effects.enter('detailsContainer');
        effects.enter('detailsContainerFence');
        effects.enter('detailsContainerSequence');
        return open2(code);
    }
    function open2(code) {
        if (code === codes.questionMark) {
            effects.consume(code);
            sizeOpen++;
            return open2;
        }
        if (sizeOpen < constants.codeFencedSequenceSizeMin) {
            return nok(code);
        }
        effects.exit('detailsContainerSequence');
        return isExpanded;
    }
    function isExpended(code) {
        if (code === codes.plusSign) {
            effects.enter('detailsExpanded');
            effects.consume(code);
            effects.exit('detailsExpanded');
        } else if (code === codes.space) {
            effects.consume(code);
        } else {
            return nok(code);
        }
        return factorySummary.call(
            self,
            effects,
            factorySpace(effects, afterSummay, types.whitespace),
            nok,
            'detailsContainerSummary',
        );
    }
    /** @type {State} */
    function afterSummary(code) {
        effects.exit('detailsContainerFence');
        if (code === codes.eof) {
            return afterOpening(code);
        }
        // TODO: process line ending && start of content
    }
    /** @type {State} */
    function afterSummary(code) {
        function afterOpening(code) {
            effects.exit('detailsContainer');
            return ok(code);
        }
    }


    function tokenizeDetailsContinuation(effects, ok, nok) {
        return factorySpace(
            effects,
            effects.attempt(details),
            types.linePrefix,
            this.parser.constructs.disable.null.includes('codeIndented') ?
                undefined :
                constants.tabSize,
        );
    }
