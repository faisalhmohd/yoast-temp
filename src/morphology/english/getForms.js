"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getForms = getForms;

var _createRulesFromMorphologyData = require("../morphoHelpers/createRulesFromMorphologyData.js");

var _createRulesFromMorphologyData2 = _interopRequireDefault(_createRulesFromMorphologyData);

var _getNounForms = require("./getNounForms.js");

var _getVerbForms = require("./getVerbForms.js");

var _getAdjectiveForms = require("./getAdjectiveForms.js");

var _lodashEs = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns all possible forms of the input word using the morphologyData (language-specific).
 *
 * @param {string} word The word to get forms for.
 * @param {Object} morphologyData The available morphology data per language (false if unavailable).
 *
 * @returns {Array} Array of all forms to be searched for keyword-based assessments.
 */
function getForms(word, morphologyData) {
	if ((0, _getNounForms.checkPossessive)(word, (0, _createRulesFromMorphologyData2.default)(morphologyData.nouns.regexNoun.possessiveToBase))) {
		return (0, _lodashEs.uniq)((0, _getNounForms.getNounFormsWithPossessives)(word, morphologyData.nouns));
	}
	return (0, _lodashEs.uniq)((0, _lodashEs.flatten)([(0, _getNounForms.getNounFormsWithPossessives)(word, morphologyData.nouns), (0, _getVerbForms.getVerbForms)(word, morphologyData.verbs), (0, _getAdjectiveForms.getAdjectiveForms)(word, morphologyData.adjectives)]));
}
//# sourceMappingURL=getForms.js.map
