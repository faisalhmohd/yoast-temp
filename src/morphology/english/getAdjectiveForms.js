"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getBase = exports.getAdjectiveForms = undefined;

var _count = require("../../stringProcessing/syllables/count");

var _count2 = _interopRequireDefault(_count);

var _createRulesFromMorphologyData = require("../morphoHelpers/createRulesFromMorphologyData.js");

var _createRulesFromMorphologyData2 = _interopRequireDefault(_createRulesFromMorphologyData);

var _buildFormRule = require("../morphoHelpers/buildFormRule");

var _lodashEs = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks if the input word occurs in the list of irregular adjectives and if so returns all its irregular forms.
 *
 * @param {string} word The word for which to determine its irregular forms.
 * @param {Array} irregularAdjectives The list of irregular adjectives.
 *
 * @returns {Array} Array of word forms from the exception list.
 */
// "use strict";
var checkIrregulars = function checkIrregulars(word, irregularAdjectives) {
	var irregulars = void 0;

	irregularAdjectives.forEach(function (paradigm) {
		paradigm.forEach(function (wordInParadigm) {
			if (wordInParadigm === word) {
				irregulars = paradigm;
			}
		});
	});
	return irregulars;
};

/**
 * Checks if the input word is longer than 2 syllables (in this case comparative and superlative forms do not need to be formed).
 *
 * @param {string} word The word for which to determine its length.
 *
 * @returns {boolean} True if the input word is longer than 2 syllables.
 */
var checkWordTooLong = function checkWordTooLong(word) {
	return (0, _count2.default)(word, "en_EN") > 2;
};

/**
 * Checks if the input word ends with "er".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "er".
 */
var endsWithEr = function endsWithEr(word) {
	var wordLength = word.length;
	// Consider only words of four letters or more to be comparatives (otherwise, words like "per" are being treated as comparatives).
	if (wordLength > 3) {
		return word.substring(word.length - 2, word.length) === "er";
	}
	return false;
};

/**
 * Checks if the input word ends with "est".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "est".
 */
var endsWithEst = function endsWithEst(word) {
	var wordLength = word.length;
	// Consider only words of five letters or more to be superlatives (otherwise, words like "test" are being treated as superlatives).
	if (wordLength > 4) {
		return word.substring(word.length - 3, word.length) === "est";
	}
	return false;
};

/**
 * Checks if the input word ends with "ly".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "ly".
 */
var endsWithLy = function endsWithLy(word) {
	var wordLength = word.length;
	// Consider only words of four letters or more to be adjectives (otherwise, words like "lily" are being treated as adjectives).
	if (wordLength > 3) {
		return word.substring(word.length - 2, word.length) === "ly";
	}
	return false;
};

/**
 * Forms the base form from an input word.
 *
 * @param {string} word The word to build the base form for.
 * @param {Array} comparativeToBaseRegex The Array of regex-based rules to bring comparatives to base.
 * @param {Array} superlativeToBaseRegex The Array of regex-based rules to bring superlatives to base.
 * @param {Array} adverbToBaseRegex The Array of regex-based rules to bring adverbs to base.
 *
 * @returns {string} The base form of the input word.
 */
var getBase = function getBase(word, comparativeToBaseRegex, superlativeToBaseRegex, adverbToBaseRegex) {
	if (endsWithEr(word)) {
		return {
			base: (0, _buildFormRule.buildOneFormFromRegex)(word, comparativeToBaseRegex),
			guessedForm: "er"
		};
	}

	if (endsWithEst(word)) {
		return {
			base: (0, _buildFormRule.buildOneFormFromRegex)(word, superlativeToBaseRegex),
			guessedForm: "est"
		};
	}

	if (endsWithLy(word)) {
		return {
			base: (0, _buildFormRule.buildOneFormFromRegex)(word, adverbToBaseRegex),
			guessedForm: "ly"
		};
	}

	return {
		base: word,
		guessedForm: "base"
	};
};

/**
 * Collects all possible verb forms for a given word through checking if it is irregular, base, adverb,
 * adverb ending in -ically, comparative, or superlative.
 *
 * @param {string} word The word for which to determine its forms.
 * @param {Object} adjectiveData The morphologyData available for this language.
 *
 * @returns {Array} Array of word forms.
 */
var getAdjectiveForms = function getAdjectiveForms(word, adjectiveData) {
	var irregular = checkIrregulars(word, adjectiveData.irregularAdjectives);
	if (!(0, _lodashEs.isUndefined)(irregular)) {
		return irregular;
	}

	var forms = [];

	var regexAdjective = adjectiveData.regexAdjective;
	var ically = (0, _buildFormRule.buildTwoFormsFromRegex)(word, (0, _createRulesFromMorphologyData2.default)(regexAdjective.icallyAdverbs));
	if (!(0, _lodashEs.isUndefined)(ically)) {
		return ically.concat(word);
	}

	var comparativeToBaseRegex = (0, _createRulesFromMorphologyData2.default)(regexAdjective.comparativeToBase);
	var superlativeToBaseRegex = (0, _createRulesFromMorphologyData2.default)(regexAdjective.superlativeToBase);
	var adverbToBaseRegex = (0, _createRulesFromMorphologyData2.default)(regexAdjective.adverbToBase);

	var base = getBase(word, comparativeToBaseRegex, superlativeToBaseRegex, adverbToBaseRegex).base;

	if ((0, _lodashEs.isUndefined)(base)) {
		base = word;
	}

	// Const guessedForm = getBase( word ).guessedForm; //Meant to be used to check if the newly built forms are built correctly.
	forms = forms.concat(word);

	forms.push(base);
	forms.push((0, _buildFormRule.buildOneFormFromRegex)(base, (0, _createRulesFromMorphologyData2.default)(regexAdjective.adverb)));

	var noComparativeOrSuperlative = new RegExp(regexAdjective.noComparativeOrSuperlative, "i");
	if (checkWordTooLong(base) === true || noComparativeOrSuperlative.test(base) === true) {
		return (0, _lodashEs.uniq)(forms.filter(Boolean));
	}

	forms.push((0, _buildFormRule.buildOneFormFromRegex)(base, (0, _createRulesFromMorphologyData2.default)(regexAdjective.comparative)));
	forms.push((0, _buildFormRule.buildOneFormFromRegex)(base, (0, _createRulesFromMorphologyData2.default)(regexAdjective.superlative)));

	return (0, _lodashEs.uniq)((0, _lodashEs.flatten)(forms.filter(Boolean)));
};

exports.getAdjectiveForms = getAdjectiveForms;
exports.getBase = getBase;
//# sourceMappingURL=getAdjectiveForms.js.map
