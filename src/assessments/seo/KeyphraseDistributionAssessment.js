"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodashEs = require("lodash");

var _assessment = require("../../assessment");

var _assessment2 = _interopRequireDefault(_assessment);

var _shortlinker = require("../../helpers/shortlinker");

var _getSentences = require("../../stringProcessing/getSentences");

var _getSentences2 = _interopRequireDefault(_getSentences);

var _AssessmentResult = require("../../values/AssessmentResult");

var _AssessmentResult2 = _interopRequireDefault(_AssessmentResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Returns a score based on the largest percentage of text in
 * which no keyword occurs.
 */
var KeyphraseDistributionAssessment = function (_Assessment) {
	_inherits(KeyphraseDistributionAssessment, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {Object} [config] The configuration to use.
  * @param {number} [config.parameters.goodDistributionScore]
  *      The average distribution score that needs to be received to the step function to get a GOOD result.
  * @param {number} [config.parameters.acceptableDistributionScore]
  *      The average distribution score that needs to be received to the step function to get an OKAY result.
  * @param {number} [config.scores.good]             The score to return if keyword occurrences are evenly distributed.
  * @param {number} [config.scores.okay]             The score to return if keyword occurrences are somewhat unevenly distributed.
  * @param {number} [config.scores.bad]              The score to return if there is way too much text between keyword occurrences.
  * @param {number} [config.scores.consideration]    The score to return if there are no keyword occurrences.
  * @param {string} [config.url]                     The URL to the relevant KB article.
  *
  * @returns {void}
  */
	function KeyphraseDistributionAssessment() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, KeyphraseDistributionAssessment);

		var _this = _possibleConstructorReturn(this, (KeyphraseDistributionAssessment.__proto__ || Object.getPrototypeOf(KeyphraseDistributionAssessment)).call(this));

		var defaultConfig = {
			parameters: {
				goodDistributionScore: 30,
				acceptableDistributionScore: 50
			},
			scores: {
				good: 9,
				okay: 6,
				bad: 1,
				consideration: 0
			},
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33q"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33u")
		};

		_this.identifier = "keyphraseDistribution";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Runs the keyphraseDistribution research and based on this returns an assessment result.
  *
  * @param {Paper}      paper      The paper to use for the assessment.
  * @param {Researcher} researcher The researcher used for calling research.
  * @param {Jed}        i18n       The object used for translations.
  *
  * @returns {AssessmentResult} The assessment result.
  */


	_createClass(KeyphraseDistributionAssessment, [{
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			this._keyphraseDistribution = researcher.getResearch("keyphraseDistribution");

			var assessmentResult = new _AssessmentResult2.default();

			var calculatedResult = this.calculateResult(i18n);

			assessmentResult.setScore(calculatedResult.score);
			assessmentResult.setText(calculatedResult.resultText);
			assessmentResult.setHasMarks(this._keyphraseDistribution.sentencesToHighlight.length > 0);

			return assessmentResult;
		}

		/**
   * Calculates the result based on the keyphraseDistribution research.
   *
   * @param {Jed} i18n The object used for translations.
   *
   * @returns {Object} Object with score and feedback text.
   */

	}, {
		key: "calculateResult",
		value: function calculateResult(i18n) {
			var distributionScore = this._keyphraseDistribution.keyphraseDistributionScore;

			if (distributionScore === 100) {
				return {
					score: this._config.scores.consideration,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links to Yoast.com articles,
     %3$s expands to the anchor end tag */
					i18n.dgettext("js-text-analysis", "%1$sKeyphrase distribution%3$s: " + "%2$sInclude your keyphrase or its synonyms in the text so that we can check keyphrase distribution%3$s."), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			if (distributionScore > this._config.parameters.acceptableDistributionScore) {
				return {
					score: this._config.scores.bad,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links to Yoast.com articles,
     %3$s expands to the anchor end tag */
					i18n.dgettext("js-text-analysis", "%1$sKeyphrase distribution%3$s: " + "Very uneven. Large parts of your text do not contain the keyphrase or its synonyms. %2$sDistribute them more evenly%3$s."), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			if (distributionScore > this._config.parameters.goodDistributionScore && distributionScore <= this._config.parameters.acceptableDistributionScore) {
				return {
					score: this._config.scores.okay,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links to Yoast.com articles,
     %3$s expands to the anchor end tag */
					i18n.dgettext("js-text-analysis", "%1$sKeyphrase distribution%3$s: " + "Uneven. Some parts of your text do not contain the keyphrase or its synonyms. %2$sDistribute them more evenly%3$s."), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			return {
				score: this._config.scores.good,
				resultText: i18n.sprintf(
				/* Translators: %1$s expands to links to Yoast.com articles, %2$s expands to the anchor end tag */
				i18n.dgettext("js-text-analysis", "%1$sKeyphrase distribution%2$s: Good job!"), this._config.urlTitle, "</a>")
			};
		}

		/**
   * Creates a marker for all content words in keyphrase and synonyms.
   *
   * @returns {Array} All markers for the current text.
   */

	}, {
		key: "getMarks",
		value: function getMarks() {
			return this._keyphraseDistribution.sentencesToHighlight;
		}

		/**
   * Checks whether the paper has a text with at least 10 words and a keyword.
   *
   * @param {Paper} paper The paper to use for the assessment.
   *
   * @returns {boolean} True when there is a keyword and a text with 10 words or more.
   */

	}, {
		key: "isApplicable",
		value: function isApplicable(paper) {
			return paper.hasText() && paper.hasKeyword() && (0, _getSentences2.default)(paper.getText()).length >= 15;
		}
	}]);

	return KeyphraseDistributionAssessment;
}(_assessment2.default);

exports.default = KeyphraseDistributionAssessment;
//# sourceMappingURL=KeyphraseDistributionAssessment.js.map
