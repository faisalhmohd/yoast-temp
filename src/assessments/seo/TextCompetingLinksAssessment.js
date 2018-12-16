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
 * Assessment to check whether you're linking to a different page with the keyword to this page.
 */
var TextCompetingLinksAssessment = function (_Assessment) {
	_inherits(TextCompetingLinksAssessment, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {Object} [config] The configuration to use.
  * @param {number} [config.parameters.recommendedMaximum] The recommended maximum number of links using the same keyword as this paper.
  * @param {string} [config.scores.bad] The score to return if there are more links with the same keyword than the recommended maximum.
  * @param {string} [config.url] The URL to the relevant article on Yoast.com.
  *
  * @returns {void}
  */
	function TextCompetingLinksAssessment() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, TextCompetingLinksAssessment);

		var _this = _possibleConstructorReturn(this, (TextCompetingLinksAssessment.__proto__ || Object.getPrototypeOf(TextCompetingLinksAssessment)).call(this));

		var defaultConfig = {
			parameters: {
				recommendedMaximum: 0
			},
			scores: {
				bad: 2
			},
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34l"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34m")
		};

		_this.identifier = "textCompetingLinks";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Runs the linkCount module, based on this returns an assessment result with score.
  *
  * @param {Paper} paper The paper to use for the assessment.
  * @param {Researcher} researcher The researcher used for calling research.
  * @param {Jed} i18n The object used for translations.
  *
  * @returns {Object} The AssessmentResult.
  */


	_createClass(TextCompetingLinksAssessment, [{
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			var assessmentResult = new _AssessmentResult2.default();

			this.linkCount = researcher.getResearch("getLinkStatistics");

			var calculatedResult = this.calculateResult(i18n);

			if ((0, _lodashEs.isUndefined)(calculatedResult)) {
				return assessmentResult;
			}

			assessmentResult.setScore(calculatedResult.score);
			assessmentResult.setText(calculatedResult.resultText);
			assessmentResult.setHasMarks(false);

			return assessmentResult;
		}

		/**
   * Determines if the assessment is applicable to the paper.
   *
   * @param {Paper} paper The paper to check
   *
   * @returns {boolean} Whether the paper has text and a keyword
   */

	}, {
		key: "isApplicable",
		value: function isApplicable(paper) {
			return paper.hasText() && paper.hasKeyword();
		}

		/**
   * Returns a result based on the number of links.
   *
   * @param {Jed} i18n The object used for translations.
   *
   * @returns {Object} ResultObject with score and text.
   */

	}, {
		key: "calculateResult",
		value: function calculateResult(i18n) {
			if (this.linkCount.keyword.totalKeyword > this._config.parameters.recommendedMaximum) {
				return {
					score: this._config.scores.bad,
					resultText: i18n.sprintf(
					/* Translators:  %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext("js-text-analysis", "%1$sLink keyphrase%3$s: " + "You're linking to another page with the words you want this page to rank for. " + "%2$sDon't do that%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}
		}
	}]);

	return TextCompetingLinksAssessment;
}(_assessment2.default);

exports.default = TextCompetingLinksAssessment;
//# sourceMappingURL=TextCompetingLinksAssessment.js.map
