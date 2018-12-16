"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodashEs = require("lodash");

var _assessment = require("../../assessment");

var _assessment2 = _interopRequireDefault(_assessment);

var _shortlinker = require("../../helpers/shortlinker");

var _AssessmentResult = require("../../values/AssessmentResult");

var _AssessmentResult2 = _interopRequireDefault(_AssessmentResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Assessment to check whether the keyphrase or synonyms are encountered in the first paragraph of the article.
 */
var IntroductionKeywordAssessment = function (_Assessment) {
	_inherits(IntroductionKeywordAssessment, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {Object} [config] The configuration to use.
  * @param {number} [config.scores.good] The score to return if there is a match within one sentence in the first paragraph.
  * @param {number} [config.scores.okay] The score to return if all words are matched in the first paragraph.
  * @param {number} [config.scores.bad] The score to return if not all words are matched in the first paragraph.
  * @param {string} [config.url] The URL to the relevant article on Yoast.com.
  *
  * @returns {void}
  */
	function IntroductionKeywordAssessment() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, IntroductionKeywordAssessment);

		var _this = _possibleConstructorReturn(this, (IntroductionKeywordAssessment.__proto__ || Object.getPrototypeOf(IntroductionKeywordAssessment)).call(this));

		var defaultConfig = {
			scores: {
				good: 9,
				okay: 6,
				bad: 3
			},
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33e"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33f")
		};

		_this.identifier = "introductionKeyword";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Assesses the presence of keyphrase or synonyms in the first paragraph.
  *
  * @param {Paper} paper The paper to use for the assessment.
  * @param {Researcher} researcher The researcher used for calling research.
  * @param {Jed} i18n The object used for translations.
  *
  * @returns {AssessmentResult} The result of this assessment.
  */


	_createClass(IntroductionKeywordAssessment, [{
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			var assessmentResult = new _AssessmentResult2.default();

			this._firstParagraphMatches = researcher.getResearch("firstParagraph");
			var calculatedResult = this.calculateResult(i18n);

			assessmentResult.setScore(calculatedResult.score);
			assessmentResult.setText(calculatedResult.resultText);

			return assessmentResult;
		}

		/**
   * Checks if the paper has both keyword and text.
   *
   * @param {Paper} paper The paper to be analyzed.
   *
   * @returns {boolean} Whether the assessment is applicable or not.
   */

	}, {
		key: "isApplicable",
		value: function isApplicable(paper) {
			return paper.hasKeyword() && paper.hasText();
		}

		/**
   * Returns a result based on the number of occurrences of keyphrase in the first paragraph.
   *
   * @param {Jed} i18n The object used for translations.
   *
   * @returns {Object} result object with a score and translation text.
   */

	}, {
		key: "calculateResult",
		value: function calculateResult(i18n) {
			if (this._firstParagraphMatches.foundInOneSentence) {
				return {
					score: this._config.scores.good,
					resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					i18n.dgettext("js-text-analysis", "%1$sKeyphrase in introduction%2$s: Well done!"), this._config.urlTitle, "</a>")
				};
			}

			if (this._firstParagraphMatches.foundInParagraph) {
				return {
					score: this._config.scores.okay,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag. */
					i18n.dgettext("js-text-analysis", "%1$sKeyphrase in introduction%3$s:" + "Your keyphrase or its synonyms appear in the first paragraph of the copy, but not within one sentence. %2$sFix that%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			return {
				score: this._config.scores.bad,
				resultText: i18n.sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag. */
				i18n.dgettext("js-text-analysis", "%1$sKeyphrase in introduction%3$s: Your keyphrase or its synonyms do not appear in the first paragraph. " + "%2$sMake sure the topic is clear immediately%3$s."), this._config.urlTitle, this._config.urlCallToAction, "</a>")
			};
		}
	}]);

	return IntroductionKeywordAssessment;
}(_assessment2.default);

exports.default = IntroductionKeywordAssessment;
//# sourceMappingURL=IntroductionKeywordAssessment.js.map
