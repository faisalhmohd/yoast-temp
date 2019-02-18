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
 * Assessment for checking the keyword matches in the meta description.
 */
var MetaDescriptionKeywordAssessment = function (_Assessment) {
	_inherits(MetaDescriptionKeywordAssessment, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {Object} [config] The configuration to use.
  * @param {number} [config.parameters.recommendedMinimum] The recommended minimum of keyword occurrences in the meta description.
  * @param {number} [config.scores.good] The score to return if there are enough keyword occurrences in the meta description.
  * @param {number} [config.scores.bad] The score to return if there aren't enough keyword occurrences in the meta description.
  * @param {string} [config.url] The URL to the relevant article on Yoast.com.
  *
  * @returns {void}
  */
	function MetaDescriptionKeywordAssessment() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, MetaDescriptionKeywordAssessment);

		var _this = _possibleConstructorReturn(this, (MetaDescriptionKeywordAssessment.__proto__ || Object.getPrototypeOf(MetaDescriptionKeywordAssessment)).call(this));

		var defaultConfig = {
			parameters: {
				recommendedMinimum: 1
			},
			scores: {
				good: 9,
				ok: 6,
				bad: 3
			},
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33k"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33l")
		};

		_this.identifier = "metaDescriptionKeyword";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Runs the metaDescriptionKeyword researcher and based on this, returns an assessment result with score.
  *
  * @param {Paper}      paper      The paper to use for the assessment.
  * @param {Researcher} researcher The researcher used for calling research.
  * @param {Jed}        i18n       The object used for translations.
  *
  * @returns {AssessmentResult} The assessment result.
  */


	_createClass(MetaDescriptionKeywordAssessment, [{
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			this._keyphraseCounts = researcher.getResearch("metaDescriptionKeyword");
			var assessmentResult = new _AssessmentResult2.default();
			var calculatedResult = this.calculateResult(i18n);

			assessmentResult.setScore(calculatedResult.score);
			assessmentResult.setText(calculatedResult.resultText);

			return assessmentResult;
		}

		/**
   * Returns the result object based on the number of keyword matches in the meta description.
   *
   * @param {Jed} i18n The object used for translations.
   *
   * @returns {Object} Result object with score and text.
   */

	}, {
		key: "calculateResult",
		value: function calculateResult(i18n) {
			// GOOD result when the meta description contains keyhrase or a synonym 1 or 2 times.
			if (this._keyphraseCounts === 1 || this._keyphraseCounts === 2) {
				return {
					score: this._config.scores.good,
					resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					i18n.dgettext("js-text-analysis", "%1$sKeyword in meta description%2$s: Keyword or synonym appear in the meta description. Well done!"), this._config.urlTitle, "</a>")
				};
			}

			// BAD if the description contains every keyword term more than twice.
			if (this._keyphraseCounts >= 3) {
				return {
					score: this._config.scores.bad,
					resultText: i18n.sprintf(
					/**
      * Translators:
      * %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
      * %3$s expands to the number of sentences containing the keyphrase,
      * %4$s expands to a link on yoast.com, %5$s expands to the anchor end tag.
      */
					i18n.dgettext("js-text-analysis", "%1$sKeyword in meta description%2$s: The meta description contains the keyword %3$s times, " + "which is over the advised maximum of 2 times. %4$sLimit that%5$s!"), this._config.urlTitle, "</a>", this._keyphraseCounts, this._config.urlCallToAction, "</a>")
				};
			}

			// BAD if the keyphrases is not contained in the meta description.
			return {
				score: this._config.scores.bad,
				resultText: i18n.sprintf(
				/**
     * Translators:
     * %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag.
     * %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag.
     */
				i18n.dgettext("js-text-analysis", "%1$sKeyword in meta description%2$s: The meta description has been specified, " + "but it does not contain the keyword. %3$sFix that%4$s!"), this._config.urlTitle, "</a>", this._config.urlCallToAction, "</a>")
			};
		}

		/**
   * Checks whether the paper has a keyword and a meta description.
   *
   * @param {Paper} paper The paper to use for the assessment.
   *
   * @returns {boolean} True if the paper has a keyword and a meta description.
   */

	}, {
		key: "isApplicable",
		value: function isApplicable(paper) {
			return paper.hasKeyword() && paper.hasDescription();
		}
	}]);

	return MetaDescriptionKeywordAssessment;
}(_assessment2.default);

exports.default = MetaDescriptionKeywordAssessment;
//# sourceMappingURL=MetaDescriptionKeywordAssessment.js.map
