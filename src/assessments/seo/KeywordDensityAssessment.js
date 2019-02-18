"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodashEs = require("lodash");

var _recommendedKeywordCount = require("../../assessmentHelpers/recommendedKeywordCount.js");

var _recommendedKeywordCount2 = _interopRequireDefault(_recommendedKeywordCount);

var _assessment = require("../../assessment");

var _assessment2 = _interopRequireDefault(_assessment);

var _getLanguage = require("../../helpers/getLanguage");

var _getLanguage2 = _interopRequireDefault(_getLanguage);

var _AssessmentResult = require("../../values/AssessmentResult");

var _AssessmentResult2 = _interopRequireDefault(_AssessmentResult);

var _inRange = require("../../helpers/inRange");

var _shortlinker = require("../../helpers/shortlinker");

var _formatNumber = require("../../helpers/formatNumber");

var _formatNumber2 = _interopRequireDefault(_formatNumber);

var _keyphraseLengthFactor = require("../../helpers/keyphraseLengthFactor.js");

var _keyphraseLengthFactor2 = _interopRequireDefault(_keyphraseLengthFactor);

var _countWords = require("../../stringProcessing/countWords");

var _countWords2 = _interopRequireDefault(_countWords);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Represents the assessment that will look if the keyphrase density is within the recommended range.
 */
