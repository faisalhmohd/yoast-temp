"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (paper, researcher) {
	var description = paper.getDescription();
	var locale = paper.getLocale();

	var topicForms = researcher.getResearch("morphology");

	var sentences = (0, _getSentences2.default)(description);

	var sentenceMatches = sentences.map(function (sentence) {
		return matchPerSentence(sentence, topicForms, locale);
	});

	return sentenceMatches.reduce(function (sum, count) {
		return sum + count;
	}, 0);
};

var _matchTextWithArray = require("../stringProcessing/matchTextWithArray");

var _matchTextWithArray2 = _interopRequireDefault(_matchTextWithArray);

var _getSentences = require("../stringProcessing/getSentences");

var _getSentences2 = _interopRequireDefault(_getSentences);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Replaces found keyword forms in the given description.
 *
 * @param {string} description the description to remove the matched keyword forms from.
 * @param {Object[]} matchedKeywordForms the matched keyword forms to remove from the description.
 * @param {Number} maxToRemove the maximum amount of matches of each individual keyword to remove.
 * @returns {string} the description with the keywords removed.
 */
var replaceFoundKeywordForms = function replaceFoundKeywordForms(description, matchedKeywordForms, maxToRemove) {
	// Replace matches so we do not match them for synonyms.
	matchedKeywordForms.forEach(function (keywordForm) {
		return keywordForm.matches.slice(0, maxToRemove).forEach(function (match) {
			description = description.replace(match, "");
		});
	});
	return description;
};

/**
 * Counts the number of full keyphrase matches in the given sentence. Takes synonyms into account.
 *
 * A full keyphrase is when all keywords in the keyphrase match.
 *
 * @param {string} sentence the sentence that needs to be analyzed.
 * @param {Object} topicForms the keyphrase (and its optional synonyms') word forms.
 * @param {string} locale the current locale
 * @returns {Number} the number of matched keyphrases in the sentence.
 */
var matchPerSentence = function matchPerSentence(sentence, topicForms, locale) {
	// Focus keyphrase matches.
	var matchesKeyphrase = topicForms.keyphraseForms.map(function (keywordForms) {
		return (0, _matchTextWithArray2.default)(sentence, keywordForms, locale);
	});

	// Count the number of matches that contain every word in the entire keyphrase.
	var fullKeyphraseMatches = Math.min.apply(Math, _toConsumableArray(matchesKeyphrase.map(function (match) {
		return match.count;
	})));

	// Replace all full keyphrase matches so we do not match them for synonyms.
	sentence = replaceFoundKeywordForms(sentence, matchesKeyphrase, fullKeyphraseMatches);

	// Keyphrase synonyms matches.
	var fullSynonymsMatches = topicForms.synonymsForms.map(function (synonymForms) {
		// Synonym keyphrase matches.
		var matches = synonymForms.map(function (keywordForms) {
			return (0, _matchTextWithArray2.default)(sentence, keywordForms, locale);
		});
		// Count the number of matches that contain every word in the entire synonym keyphrase.
		var fullSynonymMatches = Math.min.apply(Math, _toConsumableArray(matches.map(function (match) {
			return match.count;
		})));
		// Replace all full matches so we do not match them for other synonyms.
		sentence = replaceFoundKeywordForms(sentence, matchesKeyphrase, fullSynonymMatches);
		return fullSynonymMatches;
	});

	return [fullKeyphraseMatches].concat(_toConsumableArray(fullSynonymsMatches)).reduce(function (sum, count) {
		return sum + count;
	}, 0);
};

/**
 * Counts the number of full keyphrase matches in the description.
 * Returns -1 if no description is specified in the given paper.
 *
 * @param {Paper} paper The paper object containing the description.
 * @param {Researcher} researcher the researcher object to gather researchers from.
 * @returns {Number} The number of keyphrase matches for the entire description.
 */
//# sourceMappingURL=metaDescriptionKeyword.js.map
