"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getLanguageAvailability = require("../../helpers/getLanguageAvailability");

var _getLanguageAvailability2 = _interopRequireDefault(_getLanguageAvailability);

var _shortlinker = require("../../helpers/shortlinker");

var _AssessmentResult = require("../../values/AssessmentResult");

var _AssessmentResult2 = _interopRequireDefault(_AssessmentResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var availableLanguages = ["en"];

/**
 * Calculate the score based on the amount of stop words in the keyword.
 *
 * @param {number} stopWordCount The amount of stop words to be checked against.
 * @param {Jed} i18n The locale object.
 *
 * @returns {Object} The resulting score object.
 *
 * @deprecated
 */
var calculateStopWordsCountResult = function calculateStopWordsCountResult(stopWordCount, i18n) {
	if (stopWordCount > 0) {
		return {
			score: 0,
			text: i18n.dngettext("js-text-analysis",
			/* Translators: %1$s and %2$s open links to Yoast articles, %3$s is the anchor end tag */
			"%1$sStopwords%3$s: The keyphrase contains stop words. " + "This may or may not be wise depending on the circumstances. " + "%2$sLearn more about stop words%3$s.")
		};
	}

	return {};
};

/**
 * Execute the Assessment and return a result.
 *
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {Jed} i18n The locale object.
 *
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var keywordHasStopWordsAssessment = function keywordHasStopWordsAssessment(paper, researcher, i18n) {
	var stopWords = researcher.getResearch("stopWordsInKeyword");
	var stopWordsResult = calculateStopWordsCountResult(stopWords.length, i18n);

	var assessmentResult = new _AssessmentResult2.default();
	assessmentResult.setScore(stopWordsResult.score);
	assessmentResult.setText(i18n.sprintf(stopWordsResult.text, (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34b"), (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34c"), "</a>", stopWords.length));

	return assessmentResult;
};

exports.default = {
	identifier: "keywordStopWords",
	getResult: keywordHasStopWordsAssessment,
	isApplicable: function isApplicable(paper) {
		var isLanguageAvailable = (0, _getLanguageAvailability2.default)(paper.getLocale(), availableLanguages);
		return paper.hasKeyword() && isLanguageAvailable;
	}
};
//# sourceMappingURL=keywordStopWordsAssessment.js.map
