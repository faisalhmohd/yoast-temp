"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _AssessmentResult = require("../../values/AssessmentResult.js");

var _AssessmentResult2 = _interopRequireDefault(_AssessmentResult);

var _lodashEs = require("lodash");

var _shortlinker = require("../../helpers/shortlinker");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var recommendedMinimum = 150;
/**
 * Calculate the score based on the current word count.
 * @param {number} wordCount The amount of words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateWordCountResult = function calculateWordCountResult(wordCount, i18n) {
	var urlTitle = (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34j");
	var urlCallToAction = (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34k");

	if (wordCount >= 150) {
		return {
			score: 9,
			text: i18n.sprintf(i18n.dngettext("js-text-analysis",
			/* Translators: %1$d expands to the number of words in the text,
   %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag */
			"%2$sText length%3$s: The text contains %1$d word. Good job!", "%2$sText length%3$s: The text contains %1$d words. Good job!", wordCount), wordCount, urlTitle, "</a>")
		};
	}

	if ((0, _lodashEs.inRange)(wordCount, 125, 150)) {
		return {
			score: 7,
			text: i18n.sprintf(i18n.dngettext("js-text-analysis",
			/* Translators: %1$d expands to the number of words in the text,
   %2$s expands to a link on yoast.com, %4$d expands to the anchor end tag. */
			"%2$sText length%4$s: The text contains %1$d word.", "%2$sText length%4$s: The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
			/* Translators: The preceding sentence is "Text length: The text contains x words.",
   %3$s expands to a link on yoast.com,
   %4$s expands to the anchor end tag,
   %5$d expands to the recommended minimum of words. */
			"This is slightly below the recommended minimum of %5$d word. %3$sAdd a bit more copy%4$s.", "This is slightly below the recommended minimum of %5$d words. %3$sAdd a bit more copy%4$s.", recommendedMinimum), wordCount, urlTitle, urlCallToAction, "</a>", recommendedMinimum)
		};
	}

	if ((0, _lodashEs.inRange)(wordCount, 100, 125)) {
		return {
			score: 5,
			text: i18n.sprintf(i18n.dngettext("js-text-analysis",
			/* Translators: %1$d expands to the number of words in the text,
   %2$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
			"%2$sText length%4$s: The text contains %1$d word.", "%2$sText length%4$s: The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
			/* Translators: The preceding sentence is "Text length: The text contains x words.",
   %3$s expands to a link on yoast.com,
   %4$s expands to the anchor end tag,
   %5$d expands to the recommended minimum of words. */
			"This is below the recommended minimum of %5$d word. %3$sAdd more content%4$s.", "This is below the recommended minimum of %5$d words. %3$sAdd more content%4$s.", recommendedMinimum), wordCount, urlTitle, urlCallToAction, "</a>", recommendedMinimum)
		};
	}

	if ((0, _lodashEs.inRange)(wordCount, 50, 100)) {
		return {
			score: -10,
			text: i18n.sprintf(i18n.dngettext("js-text-analysis",
			/* Translators: %1$d expands to the number of words in the text,
   %2$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
			"%2$sText length%4$s: The text contains %1$d word.", "%2$sText length%4$s: The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
			/* Translators: The preceding sentence is "Text length: The text contains x words.",
   %3$s expands to a link on yoast.com,
   %4$s expands to the anchor end tag,
   %5$d expands to the recommended minimum of words. */
			"This is below the recommended minimum of %5$d word. %3$sAdd more content%4$s.", "This is below the recommended minimum of %5$d words. %3$sAdd more content%4$s.", recommendedMinimum), wordCount, urlTitle, urlCallToAction, "</a>", recommendedMinimum)
		};
	}

	if ((0, _lodashEs.inRange)(wordCount, 0, 50)) {
		return {
			score: -20,
			text: i18n.sprintf(i18n.dngettext("js-text-analysis",
			/* Translators: %1$d expands to the number of words in the text,
   %2$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
			"%2$sText length%4$s: The text contains %1$d word.", "%2$sText length%4$s: The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
			/* Translators: The preceding sentence is "Text length: The text contains x words.",
   %3$s expands to a link on yoast.com,
   %4$s expands to the anchor end tag,
   %5$d expands to the recommended minimum of words. */
			"This is far below the recommended minimum of %5$d word. %3$sAdd more content%4$s.", "This is far below the recommended minimum of %5$d words. %3$sAdd more content%4$s.", recommendedMinimum), wordCount, urlTitle, urlCallToAction, "</a>", recommendedMinimum)
		};
	}
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
var taxonomyTextLengthAssessment = function taxonomyTextLengthAssessment(paper, researcher, i18n) {
	var wordCount = researcher.getResearch("wordCountInText");
	var wordCountResult = calculateWordCountResult(wordCount, i18n);
	var assessmentResult = new _AssessmentResult2.default();

	assessmentResult.setScore(wordCountResult.score);
	assessmentResult.setText(i18n.sprintf(wordCountResult.text, wordCount, recommendedMinimum));

	return assessmentResult;
};

exports.default = {
	identifier: "taxonomyTextLength",
	getResult: taxonomyTextLengthAssessment
};
//# sourceMappingURL=taxonomyTextLengthAssessment.js.map
