"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (text, wordToMatch, locale, extraBoundary) {
	text = (0, _stripNonTextTags2.default)(text);
	text = (0, _unifyWhitespace.unifyAllSpaces)(text);
	text = (0, _quotes.normalize)(text);
	wordToMatch = (0, _stripSpaces2.default)((0, _quotes.normalize)(wordToMatch));

	var matches = (0, _matchTextWithTransliteration2.default)(text, wordToMatch, locale, extraBoundary);
	matches = (0, _lodashEs.map)(matches, function (keyword) {
		return (0, _stripSpaces2.default)((0, _removePunctuation2.default)(keyword));
	});

	// Create an array of positions of matches to determine where in the text the wordToMatch occurred first.
	var positions = (0, _lodashEs.map)(matches, function (keyword) {
		return text.indexOf(keyword);
	});

	return {
		count: matches.length,
		matches: matches,
		position: Math.min.apply(Math, _toConsumableArray(positions))
	};
};

var _stripNonTextTags = require("../stringProcessing/stripNonTextTags.js");

var _stripNonTextTags2 = _interopRequireDefault(_stripNonTextTags);

var _stripSpaces = require("../stringProcessing/stripSpaces.js");

var _stripSpaces2 = _interopRequireDefault(_stripSpaces);

var _removePunctuation = require("../stringProcessing/removePunctuation.js");

var _removePunctuation2 = _interopRequireDefault(_removePunctuation);

var _unifyWhitespace = require("../stringProcessing/unifyWhitespace.js");

var _matchTextWithTransliteration = require("../stringProcessing/matchTextWithTransliteration.js");

var _matchTextWithTransliteration2 = _interopRequireDefault(_matchTextWithTransliteration);

var _quotes = require("../stringProcessing/quotes.js");

var _lodashEs = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /** @module stringProcessing/matchTextWithWord */

/**
 * Returns the number of matches in a given string
 *
 * @param {string} text The text to use for matching the wordToMatch.
 * @param {string} wordToMatch The word to match in the text
 * @param {string} locale The locale used for transliteration.
 * @param {string} [extraBoundary] An extra string that can be added to the wordboundary regex
 * @returns {Object} The matches found and the number of matches.
 */
//# sourceMappingURL=matchTextWithWord.js.map
