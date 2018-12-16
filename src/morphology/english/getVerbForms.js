"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.normalizePrefixed = exports.getVerbForms = undefined;

var _createRulesFromMorphologyData = require("../morphoHelpers/createRulesFromMorphologyData.js");

var _createRulesFromMorphologyData2 = _interopRequireDefault(_createRulesFromMorphologyData);

var _buildFormRule = require("../morphoHelpers/buildFormRule");

var _lodashEs = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks if the input word has one of the standard verb prefixes and if so returns a prefix and a de-prefixed verb to be
 * further used to compare with the list of irregular verbs.
 *
 * @param {string} word The word for which to determine if it has one of the standard verb prefixes.
 * @param {Object} verbPrefixes The collection of verb prefixes to be used for normalization
 *
 * @returns {Array} Array of word forms from the exception list.
 */
var normalizePrefixed = function normalizePrefixed(word, verbPrefixes) {
	for (var property in verbPrefixes) {
		if (verbPrefixes.hasOwnProperty(property)) {
			verbPrefixes[property] = new RegExp(verbPrefixes[property], "i");
		}
	}

	if (verbPrefixes.sevenLetterHyphenPrefixes.test(word) === true) {
		return {
			normalizedWord: word.replace(verbPrefixes.sevenLetterHyphenPrefixes, ""),
			prefix: word.substring(0, 8)
		};
	}

	if (verbPrefixes.sevenLetterPrefixes.test(word) === true) {
		return {
			normalizedWord: word.replace(verbPrefixes.sevenLetterPrefixes, ""),
			prefix: word.substring(0, 7)
		};
	}

	if (verbPrefixes.fiveLetterHyphenPrefixes.test(word) === true) {
		return {
			normalizedWord: word.replace(verbPrefixes.fiveLetterHyphenPrefixes, ""),
			prefix: word.substring(0, 6)
		};
	}

	if (verbPrefixes.fiveLetterPrefixes.test(word) === true) {
		return {
			normalizedWord: word.replace(verbPrefixes.fiveLetterPrefixes, ""),
			prefix: word.substring(0, 5)
		};
	}

	if (verbPrefixes.fourLetterHyphenPrefixes.test(word) === true) {
		return {
			normalizedWord: word.replace(verbPrefixes.fourLetterHyphenPrefixes, ""),
			prefix: word.substring(0, 5)
		};
	}

	if (verbPrefixes.fourLetterPrefixes.test(word) === true) {
		return {
			normalizedWord: word.replace(verbPrefixes.fourLetterPrefixes, ""),
			prefix: word.substring(0, 4)
		};
	}

	if (verbPrefixes.threeLetterHyphenPrefixes.test(word) === true) {
		return {
			normalizedWord: word.replace(verbPrefixes.threeLetterHyphenPrefixes, ""),
			prefix: word.substring(0, 4)
		};
	}

	if (verbPrefixes.threeLetterPrefixes.test(word) === true) {
		return {
			normalizedWord: word.replace(verbPrefixes.threeLetterPrefixes, ""),
			prefix: word.substring(0, 3)
		};
	}

	if (verbPrefixes.twoLetterHyphenPrefixes.test(word) === true) {
		return {
			normalizedWord: word.replace(verbPrefixes.twoLetterHyphenPrefixes, ""),
			prefix: word.substring(0, 3)
		};
	}

	if (verbPrefixes.twoLetterPrefixes.test(word) === true) {
		return {
			normalizedWord: word.replace(verbPrefixes.twoLetterPrefixes, ""),
			prefix: word.substring(0, 2)
		};
	}

	if (verbPrefixes.oneLetterPrefixes.test(word) === true) {
		return {
			normalizedWord: word.replace(verbPrefixes.oneLetterPrefixes, ""),
			prefix: word.substring(0, 1)
		};
	}
};

/**
 * Checks if the input word occurs in the list of exception verbs and if so returns all its irregular forms.
 * If not checks if it is an irregular verb with one of the standard verb prefixes, if so returns all irregular prefixed forms.
 *
 * @param {string} word The word for which to determine its irregular forms.
 * @param {Array} irregularVerbs The array of irregular verbs available for this language.
 * @param {Object} verbPrefixes The collection of verb prefixes to be used for normalization of irregular verbs.
 *
 * @returns {Array} Array of word forms from the exception list.
 */
// "use strict";
var checkIrregulars = function checkIrregulars(word, irregularVerbs, verbPrefixes) {
	var irregulars = void 0;

	irregularVerbs.forEach(function (paradigm) {
		paradigm.forEach(function (wordInParadigm) {
			if (wordInParadigm === word) {
				irregulars = paradigm;
			}
		});
	});

	if ((0, _lodashEs.isUndefined)(irregulars)) {
		var normalizedIrregular = normalizePrefixed(word, verbPrefixes);

		if (!(0, _lodashEs.isUndefined)(normalizedIrregular)) {
			irregularVerbs.forEach(function (paradigm) {
				paradigm.forEach(function (wordInParadigm) {
					if (wordInParadigm === normalizedIrregular.normalizedWord) {
						irregulars = paradigm.map(function (verb) {
							return normalizedIrregular.prefix.concat(verb);
						});
					}
				});
			});
		}
	}

	return irregulars;
};