var KeywordDensityAssessment = function (_Assessment) {
	_inherits(KeywordDensityAssessment, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {Object} [config] The configuration to use.
  * In the regular analysis, if word forms are not available
  * @param {number} [config.parametersRegular.noWordForms.overMaximum] The percentage of keyphrase instances in the text that
  * is way over the maximum.
  * @param {number} [config.parametersRegular.noWordForms.maximum] The maximum percentage of keyphrase instances in the text.
  * @param {number} [config.parametersRegular.noWordForms.minimum] The minimum percentage of keyphrase instances in the text.
  * In the regular analysis, if word forms are available
  * @param {number} [config.parametersRegular.multipleWordForms.overMaximum] The percentage of keyphrase instances in the text that
  * is way over the maximum.
  * @param {number} [config.parametersRegular.multipleWordForms.maximum] The maximum percentage of keyphrase instances in the text.
  * @param {number} [config.parametersRegular.multipleWordForms.minimum] The minimum percentage of keyphrase instances in the text.
  * In the recalibration analysis, if word forms are not available
  * @param {number} [config.parametersRecalibration.noWordForms.overMaximum] The percentage of keyphrase instances in the text that
  * is way over the maximum.
  * @param {number} [config.parametersRecalibration.noWordForms.maximum] The maximum percentage of keyphrase instances in the text.
  * @param {number} [config.parametersRecalibration.noWordForms.minimum] The minimum percentage of keyphrase instances in the text.
  * In the recalibration analysis, if word forms are available
  * @param {number} [config.parametersRecalibration.multipleWordForms.overMaximum] The percentage of keyphrase instances in the text
  * that is way over the maximum.
  * @param {number} [config.parametersRecalibration.multipleWordForms.maximum] The maximum percentage of keyphrase instances in the text.
  * @param {number} [config.parametersRecalibration.multipleWordForms.minimum] The minimum percentage of keyphrase instances in the text.
  * In all analyses
  * @param {number} [config.scores.wayOverMaximum] The score to return if there are way too many instances of keyphrase in the text.
  * @param {number} [config.scores.overMaximum] The score to return if there are too many instances of keyphrase in the text.
  * @param {number} [config.scores.correctDensity] The score to return if there is a good number of keyphrase instances in the text.
  * @param {number} [config.scores.underMinimum] The score to return if there is not enough keyphrase instances in the text.
  * @param {string} [config.url] The URL to the relevant KB article.
  *
  * @returns {void}
  */
	function KeywordDensityAssessment() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, KeywordDensityAssessment);

		var _this = _possibleConstructorReturn(this, (KeywordDensityAssessment.__proto__ || Object.getPrototypeOf(KeywordDensityAssessment)).call(this));

		var defaultConfig = {
			parametersRegular: {
				noWordForms: {
					overMaximum: 3.5,
					maximum: 2.5,
					minimum: 0.5
				},
				multipleWordForms: {
					overMaximum: 3.5,
					maximum: 3.0,
					minimum: 0.5
				}
			},
			parametersRecalibration: {
				noWordForms: {
					overMaximum: 4,
					maximum: 3,
					minimum: 0.5
				},
				multipleWordForms: {
					overMaximum: 4,
					maximum: 3.5,
					minimum: 0.5
				}
			},
			scores: {
				wayOverMaximum: -50,
				overMaximum: -10,
				correctDensity: 9,
				underMinimum: 4
			},
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33v"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33w")
		};

		_this.identifier = "keywordDensity";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Determines correct boundaries depending on the version (Recalibration or regular) and depending on the availability
  * of morphological forms.
  *
  * @param {string} text The paper text.
  * @param {number} keyphraseLength The length of the keyphrase in words.
  *
  * @returns {void}
  */


	_createClass(KeywordDensityAssessment, [{
		key: "setBoundaries",
		value: function setBoundaries(text, keyphraseLength) {
			if (process.env.YOAST_RECALIBRATION === "enabled") {
				if (this._hasMorphologicalForms) {
					this._boundaries = this._config.parametersRecalibration.multipleWordForms;
				} else {
					this._boundaries = this._config.parametersRecalibration.noWordForms;
				}
				this._minRecommendedKeywordCount = (0, _recommendedKeywordCount2.default)(text, keyphraseLength, this._boundaries.minimum, "min");
				this._maxRecommendedKeywordCount = (0, _recommendedKeywordCount2.default)(text, keyphraseLength, this._boundaries.maximum, "max");
			} else {
				if (this._hasMorphologicalForms) {
					this._boundaries = this._config.parametersRegular.multipleWordForms;
				} else {
					this._boundaries = this._config.parametersRegular.noWordForms;
				}
			}
		}

		/**
   * Runs the keyphrase density module, based on this returns an assessment
   * result with score.
   *
   * @param {Paper} paper The paper to use for the assessment.
   * @param {Researcher} researcher The researcher used for calling the
   *                                research.
   * @param {Jed} i18n The object used for translations.
   *
   * @returns {AssessmentResult} The result of the assessment.
   */

	}, {
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			this._hasMorphologicalForms = researcher.getData("morphology") !== false && (0, _getLanguage2.default)(paper.getLocale()) === "en";

			this._keywordCount = researcher.getResearch("keywordCount");
			var keyphraseLength = this._keywordCount.length;

			this.setBoundaries(paper.getText(), keyphraseLength);

			var assessmentResult = new _AssessmentResult2.default();

			this._keywordDensity = researcher.getResearch("getKeywordDensity");

			var calculatedScore = {};

			// Calculate score depending on the version (Recalibration or regular).
			if (process.env.YOAST_RECALIBRATION === "enabled") {
				this._keywordDensity = this._keywordDensity * (0, _keyphraseLengthFactor2.default)(keyphraseLength);
				calculatedScore = this.calculateResultRecalibration(i18n);
			} else {
				calculatedScore = this.calculateResultRegular(i18n);
			}

			assessmentResult.setScore(calculatedScore.score);
			assessmentResult.setText(calculatedScore.resultText);
			assessmentResult.setHasMarks(this._keywordCount.count > 0);

			return assessmentResult;
		}

		/**
   * Checks whether there are no keyphrase matches in the text.
   *
   * @returns {boolean} Returns true if the keyphrase count is 0.
   */

	}, {
		key: "hasNoMatches",
		value: function hasNoMatches() {
			return this._keywordCount.count === 0;
		}

		/**
   * Checks whether there are too few keyphrase matches in the text.
   *
   * @returns {boolean} Returns true if the rounded keyword density is between 0 and the recommended minimum
   * or if there there is only 1 keyword match (regardless of the density).
   */

	}, {
		key: "hasTooFewMatches",
		value: function hasTooFewMatches() {
			return (0, _inRange.inRangeStartInclusive)(this._keywordDensity, 0, this._boundaries.minimum) || this._keywordCount.count === 1;
		}

		/**
   * Checks whether there is a good number of keyphrase matches in the text.
   *
   * @returns {boolean} Returns true if the rounded keyword density is between the recommended minimum
   * and the recommended maximum or if the keyword count is 2 and the recommended minimum is lower than 2.
   */

	}, {
		key: "hasGoodNumberOfMatches",
		value: function hasGoodNumberOfMatches() {
			return (0, _inRange.inRangeStartEndInclusive)(this._keywordDensity, this._boundaries.minimum, this._boundaries.maximum) || this._keywordCount.count === 2 && this._minRecommendedKeywordCount <= 2;
		}

		/**
   * Checks whether the number of keyphrase matches in the text is between the
   * recommended maximum and the specified overMaximum value.
   *
   * @returns {boolean} Returns true if the rounded keyphrase density is between
   *                    the recommended maximum and the specified overMaximum
   *                    value.
   */

	}, {
		key: "hasTooManyMatches",
		value: function hasTooManyMatches() {
			return (0, _inRange.inRangeEndInclusive)(this._keywordDensity, this._boundaries.maximum, this._boundaries.overMaximum);
		}

		/**
   * Returns the score for the keyphrase density (for Regular analysis).
   *
   * @param {Jed} i18n The object used for translations.
   *
   * @returns {Object} The object with calculated score and resultText.
   */

	}, {
		key: "calculateResultRegular",
		value: function calculateResultRegular(i18n) {
			var max = this._boundaries.maximum;
			var maxText = max + "%";
			var roundedKeywordDensity = (0, _formatNumber2.default)(this._keywordDensity);
			var keywordDensityPercentage = roundedKeywordDensity + "%";

			if (this.hasNoMatches()) {
				return {
					score: this._config.scores.underMinimum,
					resultText: i18n.sprintf(
					/* Translators:
     %1$s expands to the keyphrase density percentage,
     %2$d expands to the keyphrase count,
     %3$s and %4$s expand to links to Yoast.com,
     %5$s expands to the anchor end tag. */
					i18n.dgettext("js-text-analysis", "%3$sKeyword density%5$s: %1$s. " + "This is too low; the keyword was found %2$d times. %4$sFocus on your keyword%5$s!"), keywordDensityPercentage, this._keywordCount.count, this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			if (this.hasTooFewMatches()) {
				return {
					score: this._config.scores.underMinimum,
					resultText: i18n.sprintf(
					/* Translators:
     %1$s expands to the keyphrase density percentage,
     %2$d expands to the keyphrase count,
     %3$s and %4$s expand to links to Yoast.com,
     %5$s expands to the anchor end tag. */
					i18n.dngettext("js-text-analysis", "%3$sKeyword density%5$s: %1$s. " + "This is too low; the keyword was found %2$d time. %4$sFocus on your keyword%5$s!", "%3$sKeyword density%5$s: %1$s. " + "This is too low; the keyword was found %2$d times. %4$sFocus on your keyword%5$s!", this._keywordCount.count), keywordDensityPercentage, this._keywordCount.count, this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			if (this.hasGoodNumberOfMatches()) {
				return {
					score: this._config.scores.correctDensity,
					resultText: i18n.sprintf(
					/* Translators:
     %1$s expands to the keyphrase density percentage,
     %2$s expands to a link to Yoast.com,
     %3$s expands to the anchor end tag. */
					i18n.dngettext("js-text-analysis", "%2$sKeyword density%3$s: %1$s. " + "This is great!"), keywordDensityPercentage, this._config.urlTitle, "</a>")
				};
			}

			if (this.hasTooManyMatches()) {
				return {
					score: this._config.scores.overMaximum,
					resultText: i18n.sprintf(
					/* Translators:
     %1$s expands to the keyphrase density percentage,
     %2$d expands to the keyphrase count,
     %3$s expands to the maximum keyphrase density percentage,
     %4$s and %5$s expand to links to Yoast.com,
     %6$s expands to the anchor end tag. */
					i18n.dngettext("js-text-analysis", "%4$sKeyword density%6$s: %1$s. " + "This is over the advised %3$s maximum; the keyword was found %2$d time. " + "%5$sDon't overoptimize%6$s!", "%4$sKeyword density%6$s: %1$s. " + "This is over the advised %3$s maximum; the keyword was found %2$d times. " + "%5$sDon't overoptimize%6$s!", this._keywordCount.count), keywordDensityPercentage, this._keywordCount.count, maxText, this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			// Implicitly returns this if the rounded keyphrase density is higher than overMaximum.
			return {
				score: this._config.scores.wayOverMaximum,
				resultText: i18n.sprintf(
				/* Translators:
    %1$s expands to the keyphrase density percentage,
    %2$d expands to the keyphrase count,
    %3$s expands to the maximum keyphrase density percentage,
    %4$s and %5$s expand to links to Yoast.com,
    %6$s expands to the anchor end tag. */
				i18n.dngettext("js-text-analysis", "%4$sKeyword density%6$s: %1$s. " + "This is way over the advised %3$s maximum; the keyword was found %2$d time. " + "%5$sDon't overoptimize%6$s!", "%4$sKeyword density%6$s: %1$s. " + "This is way over the advised %3$s maximum; the keyword was found %2$d times. " + "%5$sDon't overoptimize%6$s!", this._keywordCount.count), keywordDensityPercentage, this._keywordCount.count, maxText, this._config.urlTitle, this._config.urlCallToAction, "</a>")
			};
		}

		/**
   * Returns the score for the keyphrase density (for Recalibration).
   *
   * @param {Jed} i18n The object used for translations.
   *
   * @returns {Object} The object with calculated score and resultText.
   */

	}, {
		key: "calculateResultRecalibration",
		value: function calculateResultRecalibration(i18n) {
			if (this.hasNoMatches()) {
				return {
					score: this._config.scores.underMinimum,
					resultText: i18n.sprintf(
					/* Translators:
     %1$s and %4$s expand to links to Yoast.com,
     %2$s expands to the anchor end tag,
     %3$d expands to the recommended minimal number of times the keyphrase should occur in the text. */
					i18n.dgettext("js-text-analysis", "%1$sKeyword density%2$s: The focus keyword was found 0 times. " + "That's less than the recommended minimum of %3$d times for a text of this length. " + "%4$sFocus on your keyword%2$s!"), this._config.urlTitle, "</a>", this._minRecommendedKeywordCount, this._config.urlCallToAction)
				};
			}

			if (this.hasTooFewMatches()) {
				return {
					score: this._config.scores.underMinimum,
					resultText: i18n.sprintf(
					/* Translators:
     %1$s and %4$s expand to links to Yoast.com,
     %2$s expands to the anchor end tag,
     %3$d expands to the recommended minimal number of times the keyphrase should occur in the text,
     %5$d expands to the number of times the keyphrase occurred in the text. */
					i18n.dngettext("js-text-analysis", "%1$sKeyword density%2$s: The focus keyword was found %5$d time. That's less than the " + "recommended minimum of %3$d times for a text of this length. %4$sFocus on your keyword%2$s!", "%1$sKeyword density%2$s: The focus keyword was found %5$d times. That's less than the " + "recommended minimum of %3$d times for a text of this length. %4$sFocus on your keyword%2$s!", this._keywordCount.count), this._config.urlTitle, "</a>", this._minRecommendedKeywordCount, this._config.urlCallToAction, this._keywordCount.count)
				};
			}

			if (this.hasGoodNumberOfMatches()) {
				return {
					score: this._config.scores.correctDensity,
					resultText: i18n.sprintf(
					/* Translators:
     %1$s expands to a link to Yoast.com,
     %2$s expands to the anchor end tag,
     %3$d expands to the number of times the keyphrase occurred in the text. */
					i18n.dngettext("js-text-analysis", "%1$sKeyword density%2$s: The focus keyword was found %3$d time. This is great!", "%1$sKeyword density%2$s: The focus keyword was found %3$d times. This is great!", this._keywordCount.count), this._config.urlTitle, "</a>", this._keywordCount.count)
				};
			}

			if (this.hasTooManyMatches()) {
				return {
					score: this._config.scores.overMaximum,
					resultText: i18n.sprintf(
					/* Translators:
     %1$s and %4$s expand to links to Yoast.com,
     %2$s expands to the anchor end tag,
     %3$d expands to the recommended maximal number of times the keyphrase should occur in the text,
     %5$d expands to the number of times the keyphrase occurred in the text. */
					i18n.dngettext("js-text-analysis", "%1$sKeyword density%2$s: The focus keyword was found %5$d time. That's more than the " + "recommended maximum of %3$d times for a text of this length. %4$sDon't overoptimize%2$s!", "%1$sKeyword density%2$s: The focus keyword was found %5$d times. That's more than the " + "recommended maximum of %3$d times for a text of this length. %4$sDon't overoptimize%2$s!", this._keywordCount.count), this._config.urlTitle, "</a>", this._maxRecommendedKeywordCount, this._config.urlCallToAction, this._keywordCount.count)
				};
			}

			// Implicitly returns this if the rounded keyphrase density is higher than overMaximum.
			return {
				score: this._config.scores.wayOverMaximum,
				resultText: i18n.sprintf(
				/* Translators:
    %1$s and %4$s expand to links to Yoast.com,
    %2$s expands to the anchor end tag,
    %3$d expands to the recommended maximal number of times the keyphrase should occur in the text,
    %5$d expands to the number of times the keyphrase occurred in the text. */
				i18n.dngettext("js-text-analysis", "%1$sKeyword density%2$s: The focus keyword was found %5$d time. That's way more than the " + "recommended maximum of %3$d times for a text of this length. %4$sDon't overoptimize%2$s!", "%1$sKeyword density%2$s: The focus keyword was found %5$d times. That's way more than the " + "recommended maximum of %3$d times for a text of this length. %4$sDon't overoptimize%2$s!", this._keywordCount.count), this._config.urlTitle, "</a>", this._maxRecommendedKeywordCount, this._config.urlCallToAction, this._keywordCount.count)
			};
		}

		/**
   * Marks keywords in the text for the keyword density assessment.
   *
   * @returns {Array<Mark>} Marks that should be applied.
   */

	}, {
		key: "getMarks",
		value: function getMarks() {
			return this._keywordCount.markings;
		}

		/**
   * Checks whether the paper has a text with at least 100 words and a keyword
   * is set.
   *
   * @param {Paper} paper The paper to use for the assessment.
   *
   * @returns {boolean} True if applicable.
   */

	}, {
		key: "isApplicable",
		value: function isApplicable(paper) {
			return paper.hasText() && paper.hasKeyword() && (0, _countWords2.default)(paper.getText()) >= 100;
		}
	}]);

	return KeywordDensityAssessment;
}(_assessment2.default);

exports.default = KeywordDensityAssessment;
//# sourceMappingURL=KeywordDensityAssessment.js.map
