"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.research = exports.collectForms = exports.buildForms = exports.filterFunctionWords = undefined;

var _getFormsForLanguage = require("../helpers/getFormsForLanguage.js");

var _getFormsForLanguage2 = _interopRequireDefault(_getFormsForLanguage);

var _getWords = require("../stringProcessing/getWords.js");

var _getWords2 = _interopRequireDefault(_getWords);

var _getLanguage = require("../helpers/getLanguage.js");

var _getLanguage2 = _interopRequireDefault(_getLanguage);

var _getFunctionWords = require("../helpers/getFunctionWords.js");

var _getFunctionWords2 = _interopRequireDefault(_getFunctionWords);

var _parseSynonyms = require("../stringProcessing/parseSynonyms");

var _parseSynonyms2 = _interopRequireDefault(_parseSynonyms);

var _getVariationsApostrophe = require("../stringProcessing/getVariationsApostrophe");

var _lodashEs = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getFormsForLanguage = (0, _getFormsForLanguage2.default)();

var getFunctionWords = (0, _getFunctionWords2.default)();


/**
 * Filters function words from an array of words based on the language.
 *
 * @param {Array} array The words to check.
 * @param {string} language The language to take function words for.
 *
 * @returns {Array} The original array with the function words filtered out.
 */
var filterFunctionWords = function filterFunctionWords(array, language) {
	if ((0, _lodashEs.isUndefined)(language) || language === "") {
		language = "en";
	}

	var functionWords = (0, _lodashEs.get)(getFunctionWords, [language], []);

	if (array.length > 1) {
		var arrayFiltered = (0, _lodashEs.filter)(array, function (word) {
			return !(0, _lodashEs.includes)(functionWords.all, word.trim().toLocaleLowerCase());
		});

		if (arrayFiltered.length > 0) {
			return arrayFiltered;
		}
	}

	return array;
};

/**
 * Analyzes the focus keyword string. Checks if morphology is requested or if the user wants to match exact string.
 * If morphology is required the module builds all word forms for all words (if no function words list available) or
 * for all content words (i.e., excluding prepositions, articles, conjunctions, if the function words list is available).
 *
 * @param {string} keyphrase The keyphrase of the paper (or a synonym phrase) to get forms for.
 * @param {string} language The language to use for morphological analyzer and for function words.
 * @param {Object} morphologyData The available morphology data per language (false if unavailable).
 *
 * @returns {Array} Array of all forms to be searched for keyword-based assessments.
 */
var buildForms = function buildForms(keyphrase, language, morphologyData) {
	if ((0, _lodashEs.isUndefined)(keyphrase) || keyphrase === "") {
		return [];
	}

	/*
  * If the keyphrase is embedded in double quotation marks, return keyword itself, without outer-most quotation marks.
  * Additionally, provide apostrophe variations.
  */

	var doubleQuotes = ["“", "”", "〝", "〞", "〟", "‟", "„", "\""];
	if ((0, _lodashEs.includes)(doubleQuotes, keyphrase[0]) && (0, _lodashEs.includes)(doubleQuotes, keyphrase[keyphrase.length - 1])) {
		keyphrase = keyphrase.substring(1, keyphrase.length - 1);
		return [(0, _lodashEs.uniq)([].concat((0, _lodashEs.escapeRegExp)(keyphrase), (0, _getVariationsApostrophe.getVariationsApostrophe)(keyphrase)))];
	}

	var words = filterFunctionWords((0, _getWords2.default)(keyphrase), language);

	var forms = [];

	var getForms = getFormsForLanguage[language];
	/*
  * Only returns the keyword and the keyword with apostrophe variations if morphological forms cannot be built.
  * Otherwise additionally returns the morphological forms.
  */
	if (morphologyData === false || (0, _lodashEs.isUndefined)(getForms)) {
		words.forEach(function (word) {
			var wordToLowerCase = (0, _lodashEs.escapeRegExp)(word.toLocaleLowerCase(language));

			forms.push((0, _lodashEs.uniq)([].concat(wordToLowerCase, (0, _getVariationsApostrophe.getVariationsApostrophe)(wordToLowerCase))));
		});
	} else {
		words.forEach(function (word) {
			var wordToLowerCase = (0, _lodashEs.escapeRegExp)(word.toLocaleLowerCase());
			var formsOfThisWord = getForms(wordToLowerCase, morphologyData);
			var variationsApostrophes = (0, _getVariationsApostrophe.getVariationsApostropheInArray)(formsOfThisWord);
			forms.push((0, _lodashEs.uniq)((0, _lodashEs.flatten)(formsOfThisWord.concat(variationsApostrophes))).filter(Boolean));
		});
	}

	return forms;
};

