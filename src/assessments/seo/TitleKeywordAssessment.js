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
 * Assessment to check whether the keyword is included in (the beginning of) the SEO title.
 */
var TitleKeywordAssessment = function (_Assessment) {
	_inherits(TitleKeywordAssessment, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {Object} [config] The configuration to use.
  * @param {number} [config.parameters.recommendedPosition] The recommended position of the keyword within the title.
  * @param {number} [config.scores.good] The score to return if the keyword is found at the recommended position.
  * @param {number} [config.scores.okay] The score to return if the keyword is found, but not at the recommended position.
  * @param {number} [config.scores.bad] The score to return if there are fewer keyword occurrences than the recommended minimum.
  * @param {string} [config.url] The URL to the relevant article on Yoast.com.
  *
  * @returns {void}
  */
	function TitleKeywordAssessment() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, TitleKeywordAssessment);

		var _this = _possibleConstructorReturn(this, (TitleKeywordAssessment.__proto__ || Object.getPrototypeOf(TitleKeywordAssessment)).call(this));

		var defaultConfig = {
			parameters: {
				recommendedPosition: 0
			},
			scores: {
				good: 9,
				okay: 6,
				bad: 2
			},
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33g"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33h")
		};

		_this.identifier = "titleKeyword";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Executes the pagetitle keyword assessment and returns an assessment result.
  *
  * @param {Paper} paper The Paper object to assess.
  * @param {Researcher} researcher The Researcher object containing all available researches.
  * @param {Jed} i18n The object used for translations.
  *
  * @returns {AssessmentResult} The result of the assessment with text and score.
  */


	_createClass(TitleKeywordAssessment, [{
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			this._keywordMatches = researcher.getResearch("findKeywordInPageTitle");
			this._keyword = (0, _lodashEs.escape)(paper.getKeyword());

			var assessmentResult = new _AssessmentResult2.default();

			var calculatedResult = this.calculateResult(i18n, this._keyword);
			assessmentResult.setScore(calculatedResult.score);
			assessmentResult.setText(calculatedResult.resultText);

			return assessmentResult;
		}

		/**
   * Checks whether the assessment is applicable to the paper
   *
   * @param {Paper} paper The Paper object to assess.
   *
   * @returns {boolean} Whether the paper has a keyword and a title.
   */

	}, {
		key: "isApplicable",
		value: function isApplicable(paper) {
			return paper.hasKeyword() && paper.hasTitle();
		}

		/**
   * Calculates the result based on whether and how the keyphrase was matched in the title. Returns GOOD result if
   * an exact match of the keyword is found in the beginning of the title. Returns OK results if all content words
   * to the keyphrase are in the title (in any form). Returns BAD otherwise.
   *
   * @param {Jed} i18n The object used for translations.
   * @param {string} keyword The keyword of the paper (to be returned in the feedback strings).
   *
   * @returns {Object} Object with score and text.
   */

	}, {
		key: "calculateResult",
		value: function calculateResult(i18n, keyword) {
			var exactMatchFound = this._keywordMatches.exactMatchFound;
			var position = this._keywordMatches.position;
			var allWordsFound = this._keywordMatches.allWordsFound;
			var exactMatchKeyphrase = this._keywordMatches.exactMatchKeyphrase;

			if (exactMatchFound === true) {
				if (position === 0) {
					return {
						score: this._config.scores.good,
						resultText: i18n.sprintf(
						/* Translators: %1$s expands to a link on yoast.com,
      %2$s expands to the anchor end tag. */
						i18n.dgettext("js-text-analysis", "%1$sKeyphrase in title%2$s: The exact match of the keyphrase appears at the beginning " + "of the SEO title. Good job!"), this._config.urlTitle, "</a>")
					};
				}
				return {
					score: this._config.scores.okay,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to a link on yoast.com,
     %3$s expands to the anchor end tag. */
					i18n.dgettext("js-text-analysis", "%1$sKeyphrase in title%3$s: The exact match of the keyphrase appears in the SEO title, but not " + "at the beginning. %2$sTry to move it to the beginning%3$s."), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			if (allWordsFound) {
				return {
					score: this._config.scores.okay,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to a link on yoast.com,
     %3$s expands to the anchor end tag. */
					i18n.dgettext("js-text-analysis", "%1$sKeyphrase in title%3$s: Does not contain the exact match. %2$sTry to write the exact match of " + "your keyphrase in the SEO title%3$s."), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			if (exactMatchKeyphrase) {
				return {
					score: this._config.scores.bad,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to a link on yoast.com,
     %3$s expands to the anchor end tag. */
					i18n.dgettext("js-text-analysis", "%1$sKeyphrase in title%3$s: Does not contain the exact match. %2$sTry to write the exact match of " + "your keyphrase in the SEO title%3$s."), this._config.urlTitle, this._config.urlCallToAction, "</a>", keyword)
				};
			}

			return {
				score: this._config.scores.bad,
				resultText: i18n.sprintf(
				/* Translators: %1$s and %2$s expand to a link on yoast.com,
    %3$s expands to the anchor end tag, %4$s expands to the keyword of the article. */
				i18n.dgettext("js-text-analysis", "%1$sKeyphrase in title%3$s: Not all the words to your keyphrase \"%4$s\" appear in the SEO title. " + "%2$sTry to use the exact match of your keyphrase in the SEO title%3$s."), this._config.urlTitle, this._config.urlCallToAction, "</a>", keyword)
			};
		}
	}]);

	return TitleKeywordAssessment;
}(_assessment2.default);

exports.default = TitleKeywordAssessment;
//# sourceMappingURL=TitleKeywordAssessment.js.map
