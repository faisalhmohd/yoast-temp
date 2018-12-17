"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodashEs = require("lodash");

var _assessment = require("../../assessment");

var _assessment2 = _interopRequireDefault(_assessment);

var _inRange = require("../../helpers/inRange");

var _isValueTooLong = require("../../helpers/isValueTooLong");

var _isValueTooLong2 = _interopRequireDefault(_isValueTooLong);

var _shortlinker = require("../../helpers/shortlinker");

var _getSubheadings = require("../../stringProcessing/getSubheadings");

var _getWords = require("../../stringProcessing/getWords");

var _getWords2 = _interopRequireDefault(_getWords);

var _AssessmentResult = require("../../values/AssessmentResult");

var _AssessmentResult2 = _interopRequireDefault(_AssessmentResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Represents the assessment for calculating the text after each subheading.
 */
var SubheadingsDistributionTooLong = function (_Assessment) {
	_inherits(SubheadingsDistributionTooLong, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {Object} config The configuration to use.
  * @returns {void}
  */
	function SubheadingsDistributionTooLong() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, SubheadingsDistributionTooLong);

		var _this = _possibleConstructorReturn(this, (SubheadingsDistributionTooLong.__proto__ || Object.getPrototypeOf(SubheadingsDistributionTooLong)).call(this));

		var defaultConfig = {
			parameters: {
				// The maximum recommended value of the subheading text.
				recommendedMaximumWordCount: 300,
				slightlyTooMany: 300,
				farTooMany: 350
			},
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34x"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34y"),
			scores: {
				goodShortTextNoSubheadings: 9,
				goodSubheadings: 9,
				okSubheadings: 6,
				badSubheadings: 3,
				badLongTextNoSubheadings: 2
			}
		};

		_this.identifier = "subheadingsTooLong";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Runs the getSubheadingTextLength research and checks scores based on length.
  *
  * @param {Paper} paper The paper to use for the assessment.
  * @param {Researcher} researcher The researcher used for calling research.
  * @param {Object} i18n The object used for translations.
  *
  * @returns {AssessmentResult} The assessment result.
  */


	_createClass(SubheadingsDistributionTooLong, [{
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			this._subheadingTextsLength = researcher.getResearch("getSubheadingTextLengths");

			this._subheadingTextsLength = this._subheadingTextsLength.sort(function (a, b) {
				return b.wordCount - a.wordCount;
			});

			this._tooLongTextsNumber = this.getTooLongSubheadingTexts().length;

			var assessmentResult = new _AssessmentResult2.default();
			assessmentResult.setIdentifier(this.identifier);

			this._hasSubheadings = this.hasSubheadings(paper);

			this._textLength = (0, _getWords2.default)(paper.getText()).length;

			var calculatedResult = this.calculateResult(i18n);
			calculatedResult.resultTextPlural = calculatedResult.resultTextPlural || "";
			assessmentResult.setScore(calculatedResult.score);
			assessmentResult.setText(calculatedResult.resultText);

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
   * Checks whether the paper has subheadings.
   *
   * @param {Paper} paper The paper to use for the assessment.
   *
   * @returns {boolean} True when there is at least one subheading.
   */

	}, {
		key: "hasSubheadings",
		value: function hasSubheadings(paper) {
			var subheadings = (0, _getSubheadings.getSubheadings)(paper.getText());
			return subheadings.length > 0;
		}

		/**
   * Counts the number of subheading texts that are too long.
   *
   * @returns {number} The number of subheading texts that are too long.
   */

	}, {
		key: "getTooLongSubheadingTexts",
		value: function getTooLongSubheadingTexts() {
			return (0, _lodashEs.filter)(this._subheadingTextsLength, function (subheading) {
				return (0, _isValueTooLong2.default)(this._config.parameters.recommendedMaximumWordCount, subheading.wordCount);
			}.bind(this));
		}

		/**
   * Calculates the score and creates a feedback string based on the subheading texts length.
   *
   * @param {Object} i18n The object used for translations.
   *
   * @returns {Object} The calculated result.
   */

	}, {
		key: "calculateResult",
		value: function calculateResult(i18n) {
			if (this._textLength > 300) {
				if (this._hasSubheadings) {
					var longestSubheadingTextLength = this._subheadingTextsLength[0].wordCount;
					if (longestSubheadingTextLength <= this._config.parameters.slightlyTooMany) {
						// Green indicator.
						return {
							score: this._config.scores.goodSubheadings,
							resultText: i18n.sprintf(
							// Translators: %1$s expands to a link to https://yoa.st/headings, %2$s expands to the link closing tag.
							i18n.dgettext("js-text-analysis", "%1$sSubheading distribution%2$s: Great job!"), this._config.urlTitle, "</a>")
						};
					}

					if ((0, _inRange.inRangeEndInclusive)(longestSubheadingTextLength, this._config.parameters.slightlyTooMany, this._config.parameters.farTooMany)) {
						// Orange indicator.
						return {
							score: this._config.scores.okSubheadings,
							resultText: i18n.sprintf(
							/*
        * Translators: %1$s and %5$s expand to a link on yoast.com, %3$d to the number of text sections
        * not separated by subheadings, %4$d expands to the recommended number of words following a
        * subheading, %2$s expands to the link closing tag.
        */
							i18n.dngettext("js-text-analysis", "%1$sSubheading distribution%2$s: %3$d section of your text is longer than %4$d words and" + " is not separated by any subheadings. %5$sAdd subheadings to improve readability%2$s.", "%1$sSubheading distribution%2$s: %3$d sections of your text are longer than %4$d words " + "and are not separated by any subheadings. %5$sAdd subheadings to improve readability%2$s.", this._tooLongTextsNumber), this._config.urlTitle, "</a>", this._tooLongTextsNumber, this._config.parameters.recommendedMaximumWordCount, this._config.urlCallToAction)
						};
					}

					// Red indicator.
					return {
						score: this._config.scores.badSubheadings,
						resultText: i18n.sprintf(
						/* Translators: %1$s and %5$s expand to a link on yoast.com, %3$d to the number of text sections
      not separated by subheadings, %4$d expands to the recommended number of words following a
      subheading, %2$s expands to the link closing tag. */
						i18n.dngettext("js-text-analysis", "%1$sSubheading distribution%2$s: %3$d section of your text is longer than %4$d words and" + " is not separated by any subheadings. %5$sAdd subheadings to improve readability%2$s.", "%1$sSubheading distribution%2$s: %3$d sections of your text are longer than %4$d words " + "and are not separated by any subheadings. %5$sAdd subheadings to improve readability%2$s.", this._tooLongTextsNumber), this._config.urlTitle, "</a>", this._tooLongTextsNumber, this._config.parameters.recommendedMaximumWordCount, this._config.urlCallToAction)
					};
				}
				// Red indicator, use '2' so we can differentiate in external analysis.
				return {
					score: this._config.scores.badLongTextNoSubheadings,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %3$s expand to a link to https://yoa.st/headings, %2$s expands to the link closing tag. */
					i18n.dgettext("js-text-analysis", "%1$sSubheading distribution%2$s: You are not using any subheadings, although your text is rather long." + " %3$sTry and add some subheadings%2$s."), this._config.urlTitle, "</a>", this._config.urlCallToAction)
				};
			}
			if (this._hasSubheadings) {
				// Green indicator.
				return {
					score: this._config.scores.goodSubheadings,
					resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link to https://yoa.st/headings, %2$s expands to the link closing tag. */
					i18n.dgettext("js-text-analysis", "%1$sSubheading distribution%2$s: Great job!"), this._config.urlTitle, "</a>")
				};
			}
			// Green indicator.
			return {
				score: this._config.scores.goodShortTextNoSubheadings,
				resultText: i18n.sprintf(
				/* Translators: %1$s expands to a link to https://yoa.st/headings, %2$s expands to the link closing tag. */
				i18n.dgettext("js-text-analysis", "%1$sSubheading distribution%2$s: You are not using any subheadings, but your text is short enough" + " and probably doesn't need them."), this._config.urlTitle, "</a>")
			};
		}
	}]);

	return SubheadingsDistributionTooLong;
}(_assessment2.default);

exports.default = SubheadingsDistributionTooLong;
//# sourceMappingURL=subheadingDistributionTooLongAssessment.js.map
