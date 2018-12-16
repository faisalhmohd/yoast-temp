"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (paper, researcher) {
	var topicForms = researcher.getResearch("morphology");
	var text = paper.getText();
	var locale = paper.getLocale();

	var sentences = (0, _getSentences2.default)(text);

	var keywordsFound = {
		count: 0,
		matches: [],
		sentencesWithKeywords: []
	};

	/*
  * Count the amount of key phrase occurrences in the sentences.
  * An occurrence is counted when all keywords of the key phrase are contained within the sentence.
  * Each sentence can contain multiple key phrases
  * (e.g. "The apple potato is an apple and a potato." has two occurrences of the key phrase "apple potato").
  */
	sentences.forEach(function (sentence) {
		var matches = topicForms.keyphraseForms.map(function (keywordForms) {
			return (0, _matchTextWithArray2.default)(sentence, keywordForms, locale);
		});
		var hasAllKeywords = matches.every(function (keywordForm) {
			return keywordForm.count > 0;
		});

		if (hasAllKeywords) {
			var counts = matches.map(function (match) {
				return match.count;
			});
			var foundWords = (0, _lodashEs.flattenDeep)(matches.map(function (match) {
				return match.matches;
			}));
			keywordsFound.count += Math.min.apply(Math, _toConsumableArray(counts));
			keywordsFound.matches.push(foundWords);
			keywordsFound.sentencesWithKeywords.push(sentence);
		}
	});

	var matches = (0, _lodashEs.uniq)((0, _lodashEs.flattenDeep)(keywordsFound.matches)).sort(function (a, b) {
		return b.length - a.length;
	});

	return {
		count: keywordsFound.count,
		matches: matches,
		markings: (0, _markWordsInSentences.markWordsInSentences)(matches, keywordsFound.sentencesWithKeywords, locale),
		length: topicForms.keyphraseForms.length
	};
};

var _matchTextWithArray = require("../stringProcessing/matchTextWithArray");

var _matchTextWithArray2 = _interopRequireDefault(_matchTextWithArray);

var _lodashEs = require("lodash");

var _getSentences = require("../stringProcessing/getSentences");

var _getSentences2 = _interopRequireDefault(_getSentences);

var _markWordsInSentences = require("../stringProcessing/markWordsInSentences");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /** @module analyses/getKeywordCount */

/**
 * Calculates the keyword count, takes morphology into account.
 *
 * @param {object} paper The paper containing keyword and text.
 * @param {object} researcher The researcher
 * @returns {number} The keyword count.
 */
//# sourceMappingURL=keywordCount.js.map