/**
 * Builds morphological forms of words of the keyphrase and of each synonym phrase.
 *
 * @param {string} keyphrase The paper's keyphrase.
 * @param {string} synonyms The paper's synonyms.
 * @param {string} language The paper's language.
 * @param {Object} morphologyData The available morphology data to be used by the getForms function (language specific).
 *
 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms.
 */
var collectKeyphraseAndSynonymsForms = function collectKeyphraseAndSynonymsForms(keyphrase, synonyms) {
	var language = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "en";
	var morphologyData = arguments[3];

	var synonymsSplit = (0, _parseSynonyms2.default)(synonyms);

	var keyphraseForms = buildForms(keyphrase, language, morphologyData);
	var synonymsForms = synonymsSplit.map(function (synonym) {
		return buildForms(synonym, language, morphologyData);
	});

	return {
		keyphraseForms: keyphraseForms,
		synonymsForms: synonymsForms
	};
};

/**
 * Caches morphological forms depending on the currently available morphologyData and (separately) keyphrase, synonyms,
 * and language. In this way, if the morphologyData remains the same in multiple calls of this function, the function
 * that collects actual morphological forms only needs to check if the keyphrase, synonyms and language also remain the
 * same to return the cached result. The joining of keyphrase, synonyms and language for this function is needed,
 * because by default memoize caches by the first key only, which in the current case would mean that the function would
 * return the cached forms if the keyphrase has not changed (without checking if synonyms and language were changed).
 *
 * @param {Object|boolean} morphologyData The available morphology data.
 *
 * @returns {function} The function that collects the forms for a given set of keyphrase, synonyms, language and
 * morphologyData.
 */
var primeMorphologyData = (0, _lodashEs.memoize)(function (morphologyData) {
	return (0, _lodashEs.memoize)(function (keyphrase, synonyms) {
		var language = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "en";

		return collectKeyphraseAndSynonymsForms(keyphrase, synonyms, language, morphologyData);
	}, function (keyphrase, synonyms, language) {
		return keyphrase + "," + synonyms + "," + language;
	});
});

/**
 * Retrieves morphological forms of words of the keyphrase and of each synonym phrase using the function that caches
 * the results of previous calls of this function.
 *
 * @param {string} keyphrase The paper's keyphrase.
 * @param {string} synonyms The paper's synonyms.
 * @param {string} language The paper's language.
 * @param {Object} morphologyData The available morphology data to be used by the getForms function (language specific).
 *
 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms.
 */
function collectForms(keyphrase, synonyms) {
	var language = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "en";
	var morphologyData = arguments[3];

	var collectFormsWithMorphologyData = primeMorphologyData(morphologyData);

	return collectFormsWithMorphologyData(keyphrase, synonyms, language);
}

/**
 * Calls the function that builds keyphrase and synonyms forms for a specific research data.
 *
 * @param {Paper} paper The paper to build keyphrase and synonym forms for.
 * @param {Researcher} researcher The researcher prototype.
 *
 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms.
 */
function research(paper, researcher) {
	var language = (0, _getLanguage2.default)(paper.getLocale());

	var morphologyData = (0, _lodashEs.get)(researcher.getData("morphology"), [language], false);

	return collectForms(paper.getKeyword(), paper.getSynonyms(), language, morphologyData);
}

exports.filterFunctionWords = filterFunctionWords;
exports.buildForms = buildForms;
exports.collectForms = collectForms;
exports.research = research;
//# sourceMappingURL=buildKeywordForms.js.map
