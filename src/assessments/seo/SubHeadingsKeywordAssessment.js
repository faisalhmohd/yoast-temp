"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodashEs = require("lodash");

var _assessment = require("../../assessment");

var _assessment2 = _interopRequireDefault(_assessment);

var _shortlinker = require("../../helpers/shortlinker");

var _inRange = require("../../helpers/inRange.js");

var _getSubheadings = require("../../stringProcessing/getSubheadings");

var _AssessmentResult = require("../../values/AssessmentResult");

var _AssessmentResult2 = _interopRequireDefault(_AssessmentResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Represents the assessment that checks if the keyword is present in one of the subheadings.
 */
var SubHeadingsKeywordAssessment = function (_Assessment) {
	_inherits(SubHeadingsKeywordAssessment, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {object} config The configuration to use.
  *
  * @returns {void}
  */
	function SubHeadingsKeywordAssessment() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, SubHeadingsKeywordAssessment);

		var _this = _possibleConstructorReturn(this, (SubHeadingsKeywordAssessment.__proto__ || Object.getPrototypeOf(SubHeadingsKeywordAssessment)).call(this));

		var defaultConfig = {
			parametersRecalibration: {
				lowerBoundary: 0.3,
				upperBoundary: 0.75
			},
			scoresRegular: {
				noMatches: 6,
				oneMatch: 9,
				multipleMatches: 9
			},
			scoresRecalibration: {
				noMatches: 3,
				tooFewMatches: 3,
				goodNumberOfMatches: 9,
				tooManyMatches: 3
			},
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33m"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33n")
		};

		_this.identifier = "subheadingsKeyword";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Runs the matchKeywordInSubheadings research and based on this returns an assessment result.
  *
  * @param {Paper} paper             The paper to use for the assessment.
  * @param {Researcher} researcher   The researcher used for calling research.
  * @param {Object} i18n             The object used for translations.
  *
  * @returns {AssessmentResult} The assessment result.
  */


	_createClass(SubHeadingsKeywordAssessment, [{
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			this._subHeadings = researcher.getResearch("matchKeywordInSubheadings");

			var assessmentResult = new _AssessmentResult2.default();

			var calculatedResult = void 0;

			if (process.env.YOAST_RECALIBRATION === "enabled") {
				this._minNumberOfSubheadings = Math.ceil(this._subHeadings.count * this._config.parametersRecalibration.lowerBoundary);
				this._maxNumberOfSubheadings = Math.floor(this._subHeadings.count * this._config.parametersRecalibration.upperBoundary);
				calculatedResult = this.calculateResultRecalibration(i18n);
			} else {
				calculatedResult = this.calculateResultRegular(i18n);
			}

			assessmentResult.setScore(calculatedResult.score);
			assessmentResult.setText(calculatedResult.resultText);

			return assessmentResult;
		}

		/**
   * Checks whether the paper has a subheadings.
   *
   * @param {Paper} paper The paper to use for the check.
   *
   * @returns {boolean} True when there is at least one subheading.
   */

	}, {
		key: "hasSubheadings",
		value: function hasSubheadings(paper) {
			var subheadings = process.env.YOAST_RECALIBRATION === "enabled" ? (0, _getSubheadings.getSubheadingsTopLevel)(paper.getText()) : (0, _getSubheadings.getSubheadings)(paper.getText());

			return subheadings.length > 0;
		}

		/**
   * Checks whether the paper has a text and a keyword.
   *
   * @param {Paper} paper The paper to use for the assessment.
   *
   * @returns {boolean} True when there is text and a keyword.
   */

	}, {
		key: "isApplicable",
		value: function isApplicable(paper) {
			return paper.hasText() && paper.hasKeyword() && this.hasSubheadings(paper);
		}

		/**
   * Determines the score and the Result text for the subheadings.
   *
   * @param {Object} i18n The object used for translations.
   *
   * @returns {Object} The object with the calculated score and the result text.
   */

	}, {
		key: "calculateResultRegular",
		value: function calculateResultRegular(i18n) {
			if (this._subHeadings.matches === 1) {
				return {
					score: this._config.scoresRegular.oneMatch,
					resultText: i18n.sprintf(
					/**
      * Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag.
      */
					i18n.dngettext("js-text-analysis", "%1$sKeyword in subheading%2$s: Your subheading reflects the topic of your copy. Good job!"), this._config.urlTitle, "</a>")
				};
			}

			if (this._subHeadings.matches > 1) {
				return {
					score: this._config.scoresRegular.multipleMatches,
					resultText: i18n.sprintf(
					/**
      * Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
      * %3$s expands to the percentage of subheadings that reflect the topic of the copy.
      */
					i18n.dngettext("js-text-analysis", "%1$sKeyword in subheading%2$s: %3$s (out of %4$s) subheadings reflect the topic of your copy. Good job!"), this._config.urlTitle, "</a>", this._subHeadings.matches, this._subHeadings.count)
				};
			}

			return {
				score: this._config.scoresRegular.noMatches,
				resultText: i18n.sprintf(
				/**
     * Translators: %1$s and %2$s expand to a link on yoast.com, %3$s expands to the anchor end tag.
     */
				i18n.dngettext("js-text-analysis", "%1$sKeyword in subheading%3$s: %2$sUse more keywords or synonyms in your subheadings%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
			};
		}

		/**
   * Checks whether there are too few subheadings with the keyphrase.
   *
   * This is the case if the number of subheadings with the keyphrase is more than 0 but less than the specified
   * recommended minimum.
   *
   * @returns {boolean} Returns true if the keyphrase is included in too few subheadings.
   */

	}, {
		key: "hasTooFewMatches",
		value: function hasTooFewMatches() {
			return this._subHeadings.matches > 0 && this._subHeadings.matches < this._minNumberOfSubheadings;
		}

		/**
   * Checks whether there are too many subheadings with the keyphrase.
   *
   * The upper limit is only applicable if there is more than one subheading. If there is only one subheading with
   * the keyphrase this would otherwise always lead to a 100% match rate.
   *
   * @returns {boolean} Returns true if there is more than one subheading and if the keyphrase is included in less
   *                    subheadings than the recommended maximum.
   */

	}, {
		key: "hasTooManyMatches",
		value: function hasTooManyMatches() {
			return this._subHeadings.count > 1 && this._subHeadings.matches > this._maxNumberOfSubheadings;
		}

		/**
   * Checks whether there is only one higher-level subheading and this subheading includes the keyphrase.
   *
   * @returns {boolean} Returns true if there is exactly one higher-level subheading and this
   * subheading has a keyphrase match.
   */

	}, {
		key: "isOneOfOne",
		value: function isOneOfOne() {
			return this._subHeadings.count === 1 && this._subHeadings.matches === 1;
		}

		/**
   * Checks whether there is a good number of subheadings with the keyphrase.
   *
   * This is the case if there is only one subheading and that subheading includes the keyphrase or if the number of
   * subheadings with the keyphrase is within the specified recommended range.
   *
   * @returns {boolean} Returns true if the keyphrase is included in a sufficient number of subheadings.
   */

	}, {
		key: "hasGoodNumberOfMatches",
		value: function hasGoodNumberOfMatches() {
			return (0, _inRange.inRangeStartEndInclusive)(this._subHeadings.matches, this._minNumberOfSubheadings, this._maxNumberOfSubheadings);
		}

		/**
   * Determines the score and the Result text for the subheadings.
   *
   * @param {Object} i18n The object used for translations.
   *
   * @returns {Object} The object with the calculated score and the result text.
   */

	}, {
		key: "calculateResultRecalibration",
		value: function calculateResultRecalibration(i18n) {
			if (this.hasTooFewMatches()) {
				return {
					score: this._config.scoresRecalibration.tooFewMatches,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to a link on yoast.com, %3$s expands to the anchor end tag. */
					i18n.dgettext("js-text-analysis", "%1$sKeyword in subheading%3$s: %2$sUse more keywords or synonyms in your higher-level subheadings%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			if (this.hasTooManyMatches()) {
				return {
					score: this._config.scoresRecalibration.tooManyMatches,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to a link on yoast.com, %3$s expands to the anchor end tag. */
					i18n.dgettext("js-text-analysis", "%1$sKeyword in subheading%3$s: More than 75%% of your higher-level subheadings reflect the topic of your copy. " + "That's too much. %2$sDon't over-optimize%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			if (this.isOneOfOne()) {
				return {
					score: this._config.scoresRecalibration.goodNumberOfMatches,
					resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
     %3$d expands to the number of subheadings containing the keyphrase. */
					i18n.dgettext("js-text-analysis", "%1$sKeyword in subheading%2$s: Your higher-level subheading reflects the topic of your copy. Good job!", this._subHeadings.matches), this._config.urlTitle, "</a>")
				};
			}

			if (this.hasGoodNumberOfMatches()) {
				return {
					score: this._config.scoresRecalibration.goodNumberOfMatches,
					resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
     %3$d expands to the number of subheadings containing the keyphrase. */
					i18n.dngettext("js-text-analysis", "%1$sKeyword in subheading%2$s: %3$s of your higher-level subheadings reflects the topic of your copy. Good job!", "%1$sKeyword in subheading%2$s: %3$s of your higher-level subheadings reflect the topic of your copy. Good job!", this._subHeadings.matches), this._config.urlTitle, "</a>", this._subHeadings.matches)
				};
			}

			return {
				score: this._config.scoresRecalibration.noMatches,
				resultText: i18n.sprintf(
				/* Translators: %1$s and %2$s expand to a link on yoast.com, %3$s expands to the anchor end tag. */
				i18n.dgettext("js-text-analysis", "%1$sKeyword in subheading%3$s: %2$sUse more keywords or synonyms in your higher-level subheadings%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
			};
		}
	}]);

	return SubHeadingsKeywordAssessment;
}(_assessment2.default);

exports.default = SubHeadingsKeywordAssessment;
//# sourceMappingURL=SubHeadingsKeywordAssessment.js.map