/**
 * Checks if the input word ends with "s".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "s".
 */
var endsWithS = function endsWithS(word) {
	var wordLength = word.length;
	// Consider only words of four letters or more to be s-forms (otherwise, words like "its" are being treated as verb forms).
	if (wordLength > 3) {
		return word[word.length - 1] === "s";
	}
	return false;
};

/**
 * Checks if the input word ends with "ing".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "ing".
 */
var endsWithIng = function endsWithIng(word) {
	var wordLength = word.length;
	// Consider only words of five letters or more to be ing forms (otherwise, words like "ping" are being treated as verb forms).
	if (wordLength > 4) {
		return word.substring(word.length - 3, word.length) === "ing";
	}
	return false;
};

/**
 * Checks if the input word ends with "ed".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "ed".
 */
var endsWithEd = function endsWithEd(word) {
	var wordLength = word.length;
	// Consider only words of four letters or more to be past forms (otherwise, words like "red" are being treated as verb forms).
	if (wordLength > 3) {
		return word.substring(word.length - 2, word.length) === "ed";
	}
	return false;
};

/**
 * Forms the infinitive from an input word.
 *
 * @param {string} word The word to build the infinitive for.
 * @param {Array} sFormToInfinitiveRegex The array of regex-based rules used to bring -s forms to infinitive.
 * @param {Array} ingFormToInfinitiveRegex The array of regex-based rules used to bring -ing forms to infinitive.
 * @param {Array} edFormToInfinitiveRegex The array of regex-based rules used to bring -ed forms to infinitive.
 *
 * @returns {string} The infinitive of the input word.
 */
var getInfinitive = function getInfinitive(word, sFormToInfinitiveRegex, ingFormToInfinitiveRegex, edFormToInfinitiveRegex) {
	if (endsWithS(word)) {
		return {
			infinitive: (0, _buildFormRule.buildOneFormFromRegex)(word, sFormToInfinitiveRegex),
			guessedForm: "s"
		};
	}

	if (endsWithIng(word)) {
		return {
			infinitive: (0, _buildFormRule.buildOneFormFromRegex)(word, ingFormToInfinitiveRegex),
			guessedForm: "ing"
		};
	}

	if (endsWithEd(word)) {
		return {
			infinitive: (0, _buildFormRule.buildOneFormFromRegex)(word, edFormToInfinitiveRegex),
			guessedForm: "ed"
		};
	}
	return {
		infinitive: word,
		guessedForm: "inf"
	};
};

/**
 * Collects all possible verb forms for a given word through checking if it is irregular, infinitive, s-form, ing-form or ed-form.
 *
 * @param {string} word The word for which to determine its forms.
 * @param {Object} verbsData The verb morphology data available for this language.
 *
 * @returns {Array} Array of word forms.
 */
var getVerbForms = function getVerbForms(word, verbsData) {
	var regexVerb = verbsData.regexVerb;

	var irregular = checkIrregulars(word, verbsData.irregularVerbs, regexVerb.verbPrefixes);
	if (!(0, _lodashEs.isUndefined)(irregular)) {
		return irregular;
	}

	var forms = [];

	var sFormToInfinitiveRegex = (0, _createRulesFromMorphologyData2.default)(regexVerb.sFormToInfinitive);
	var ingFormToInfinitiveRegex = (0, _createRulesFromMorphologyData2.default)(regexVerb.ingFormToInfinitive);
	var edFormToInfinitiveRegex = (0, _createRulesFromMorphologyData2.default)(regexVerb.edFormToInfinitive);

	var infinitive = getInfinitive(word, sFormToInfinitiveRegex, ingFormToInfinitiveRegex, edFormToInfinitiveRegex).infinitive;

	if ((0, _lodashEs.isUndefined)(infinitive)) {
		infinitive = word;
	}

	// Const guessedForm = getInfinitive( word ).guessedForm; //Meant to be used to check if the newly built forms are built correctly.
	forms = forms.concat(word);

	forms.push(infinitive);
	forms.push((0, _buildFormRule.buildOneFormFromRegex)(infinitive, (0, _createRulesFromMorphologyData2.default)(regexVerb.infinitiveToSForm)));
	forms.push((0, _buildFormRule.buildOneFormFromRegex)(infinitive, (0, _createRulesFromMorphologyData2.default)(regexVerb.infinitiveToIngForm)));
	forms.push((0, _buildFormRule.buildOneFormFromRegex)(infinitive, (0, _createRulesFromMorphologyData2.default)(regexVerb.infinitiveToEdForm)));

	forms = forms.filter(Boolean);

	return (0, _lodashEs.uniq)((0, _lodashEs.flatten)(forms));
};

exports.getVerbForms = getVerbForms;
exports.normalizePrefixed = normalizePrefixed;
//# sourceMappingURL=getVerbForms.js.map
