"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.findTopicFormsInString = exports.findWordFormsInString = undefined;

var _matchTextWithArray = require("../stringProcessing/matchTextWithArray.js");

var _matchTextWithArray2 = _interopRequireDefault(_matchTextWithArray);

var _lodashEs = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Matches forms of words in the keyphrase against a given text.
 *
 * @param {Array} keywordForms The array with word forms of all (content) words from the keyphrase in a shape
 *                             [ [ form1, form2, ... ], [ form1, form2, ... ] ]
 * @param {string} text The string to match the word forms against.
 * @param {string} locale The locale of the paper.
 *
 * @returns {Object} The number and the percentage of the keyphrase words that were matched in the text by at least one form.
 */
var findWordFormsInString = function findWordFormsInString(keywordForms, text, locale) {
	var wordNumber = keywordForms.length;
	var foundWords = Array(wordNumber);

	for (var i = 0; i < wordNumber; i++) {
		var found = (0, _matchTextWithArray2.default)(text, keywordForms[i], locale).count > 0;
		foundWords[i] = found ? 1 : 0;
	}
	var foundNumberOfWords = (0, _lodashEs.sum)(foundWords);
	var result = {
		countWordMatches: foundNumberOfWords,
		percentWordMatches: 0
	};

	if (wordNumber > 0) {
		result.percentWordMatches = Math.round(foundNumberOfWords / wordNumber * 100);
	}

	return result;
};

/**
 * Matches forms of words in the keyphrase and in the synonyms against a given text.
 *
 * @param {Object} topicForms The object with word forms of all (content) words from the keyphrase and eventually synonyms,
 * comes in a shape {
 *                     keyphraseForms: [[ form1, form2, ... ], [ form1, form2, ... ]],
 *                     synonymsForms: [
 *                          [[ form1, form2, ... ], [ form1, form2, ... ]],
 *                          [[ form1, form2, ... ], [ form1, form2, ... ]],
 *                          [[ form1, form2, ... ], [ form1, form2, ... ]],
 *                     ],
 *                  }
 * @param {string} text The string to match the word forms against.
 * @param {boolean} useSynonyms Whether to use synonyms as if it was keyphrase or not (depends on the assessment).
 * @param {string} locale The locale of the paper.
 *
 * @returns {Object} The number and the percentage fo the keyphrase words or synonyms that were matched in the text by at least one form,
 * and whether the keyphrase or a synonym was matched.
 */
var findTopicFormsInString = function findTopicFormsInString(topicForms, text, useSynonyms, locale) {
	// First check if the keyword is found in the text
	var result = findWordFormsInString(topicForms.keyphraseForms, text, locale);
	result.keyphraseOrSynonym = "keyphrase";

	// If a full match found with the keyword or if no synonyms are supplied or supposed to be used, return the keyphrase search result.
	if (result.percentWordMatches === 100 || useSynonyms === false || (0, _lodashEs.isEmpty)(topicForms.synonymsForms)) {
		return result;
	}

	// Collect results of matching of every synonym with the text.
	var resultsSynonyms = [];
	for (var i = 0; i < topicForms.synonymsForms.length; i++) {
		var synonym = topicForms.synonymsForms[i];
		resultsSynonyms[i] = findWordFormsInString(synonym, text, locale);
	}

	// Find which synonym occurred most fully.
	var foundSynonyms = resultsSynonyms.map(function (resultSynonyms) {
		return resultSynonyms.percentWordMatches;
	});
	var bestSynonymIndex = foundSynonyms.indexOf(Math.max.apply(Math, _toConsumableArray(foundSynonyms)));

	// If the best synonym showed lower results than the keyword, return the keyword.
	if (result.percentWordMatches >= resultsSynonyms[bestSynonymIndex].percentWordMatches) {
		return result;
	}

	// If the best synonym showed better results than the keyword, return the synonym.
	result = resultsSynonyms[bestSynonymIndex];
	result.keyphraseOrSynonym = "synonym";

	return result;
};

exports.findWordFormsInString = findWordFormsInString;
exports.findTopicFormsInString = findTopicFormsInString;
//# sourceMappingURL=findKeywordFormsInString.js.map
