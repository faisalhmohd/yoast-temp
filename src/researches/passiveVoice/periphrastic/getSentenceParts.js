"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (sentence, language) {
	return getSentenceParts(sentence, language);
};

var _indices = require("../../../stringProcessing/indices");

var _indices2 = _interopRequireDefault(_indices);

var _stripSpaces = require("../../../stringProcessing/stripSpaces.js");

var _stripSpaces2 = _interopRequireDefault(_stripSpaces);

var _quotes = require("../../../stringProcessing/quotes.js");

var _createRegexFromArray = require("../../../stringProcessing/createRegexFromArray.js");

var _createRegexFromArray2 = _interopRequireDefault(_createRegexFromArray);

var _getIndicesWithRegex = require("./getIndicesWithRegex.js");

var _getIndicesWithRegex2 = _interopRequireDefault(_getIndicesWithRegex);

var _includesIndex = require("../../../stringProcessing/includesIndex");

var _includesIndex2 = _interopRequireDefault(_includesIndex);

var _followsIndex = require("../../../stringProcessing/followsIndex");

var _followsIndex2 = _interopRequireDefault(_followsIndex);

var _lodashEs = require("lodash");

var _SentencePart = require("../../english/passiveVoice/SentencePart");

var _SentencePart2 = _interopRequireDefault(_SentencePart);

var _auxiliaries = require("../../english/passiveVoice/auxiliaries.js");

var _auxiliaries2 = _interopRequireDefault(_auxiliaries);

var _stopwords = require("../../english/passiveVoice/stopwords.js");

var _stopwords2 = _interopRequireDefault(_stopwords);

var _SentencePart3 = require("../../french/passiveVoice/SentencePart");

var _SentencePart4 = _interopRequireDefault(_SentencePart3);

var _auxiliaries3 = require("../../french/passiveVoice/auxiliaries.js");

var _auxiliaries4 = _interopRequireDefault(_auxiliaries3);

var _stopwords3 = require("../../french/passiveVoice/stopwords.js");

var _stopwords4 = _interopRequireDefault(_stopwords3);

var _SentencePart5 = require("../../spanish/passiveVoice/SentencePart");

var _SentencePart6 = _interopRequireDefault(_SentencePart5);

var _auxiliaries5 = require("../../spanish/passiveVoice/auxiliaries.js");

var _auxiliaries6 = _interopRequireDefault(_auxiliaries5);

var _stopwords5 = require("../../spanish/passiveVoice/stopwords.js");

var _stopwords6 = _interopRequireDefault(_stopwords5);

var _SentencePart7 = require("../../italian/passiveVoice/SentencePart");

var _SentencePart8 = _interopRequireDefault(_SentencePart7);

var _auxiliaries7 = require("../../italian/passiveVoice/auxiliaries.js");

var _auxiliaries8 = _interopRequireDefault(_auxiliaries7);

var _stopwords7 = require("../../italian/passiveVoice/stopwords.js");

