"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.checkPossessive = exports.getNounForms = exports.getNounFormsWithPossessives = undefined;

var _createRulesFromMorphologyData = require("../morphoHelpers/createRulesFromMorphologyData.js");

var _createRulesFromMorphologyData2 = _interopRequireDefault(_createRulesFromMorphologyData);

var _buildFormRule = require("../morphoHelpers/buildFormRule");

var _lodashEs = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks if the input word is a possessive form (e.g., "boy's" in "the boy's car") and returns true if that is the case.
 *
 * @param {string} word The word for which to determine if it's a possessive.
 * @param {Array} possessiveToBaseRegexes An array of regex-based rules to bring possessives to base.
 *
 * @returns {boolean} Whether the input word is a possessive form or not.
 */
var checkPossessive = function checkPossessive(word, possessiveToBaseRegexes) {
	for (var i = 0; i < possessiveToBaseRegexes.length; i++) {
		if (possessiveToBaseRegexes[i].reg.test(word)) {
			return true;
		}
	}
};

/**
 * Checks if the input word occurs in the list of exception nouns and if so returns all its irregular forms.
 *
 * @param {string} word The word for which to determine its irregular forms.
 * @param {Array} irregularNouns An array of irregular nouns from the morphology data available for the language.
 *
 * @returns {Array} Array of word forms from the exception list.
 */
// "use strict";
var checkIrregulars = function checkIrregulars(word, irregularNouns) {
	var irregulars = void 0;

	irregularNouns.forEach(function (paradigm) {
		paradigm.forEach(function (wordInParadigm) {
			if (wordInParadigm === word) {
				irregulars = paradigm;
			}
		});
	});
	return irregulars;
};

/**
 * Collects all possible noun forms for a given word through checking if it is irregular, hispanic, singular or plural.
 *
 * @param {string} word The word for which to determine its forms.
 * @param {Object} nounData The noun morphology data available for this language.
 *
 * @returns {Array} Array of word forms.
 */
var getNounForms = function getNounForms(word, nounData) {
	var forms = [].concat(word);
	var base = word;

	var regexNoun = nounData.regexNoun;

	var baseIfPossessive = (0, _buildFormRule.buildOneFormFromRegex)(word, (0, _createRulesFromMorphologyData2.default)(regexNoun.possessiveToBase));
	if (!(0, _lodashEs.isUndefined)(baseIfPossessive)) {
		base = baseIfPossessive;
		forms = forms.concat(base);
	}

	var irregular = checkIrregulars(base, nounData.irregularNouns);
	if (!(0, _lodashEs.isUndefined)(irregular)) {
		return irregular;
	}

	var hispanic = (0, _buildFormRule.buildTwoFormsFromRegex)(base, (0, _createRulesFromMorphologyData2.default)(regexNoun.hispanic));
	if (!(0, _lodashEs.isUndefined)(hispanic)) {
		forms.push(hispanic[0], hispanic[1]);
		return forms;
	}

	var singular = (0, _buildFormRule.buildOneFormFromRegex)(base, (0, _createRulesFromMorphologyData2.default)(regexNoun.singularize));
	if (!(0, _lodashEs.isUndefined)(singular)) {
		forms.push(singular);
	}

	var plural = (0, _buildFormRule.buildOneFormFromRegex)(base, (0, _createRulesFromMorphologyData2.default)(regexNoun.pluralize));
	if (!(0, _lodashEs.isUndefined)(plural)) {
		forms.push(plural);
	}

	return (0, _lodashEs.uniq)(forms);
};

/**
 * Collects all possible noun forms for a given word through checking if it is irregular, hispanic, or regular.
 * Returns the irregular paradigm, singular, and plural, and possessive forms for all these.
 *
 * @param {string} word The word to collect all forms for.
 * @param {Object} nounData The noun morphology data available for this language.
 *
 * @returns {Array} Array of all word forms including possessives.
 */
var getNounFormsWithPossessives = function getNounFormsWithPossessives(word, nounData) {
	var forms = getNounForms(word, nounData);

	/* For every form in the forms array check if it is already a possessive or not.
  * If so, return nothing; if not, return a corresponding possessive form.
  * Because returning nothing generates undefined objects, filter(Boolean) to get rid of them.
  */
	forms = forms.concat(forms.map(function (form) {
		if (!checkPossessive(form, (0, _createRulesFromMorphologyData2.default)(nounData.regexNoun.possessiveToBase))) {
			return (0, _buildFormRule.buildTwoFormsFromRegex)(form, (0, _createRulesFromMorphologyData2.default)(nounData.regexNoun.baseToPossessive));
		}
	})).filter(Boolean);
	return (0, _lodashEs.uniq)((0, _lodashEs.flatten)(forms));
};

exports.getNounFormsWithPossessives = getNounFormsWithPossessives;
exports.getNounForms = getNounForms;
exports.checkPossessive = checkPossessive;
//# sourceMappingURL=getNounForms.js.map
