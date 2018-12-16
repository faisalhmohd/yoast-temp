"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _relevantWords = require("../stringProcessing/relevantWords");

/**
 * Retrieves the relevant words from the given paper.
 *
 * @param {Paper} paper The paper to determine the relevant words of.
 * @returns {WordCombination[]} Relevant words for this paper, filtered and sorted.
 */
function relevantWords(paper) {
  return (0, _relevantWords.getRelevantWords)(paper.getText(), paper.getLocale());
}

exports.default = relevantWords;
//# sourceMappingURL=relevantWords.js.map
