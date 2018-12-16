"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodashEs = require("lodash");

var _assessment = require("../../assessment");

var _assessment2 = _interopRequireDefault(_assessment);

var _checkForTooLongSentences = require("../../assessmentHelpers/checkForTooLongSentences");

var _checkForTooLongSentences2 = _interopRequireDefault(_checkForTooLongSentences);

var _formatNumber = require("../../helpers/formatNumber");

var _formatNumber2 = _interopRequireDefault(_formatNumber);

var _inRange = require("../../helpers/inRange");

var _addMark = require("../../markers/addMark");

var _addMark2 = _interopRequireDefault(_addMark);

var _shortlinker = require("../../helpers/shortlinker");

var _stripHTMLTags = require("../../stringProcessing/stripHTMLTags");

var _AssessmentResult = require("../../values/AssessmentResult");

var _AssessmentResult2 = _interopRequireDefault(_AssessmentResult);

var _Mark = require("../../values/Mark");

var _Mark2 = _interopRequireDefault(_Mark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Represents the assessment that will calculate the length of sentences in the text.
 */
var SentenceLengthInTextAssessment = function (_Assessment) {
	_inherits(SentenceLengthInTextAssessment, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {object} config The configuration to use.
  * @returns {void}
  */
	function SentenceLengthInTextAssessment() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, SentenceLengthInTextAssessment);

		var _this = _possibleConstructorReturn(this, (SentenceLengthInTextAssessment.__proto__ || Object.getPrototypeOf(SentenceLengthInTextAssessment)).call(this));

		var defaultConfig = {
			recommendedWordCount: 20,
			slightlyTooMany: 25,
			farTooMany: 30
		};

		_this.identifier = "textSentenceLength";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Scores the percentage of sentences including more than the recommended number of words.
  *
  * @param {Paper} paper The paper to use for the assessment.
  * @param {Researcher} researcher The researcher used for calling research.
  * @param {object} i18n The object used for translations.
  * @returns {AssessmentResult} The Assessment result.
  */


	_createClass(SentenceLengthInTextAssessment, [{
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			var sentences = researcher.getResearch("countSentencesFromText");
			var percentage = this.calculatePercentage(sentences);
			var score = this.calculateScore(percentage);

			var assessmentResult = new _AssessmentResult2.default();

			assessmentResult.setScore(score);
			assessmentResult.setText(this.translateScore(score, percentage, i18n));
			assessmentResult.setHasMarks(percentage > 0);

			return assessmentResult;
		}

		/**
   * Checks whether the paper has text.
   *
   * @param {Paper} paper The paper to use for the assessment.
   *
   * @returns {boolean} True when there is text.
   */

	}, {
		key: "isApplicable",
		value: function isApplicable(paper) {
			return paper.hasText();
		}

		/**
   * Mark the sentences.
   *
   * @param {Paper} paper The paper to use for the marking.
   * @param {Researcher} researcher The researcher to use.
   *
   * @returns {Array} Array with all the marked sentences.
   */

	}, {
		key: "getMarks",
		value: function getMarks(paper, researcher) {
			var sentenceCount = researcher.getResearch("countSentencesFromText");
			var sentenceObjects = this.getTooLongSentences(sentenceCount);

			return (0, _lodashEs.map)(sentenceObjects, function (sentenceObject) {
				var sentence = (0, _stripHTMLTags.stripIncompleteTags)(sentenceObject.sentence);
				return new _Mark2.default({
					original: sentence,
					marked: (0, _addMark2.default)(sentence)
				});
			});
		}

		/**
   * Translates the score to a message the user can understand.
   *
   * @param {number} score The score.
   * @param {number} percentage The percentage.
   * @param {object} i18n The object used for translations.
   *
   * @returns {string} A string.
   */

	}, {
		key: "translateScore",
		value: function translateScore(score, percentage, i18n) {
			var urlTitle = (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34v");
			var urlCallToAction = (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34w");
			if (score >= 7) {
				return i18n.sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext("js-text-analysis", "%1$sSentence length%2$s: Great!"), urlTitle, "</a>");
			}

			return i18n.sprintf(
			/* Translators: %1$s and %6$s expand to a link on yoast.com, %2$s expands to the anchor end tag,
   %3$d expands to percentage of sentences, %4$s expands to the recommended maximum sentence length,
   %5$s expands to the recommended maximum percentage. */
			i18n.dgettext("js-text-analysis", "%1$sSentence length%2$s: %3$s of the sentences contain more than %4$s words, which is more than the recommended maximum of %5$s." + " %6$sTry to shorten the sentences%2$s."), urlTitle, "</a>", percentage + "%", this._config.recommendedWordCount, this._config.slightlyTooMany + "%", urlCallToAction);
		}

		/**
   * Calculates the percentage of sentences that are too long.
   *
   * @param {Array} sentences The sentences to calculate the percentage for.
   * @returns {number} The calculates percentage of too long sentences.
   */

	}, {
		key: "calculatePercentage",
		value: function calculatePercentage(sentences) {
			var percentage = 0;

			if (sentences.length !== 0) {
				var tooLongTotal = this.countTooLongSentences(sentences);

				percentage = (0, _formatNumber2.default)(tooLongTotal / sentences.length * 100);
			}

			return percentage;
		}

		/**
   * Calculates the score for the given percentage.
   *
   * @param {number} percentage The percentage to calculate the score for.
   * @returns {number} The calculated score.
   */

	}, {
		key: "calculateScore",
		value: function calculateScore(percentage) {
			var score = void 0;

			// Green indicator.
			if (percentage <= this._config.slightlyTooMany) {
				score = 9;
			}

			// Orange indicator.
			if ((0, _inRange.inRangeEndInclusive)(percentage, this._config.slightlyTooMany, this._config.farTooMany)) {
				score = 6;
			}

			// Red indicator.
			if (percentage > this._config.farTooMany) {
				score = 3;
			}

			return score;
		}

		/**
   * Gets the sentences that are qualified as being too long.
   *
   * @param {array} sentences The sentences to filter through.
   * @returns {array} Array with all the sentences considered to be too long.
   */

	}, {
		key: "getTooLongSentences",
		value: function getTooLongSentences(sentences) {
			return (0, _checkForTooLongSentences2.default)(sentences, this._config.recommendedWordCount);
		}

		/**
   * Get the total amount of sentences that are qualified as being too long.
   *
   * @param {Array} sentences The sentences to filter through.
   * @returns {Number} The amount of sentences that are considered too long.
   */

	}, {
		key: "countTooLongSentences",
		value: function countTooLongSentences(sentences) {
			return this.getTooLongSentences(sentences).length;
		}
	}]);

	return SentenceLengthInTextAssessment;
}(_assessment2.default);

exports.default = SentenceLengthInTextAssessment;
//# sourceMappingURL=sentenceLengthInTextAssessment.js.map
