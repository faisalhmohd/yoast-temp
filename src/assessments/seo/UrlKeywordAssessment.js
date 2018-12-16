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
 * Represents the URL keyword assessments. This assessments will check if the keyword is present in the url.
 */
var UrlKeywordAssessment = function (_Assessment) {
	_inherits(UrlKeywordAssessment, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {Object} config The configuration to use.
  * @param {number} [config.scores.noKeywordInUrl] The score to return if the keyword is not in the URL.
  * @param {number} [config.scores.good] The score to return if the keyword is in the URL.
  * @param {string} [config.url] The URL to the relevant KB article.
  *
  * @returns {void}
  */
	function UrlKeywordAssessment() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, UrlKeywordAssessment);

		var _this = _possibleConstructorReturn(this, (UrlKeywordAssessment.__proto__ || Object.getPrototypeOf(UrlKeywordAssessment)).call(this));

		var defaultConfig = {
			scores: {
				okay: 6,
				good: 9
			},
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33o"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33p")
		};

		_this.identifier = "urlKeyword";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Executes the Assessment and returns a result.
  *
  * @param {Paper} paper The Paper object to assess.
  * @param {Researcher} researcher The Researcher object containing all available researches.
  * @param {Jed} i18n The object used for translations.
  *
  * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
  */


	_createClass(UrlKeywordAssessment, [{
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			this._keywordInURL = researcher.getResearch("keywordCountInUrl");

			var assessmentResult = new _AssessmentResult2.default();

			var calculatedResult = this.calculateResult(i18n);
			assessmentResult.setScore(calculatedResult.score);
			assessmentResult.setText(calculatedResult.resultText);

			return assessmentResult;
		}

		/**
   * Checks whether the paper has a keyword and a url.
   *
   * @param {Paper} paper The paper to use for the assessment.
   *
   * @returns {boolean} True when there is a keyword and an url.
   */

	}, {
		key: "isApplicable",
		value: function isApplicable(paper) {
			return paper.hasKeyword() && paper.hasUrl();
		}

		/**
   * Determines the score and the result text based on whether or not there's a keyword in the url.
   *
   * @param {Jed} i18n The object used for translations.
   *
   * @returns {Object} The object with calculated score and resultText.
   */

	}, {
		key: "calculateResult",
		value: function calculateResult(i18n) {
			if (this._keywordInURL.keyphraseLength < 3) {
				if (this._keywordInURL.percentWordMatches === 100) {
					return {
						score: this._config.scores.good,
						resultText: i18n.sprintf(
						/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
						i18n.dgettext("js-text-analysis", "%1$sKeyphrase in slug%2$s: Great work!"), this._config.urlTitle, "</a>")
					};
				}

				return {
					score: this._config.scores.okay,
					resultText: i18n.sprintf(
					/* Translators:  %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext("js-text-analysis", "%1$sKeyphrase in slug%3$s: (Part of) your keyphrase does not appear in the slug. %2$sChange that%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			if (this._keywordInURL.percentWordMatches > 50) {
				return {
					score: this._config.scores.good,
					resultText: i18n.sprintf(
					/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
					i18n.dgettext("js-text-analysis", "%1$sKeyphrase in slug%2$s: More than half of your keyphrase appears in the slug. That's great!"), this._config.urlTitle, "</a>")
				};
			}
			return {
				score: this._config.scores.okay,
				resultText: i18n.sprintf(
				/* Translators:  %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				i18n.dgettext("js-text-analysis", "%1$sKeyphrase in slug%3$s: (Part of) your keyphrase does not appear in the slug. %2$sChange that%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
			};
		}
	}]);

	return UrlKeywordAssessment;
}(_assessment2.default);

exports.default = UrlKeywordAssessment;
//# sourceMappingURL=UrlKeywordAssessment.js.map
