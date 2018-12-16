"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (text, keyword, locale) {
	var keywordRegex = toRegex(keyword);

	if (locale === "tr_TR") {
		var turkishMappings = (0, _specialCharacterMappings.replaceTurkishIsMemoized)(keyword);
		keywordRegex = new RegExp(turkishMappings.map(function (x) {
			return (0, _addWordboundary2.default)(x);
		}).join("|"), "ig");
	}
	var matches = text.match(keywordRegex) || [];

	text = text.replace(keywordRegex, "");

	var transliterateKeyword = (0, _transliterate2.default)(keyword, locale);
	var transliterateKeywordRegex = toRegex(transliterateKeyword);
	var transliterateMatches = text.match(transliterateKeywordRegex) || [];
	var combinedArray = matches.concat(transliterateMatches);

	var transliterateWPKeyword = (0, _transliterateWPstyle2.default)(keyword, locale);

	if (!(transliterateWPKeyword === transliterateKeyword)) {
		var transliterateWPKeywordRegex = toRegex(transliterateWPKeyword);
		var transliterateWPMatches = text.match(transliterateWPKeywordRegex) || [];

		combinedArray = combinedArray.concat(transliterateWPMatches);
	}

	return (0, _lodashEs.map)(combinedArray, function (keyword) {
		return (0, _stripSpaces2.default)(keyword);
	});
};

var _lodashEs = require("lodash");

var _addWordboundary = require("./addWordboundary.js");

var _addWordboundary2 = _interopRequireDefault(_addWordboundary);

var _stripSpaces = require("./stripSpaces.js");

var _stripSpaces2 = _interopRequireDefault(_stripSpaces);

var _transliterate = require("./transliterate.js");

var _transliterate2 = _interopRequireDefault(_transliterate);

var _transliterateWPstyle = require("./transliterateWPstyle.js");

var _transliterateWPstyle2 = _interopRequireDefault(_transliterateWPstyle);

var _specialCharacterMappings = require("./specialCharacterMappings");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a regex from the keyword with included wordboundaries.
 * @param {string} keyword The keyword to create a regex from.
 * @returns {RegExp} Regular expression of the keyword with wordboundaries.
 */
var toRegex = function toRegex(keyword) {
	keyword = (0, _addWordboundary2.default)(keyword);
	return new RegExp(keyword, "ig");
};

/**
 * Matches a string with and without transliteration.
 * @param {string} text The text to match.
 * @param {string} keyword The keyword to match in the text.
 * @param {string} locale The locale used for transliteration.
 * @returns {Array} All matches from the original as the transliterated text and keyword.
 */
//# sourceMappingURL=matchTextWithTransliteration.js.map
