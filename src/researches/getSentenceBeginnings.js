"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (paper, researcher) {
	var sentences = researcher.getResearch("sentences");
	var firstWordExceptions = (0, _getFirstWordExceptions2.default)(paper.getLocale())();

	var sentenceBeginnings = sentences.map(function (sentence) {
		return getSentenceBeginning(sentence, firstWordExceptions);
	});

	sentences = sentences.filter(function (sentence) {
		return (0, _getWords2.default)((0, _stripSpaces2.default)(sentence)).length > 0;
	});
	sentenceBeginnings = (0, _lodashEs.filter)(sentenceBeginnings);

	return compareFirstWords(sentenceBeginnings, sentences);
};

var _getWords = require("../stringProcessing/getWords.js");

var _getWords2 = _interopRequireDefault(_getWords);

var _stripSpaces = require("../stringProcessing/stripSpaces.js");

var _stripSpaces2 = _interopRequireDefault(_stripSpaces);

var _getFirstWordExceptions = require("../helpers/getFirstWordExceptions.js");

var _getFirstWordExceptions2 = _interopRequireDefault(_getFirstWordExceptions);

var _stripHTMLTags = require("../stringProcessing/stripHTMLTags.js");

var _lodashEs = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Compares the first word of each sentence with the first word of the following sentence.
 *
 * @param {string} currentSentenceBeginning The first word of the current sentence.
 * @param {string} nextSentenceBeginning The first word of the next sentence.
 * @returns {boolean} Returns true if sentence beginnings match.
 */
var startsWithSameWord = function startsWithSameWord(currentSentenceBeginning, nextSentenceBeginning) {
	if (!(0, _lodashEs.isEmpty)(currentSentenceBeginning) && currentSentenceBeginning === nextSentenceBeginning) {
		return true;
	}

	return false;
};

/**
 * Counts the number of similar sentence beginnings.
 *
 * @param {Array} sentenceBeginnings The array containing the first word of each sentence.
 * @param {Array} sentences The array containing all sentences.
 * @returns {Array} The array containing the objects containing the first words and the corresponding counts.
 */
var compareFirstWords = function compareFirstWords(sentenceBeginnings, sentences) {
	var consecutiveFirstWords = [];
	var foundSentences = [];
	var sameBeginnings = 1;

	(0, _lodashEs.forEach)(sentenceBeginnings, function (beginning, i) {
		var currentSentenceBeginning = beginning;
		var nextSentenceBeginning = sentenceBeginnings[i + 1];
		foundSentences.push(sentences[i]);

		if (startsWithSameWord(currentSentenceBeginning, nextSentenceBeginning)) {
			sameBeginnings++;
		} else {
			consecutiveFirstWords.push({ word: currentSentenceBeginning, count: sameBeginnings, sentences: foundSentences });
			sameBeginnings = 1;
			foundSentences = [];
		}
	});

	return consecutiveFirstWords;
};

/**
 * Retrieves the first word to the sentence.
 *
 * @param {string} sentence The sentence to retrieve the first word to.
 * @param {Array} firstWordExceptions Exceptions to match against.
 * @returns {string} The first word of the sentence.
 */
function getSentenceBeginning(sentence, firstWordExceptions) {
	var words = (0, _getWords2.default)((0, _stripHTMLTags.stripFullTags)((0, _stripSpaces2.default)(sentence)));

	if (words.length === 0) {
		return "";
	}

	var firstWord = words[0].toLocaleLowerCase();

	if (firstWordExceptions.indexOf(firstWord) > -1 && words.length > 1) {
		firstWord += " " + words[1];
	}

	return firstWord;
}

/**
 * Gets the first word of each sentence to the text, and returns an object containing the first word of each sentence and the corresponding counts.
 *
 * @param {Paper} paper The Paper object to get the text to.
 * @param {Researcher} researcher The researcher this research is a part of.
 * @returns {Object} The object containing the first word of each sentence and the corresponding counts.
 */
//# sourceMappingURL=getSentenceBeginnings.js.map
