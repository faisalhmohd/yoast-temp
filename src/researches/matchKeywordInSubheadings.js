"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (paper, researcher) {
	var text = (0, _stripNonTextTags2.default)(paper.getText());
	var topicForms = researcher.getResearch("morphology");
	var locale = paper.getLocale();
	var result = { count: 0, matches: 0, percentReflectingTopic: 0 };
	var useSynonyms = true;
	var subheadings = process.env.YOAST_RECALIBRATION === "enabled" ? (0, _getSubheadings.getSubheadingContentsTopLevel)(text) : (0, _getSubheadings.getSubheadingContents)(text);

	if (subheadings.length !== 0) {
		result.count = subheadings.length;
		result.matches = numberOfSubheadingsReflectingTopic(topicForms, subheadings, useSynonyms, locale);
		result.percentReflectingTopic = result.matches / result.count * 100;
	}

	return result;
};

var _lodashEs = require("lodash");

var _getFunctionWordsLanguages = require("../helpers/getFunctionWordsLanguages");

var _getFunctionWordsLanguages2 = _interopRequireDefault(_getFunctionWordsLanguages);

var _getLanguage = require("../helpers/getLanguage");

var _getLanguage2 = _interopRequireDefault(_getLanguage);

var _getSubheadings = require("../stringProcessing/getSubheadings");

var _stripNonTextTags = require("../stringProcessing/stripNonTextTags");

var _stripNonTextTags2 = _interopRequireDefault(_stripNonTextTags);

var _findKeywordFormsInString = require("./findKeywordFormsInString");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var functionWordLanguages = (0, _getFunctionWordsLanguages2.default)();

/**
 * Computes the amount of subheadings reflecting the topic.
 *
 * @param {Object}      topicForms      The main key phrase and its synonyms to check.
 * @param {string[]}    subheadings     The subheadings to check.
 * @param {boolean}     useSynonyms     Whether to match synonyms or only main keyphrase.
 * @param {string}      locale          The current locale.
 *
 * @returns {number} The amount of subheadings reflecting the topic.
 */
var numberOfSubheadingsReflectingTopic = function numberOfSubheadingsReflectingTopic(topicForms, subheadings, useSynonyms, locale) {
	var isFunctionWordLanguage = (0, _lodashEs.includes)(functionWordLanguages, (0, _getLanguage2.default)(locale));

	return subheadings.filter(function (subheading) {
		var matchedTopicForms = (0, _findKeywordFormsInString.findTopicFormsInString)(topicForms, subheading, useSynonyms, locale);

		if (process.env.YOAST_RECALIBRATION === "enabled" && !isFunctionWordLanguage) {
			return matchedTopicForms.percentWordMatches === 100;
		}
		return matchedTopicForms.percentWordMatches > 50;
	}).length;
};

/**
 * Checks if there are any subheadings like h2 in the text
 * and if they have the key phrase and the keywords' respective morphological forms in them.
 *
 * Also checks for synonyms.
 *
 * @param {Object}      paper       The paper object containing the text and keyword.
 * @param {Researcher}  researcher  The researcher object.
 *
 * @returns {Object} The result object.
 */
//# sourceMappingURL=matchKeywordInSubheadings.js.map
