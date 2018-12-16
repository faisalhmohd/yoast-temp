"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isWordInSentence = exports.characterInBoundary = undefined;

var _wordBoundaries = require("../config/wordBoundaries.js");

var _wordBoundaries2 = _interopRequireDefault(_wordBoundaries);

var _lodashEs = require("lodash");

var _addWordboundary = require("./addWordboundary.js");

var _addWordboundary2 = _interopRequireDefault(_addWordboundary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wordBoundaries = (0, _wordBoundaries2.default)();


/**
 * Checks whether a character is present in the list of word boundaries.
 *
 * @param {string} character The character to look for.
 * @returns {boolean} Whether or not the character is present in the list of word boundaries.
 */
var characterInBoundary = function characterInBoundary(character) {
	return (0, _lodashEs.includes)(wordBoundaries, character);
};

/**
 * Checks whether a word is present in a sentence.
 *
 * @param {string} word The word to search for in the sentence.
 * @param {string} sentence The sentence to look through.
 * @returns {boolean} Whether or not the word is present in the sentence.
 */
var isWordInSentence = function isWordInSentence(word, sentence) {
	// To ensure proper matching, make everything lowercase.
	word = word.toLocaleLowerCase();
	sentence = sentence.toLocaleLowerCase();

	// Escape regex in word, since we use regex characters like in abbreviations ("e.g.").
	var wordWithBoundaries = (0, _addWordboundary2.default)((0, _lodashEs.escapeRegExp)(word));
	var occurrenceStart = sentence.search(new RegExp(wordWithBoundaries, "ig"));
	// Return false if no match has been found.
	if (occurrenceStart === -1) {
		return false;
	}
	/*
 If there is a word boundary before the matched word, the regex includes this word boundary in the match.
 This means that occurrenceStart is the index of the word boundary before the match. Therefore 1 has to
 be added to occurrenceStart, except when there is no word boundary before the match (i.e. at the start
 of a sentence).
  */
	if (occurrenceStart > 0) {
		occurrenceStart += 1;
	}
	var occurrenceEnd = occurrenceStart + word.length;

	// Check if the previous and next character are word boundaries to determine if a complete word was detected
	var previousCharacter = characterInBoundary(sentence[occurrenceStart - 1]) || occurrenceStart === 0;
	var nextCharacter = characterInBoundary(sentence[occurrenceEnd]) || occurrenceEnd === sentence.length;

	return previousCharacter && nextCharacter;
};

exports.characterInBoundary = characterInBoundary;
exports.isWordInSentence = isWordInSentence;
exports.default = {
	characterInBoundary: characterInBoundary,
	isWordInSentence: isWordInSentence
};
//# sourceMappingURL=matchWordInSentence.js.map