var _stopwords8 = _interopRequireDefault(_stopwords7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getIndicesOfList = _indices2.default.getIndicesByWordList;
var filterIndices = _indices2.default.filterIndices;
var sortIndices = _indices2.default.sortIndices;

// English-specific variables and imports.

var auxiliariesEnglish = (0, _auxiliaries2.default)().all;

var stopwordsEnglish = (0, _stopwords2.default)();
var stopCharacterRegexEnglish = /([:,]|('ll)|('ve))(?=[ \n\r\t'"+\-»«‹›<>])/ig;
var verbEndingInIngRegex = /\w+ing(?=$|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig;
var ingExclusionArray = ["king", "cling", "ring", "being", "thing", "something", "anything"];

// French-specific variables and imports.

var auxiliariesFrench = (0, _auxiliaries4.default)();

var stopwordsFrench = (0, _stopwords4.default)();
var stopCharacterRegexFrench = /(,)(?=[ \n\r\t'"+\-»«‹›<>])/ig;
var followingAuxiliaryExceptionWordsFrench = ["le", "la", "les", "une", "l'un", "l'une"];
var reflexivePronounsFrench = ["se", "me", "te", "s'y", "m'y", "t'y", "nous nous", "vous vous"];
var directPrecedenceExceptionRegexFrench = (0, _createRegexFromArray2.default)(reflexivePronounsFrench);
var elisionAuxiliaryExceptionWords = ["c'", "s'", "peut-"];
var elisionAuxiliaryExceptionRegex = (0, _createRegexFromArray2.default)(elisionAuxiliaryExceptionWords, true);

// Spanish-specific variables and imports.

var auxiliariesSpanish = (0, _auxiliaries6.default)();

var stopwordsSpanish = (0, _stopwords6.default)();
var followingAuxiliaryExceptionWordsSpanish = ["el", "la", "los", "las", "una"];

// Italian-specific variables and imports.

var auxiliariesItalian = (0, _auxiliaries8.default)();

var stopwordsItalian = (0, _stopwords8.default)();
var followingAuxiliaryExceptionWordsItalian = ["il", "i", "la", "le", "lo", "gli", "uno", "una"];
var reflexivePronounsItalian = ["mi", "ti", "si", "ci", "vi"];
var directPrecedenceExceptionRegexItalian = (0, _createRegexFromArray2.default)(reflexivePronounsItalian);

/*
 * Variables applying to multiple languages
 * This regex applies to Spanish and Italian
 */
var stopCharacterRegexOthers = /([:,])(?=[ \n\r\t'"+\-»«‹›<>])/ig;

// The language-specific variables used to split sentences into sentence parts.
var languageVariables = {
	en: {
		stopwords: stopwordsEnglish,
		auxiliaryRegex: (0, _createRegexFromArray2.default)(auxiliariesEnglish),
		SentencePart: _SentencePart2.default,
		auxiliaries: auxiliariesEnglish,
		stopCharacterRegex: stopCharacterRegexEnglish
	},
	fr: {
		stopwords: stopwordsFrench,
		auxiliaryRegex: (0, _createRegexFromArray2.default)(auxiliariesFrench),
		SentencePart: _SentencePart4.default,
		auxiliaries: auxiliariesFrench,
		stopCharacterRegex: stopCharacterRegexFrench,
		followingAuxiliaryExceptionRegex: (0, _createRegexFromArray2.default)(followingAuxiliaryExceptionWordsFrench),
		directPrecedenceExceptionRegex: directPrecedenceExceptionRegexFrench
	},
	es: {
		stopwords: stopwordsSpanish,
		auxiliaryRegex: (0, _createRegexFromArray2.default)(auxiliariesSpanish),
		SentencePart: _SentencePart6.default,
		auxiliaries: auxiliariesSpanish,
		stopCharacterRegex: stopCharacterRegexOthers,
		followingAuxiliaryExceptionRegex: (0, _createRegexFromArray2.default)(followingAuxiliaryExceptionWordsSpanish)
	},
	it: {
		stopwords: stopwordsItalian,
		auxiliaryRegex: (0, _createRegexFromArray2.default)(auxiliariesItalian),
		SentencePart: _SentencePart8.default,
		auxiliaries: auxiliariesItalian,
		stopCharacterRegex: stopCharacterRegexOthers,
		followingAuxiliaryExceptionRegex: (0, _createRegexFromArray2.default)(followingAuxiliaryExceptionWordsItalian),
		directPrecedenceExceptionRegex: directPrecedenceExceptionRegexItalian
	}
};

/**
 * Gets active verbs (ending in ing) to determine sentence breakers in English.
 *
 * @param {string} sentence The sentence to get the active verbs to.
 * @returns {Array} The array with valid matches.
 */
var getVerbsEndingInIng = function getVerbsEndingInIng(sentence) {
	// Matches the sentences with words ending in ing.
	var matches = sentence.match(verbEndingInIngRegex) || [];
	// Filters out words ending in -ing that aren't verbs.
	return (0, _lodashEs.filter)(matches, function (match) {
		return !(0, _lodashEs.includes)(ingExclusionArray, (0, _stripSpaces2.default)(match));
	});
};

/**
 * Gets stop characters to determine sentence breakers.
 *
 * @param {string} sentence The sentence to get the stop characters to.
 * @param {string} language The language for which to get the stop characters.
 * @returns {Array} The array with stop characters.
 */
var getStopCharacters = function getStopCharacters(sentence, language) {
	var stopCharacterRegex = languageVariables[language].stopCharacterRegex;
	var match = void 0;
	var matches = [];

	stopCharacterRegex.lastIndex = 0;

	while ((match = stopCharacterRegex.exec(sentence)) !== null) {
		matches.push({
			index: match.index,
			match: match[0]
		});
	}
	return matches;
};

/**
 * Filters auxiliaries preceded by a reflexive pronoun.
 *
 * @param {string} text The text part in which to check.
 * @param {Array} auxiliaryMatches The auxiliary matches for which to check.
 * @param {string} language The language for which to check auxiliary precedence exceptions.
 *
 * @returns {Array} The filtered list of auxiliary indices.
 */
var auxiliaryPrecedenceExceptionFilter = function auxiliaryPrecedenceExceptionFilter(text, auxiliaryMatches, language) {
	var directPrecedenceExceptionMatches = (0, _getIndicesWithRegex2.default)(text, languageVariables[language].directPrecedenceExceptionRegex);

	(0, _lodashEs.forEach)(auxiliaryMatches, function (auxiliaryMatch) {
		if ((0, _includesIndex2.default)(directPrecedenceExceptionMatches, auxiliaryMatch.index)) {
			auxiliaryMatches = auxiliaryMatches.filter(function (auxiliaryObject) {
				return auxiliaryObject.index !== auxiliaryMatch.index;
			});
		}
	});

	return auxiliaryMatches;
};

/**
 * Filters auxiliaries followed by a word on the followingAuxiliaryExceptionWords list.
 *
 * @param {string} text The text part in which to check.
 * @param {Array} auxiliaryMatches The auxiliary matches for which to check.
 * @param {string} language The language for which to filter the auxiliaries.
 * @returns {Array} The filtered list of auxiliary indices.
 */
var followingAuxiliaryExceptionFilter = function followingAuxiliaryExceptionFilter(text, auxiliaryMatches, language) {
	var followingAuxiliaryExceptionRegex = languageVariables[language].followingAuxiliaryExceptionRegex;
	var followingAuxiliaryExceptionMatches = (0, _getIndicesWithRegex2.default)(text, followingAuxiliaryExceptionRegex);

	(0, _lodashEs.forEach)(auxiliaryMatches, function (auxiliaryMatch) {
		if ((0, _followsIndex2.default)(followingAuxiliaryExceptionMatches, auxiliaryMatch)) {
			auxiliaryMatches = auxiliaryMatches.filter(function (auxiliaryObject) {
				return auxiliaryObject.index !== auxiliaryMatch.index;
			});
		}
	});

	return auxiliaryMatches;
};

/**
 * Filters auxiliaries preceded by an elided word (e.g., s') on the elisionAuxiliaryExceptionWords list.
 *
 * @param {string} text The text part in which to check.
 * @param {Array} auxiliaryMatches The auxiliary matches for which to check.
 * @returns {Array} The filtered list of auxiliary indices.
 */
var elisionAuxiliaryExceptionFilter = function elisionAuxiliaryExceptionFilter(text, auxiliaryMatches) {
	var elisionAuxiliaryExceptionMatches = (0, _getIndicesWithRegex2.default)(text, elisionAuxiliaryExceptionRegex);

	(0, _lodashEs.forEach)(auxiliaryMatches, function (auxiliaryMatch) {
		if ((0, _includesIndex2.default)(elisionAuxiliaryExceptionMatches, auxiliaryMatch.index, false)) {
			auxiliaryMatches = auxiliaryMatches.filter(function (auxiliaryObject) {
				return auxiliaryObject.index !== auxiliaryMatch.index;
			});
		}
	});

	return auxiliaryMatches;
};

/**
 * Gets the indexes of sentence breakers (auxiliaries, stopwords and stop characters;
 * in English also active verbs) to determine sentence parts.
 * Indices are filtered because there could be duplicate matches, like "even though" and "though".
 * In addition, 'having' will be matched both as a -ing verb as well as an auxiliary.
 *
 * @param {string} sentence The sentence to check for indices of sentence breakers.
 * @param {string} language The language for which to match the sentence breakers.
 * @returns {Array} The array with valid indices to use for determining sentence parts.
 */
var getSentenceBreakers = function getSentenceBreakers(sentence, language) {
	sentence = sentence.toLocaleLowerCase();
	var stopwords = languageVariables[language].stopwords;
	var auxiliaries = languageVariables[language].auxiliaries;
	var auxiliaryIndices = getIndicesOfList(auxiliaries, sentence);
	var stopwordIndices = getIndicesOfList(stopwords, sentence);
	var stopCharacterIndices = getStopCharacters(sentence, language);
	var indices = void 0;

	// Concat all indices arrays, filter them and sort them.
	switch (language) {
		case "fr":
			// Filters auxiliaries matched in the sentence based on a precedence exception filter.
			auxiliaryIndices = auxiliaryPrecedenceExceptionFilter(sentence, auxiliaryIndices, "fr");
			// Filters auxiliaries matched in the sentence based on a elision exception filter.
			auxiliaryIndices = elisionAuxiliaryExceptionFilter(sentence, auxiliaryIndices);

			indices = [].concat(auxiliaryIndices, stopwordIndices, stopCharacterIndices);
			break;
		case "es":
			indices = [].concat(auxiliaryIndices, stopwordIndices, stopCharacterIndices);
			break;
		case "it":
			// Filters auxiliaries matched in the sentence based on a precedence exception filter.
			auxiliaryIndices = auxiliaryPrecedenceExceptionFilter(sentence, auxiliaryIndices, "it");
			indices = [].concat(auxiliaryIndices, stopwordIndices, stopCharacterIndices);
			break;
		case "en":
		default:
			var ingVerbs = getVerbsEndingInIng(sentence);
			var ingVerbsIndices = getIndicesOfList(ingVerbs, sentence);
			indices = [].concat(auxiliaryIndices, stopwordIndices, ingVerbsIndices, stopCharacterIndices);
			break;
	}
	indices = filterIndices(indices);
	return sortIndices(indices);
};

/**
 * Gets the auxiliaries to a sentence.
 *
 * @param {string} sentencePart The part of the sentence to match for auxiliaries.
 * @param {string} language The language for which to match the auxiliaries.
 * @returns {Array} All formatted matches to the sentence part.
 */
var getAuxiliaryMatches = function getAuxiliaryMatches(sentencePart, language) {
	var auxiliaryRegex = languageVariables[language].auxiliaryRegex;
	var auxiliaryMatches = sentencePart.match(auxiliaryRegex) || [];

	switch (language) {
		case "fr":
		case "es":
		case "it":
			// An array with the matched auxiliaries and their indices.
			var auxiliaryMatchIndices = getIndicesOfList(auxiliaryMatches, sentencePart);

			if (language === "fr" || language === "it") {
				// Filters auxiliaries matched in the sentence part based on a precedence exception filter.
				auxiliaryMatchIndices = auxiliaryPrecedenceExceptionFilter(sentencePart, auxiliaryMatchIndices, language);
			}
			// Filters auxiliaries matched in the sentence part based on a exception filter for words following the auxiliary.
			auxiliaryMatchIndices = followingAuxiliaryExceptionFilter(sentencePart, auxiliaryMatchIndices, language);

			// An array with the matched auxiliary verbs (without indices).
			var auxiliaryMatchWords = [];

			(0, _lodashEs.forEach)(auxiliaryMatchIndices, function (auxiliaryMatchIndex) {
				auxiliaryMatchWords.push(auxiliaryMatchIndex.match);
			});

			return (0, _lodashEs.map)(auxiliaryMatchWords, function (auxiliaryMatch) {
				return (0, _stripSpaces2.default)(auxiliaryMatch);
			});
		case "en":
		default:
			return (0, _lodashEs.map)(auxiliaryMatches, function (auxiliaryMatch) {
				return (0, _stripSpaces2.default)(auxiliaryMatch);
			});
	}
};

/**
 * Gets the sentence parts to a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in sentence parts.
 * @param {string} language The language for which to get the sentence parts.
 * @returns {Array} The array with all parts of a sentence that have an auxiliary.
 */
var getSentenceParts = function getSentenceParts(sentence, language) {
	var sentenceParts = [];
	var auxiliaryRegex = languageVariables[language].auxiliaryRegex;
	var SentencePart = languageVariables[language].SentencePart;

	sentence = (0, _quotes.normalizeSingle)(sentence);

	// First check if there is an auxiliary in the sentence.
	if (sentence.match(auxiliaryRegex) === null) {
		return sentenceParts;
	}

	var indices = getSentenceBreakers(sentence, language);
	// Get the words after the found auxiliary.
	for (var i = 0; i < indices.length; i++) {
		var endIndex = sentence.length;
		if (!(0, _lodashEs.isUndefined)(indices[i + 1])) {
			endIndex = indices[i + 1].index;
		}

		// Cut the sentence to the current index to the endIndex (start of next breaker, of end of sentence).
		var sentencePart = (0, _stripSpaces2.default)(sentence.substr(indices[i].index, endIndex - indices[i].index));

		var auxiliaryMatches = getAuxiliaryMatches(sentencePart, language);
		// If a sentence part doesn't have an auxiliary, we don't need it, so it can be filtered out.
		if (auxiliaryMatches.length !== 0) {
			sentenceParts.push(new SentencePart(sentencePart, auxiliaryMatches));
		}
	}
	return sentenceParts;
};

/**
 * Split the sentence in sentence parts based on auxiliaries.
 *
 * @param {string} sentence The sentence to split in parts.
 * @param {string} language The language for which to get the sentence parts.
 * @returns {Array} A list with sentence parts.
 */
//# sourceMappingURL=getSentenceParts.js.map
