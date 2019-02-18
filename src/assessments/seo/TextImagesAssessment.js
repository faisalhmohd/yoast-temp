"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodashEs = require("lodash");

var _assessment = require("../../assessment");

var _assessment2 = _interopRequireDefault(_assessment);

var _inRange = require("../../helpers/inRange.js");

var _shortlinker = require("../../helpers/shortlinker");

var _AssessmentResult = require("../../values/AssessmentResult");

var _AssessmentResult2 = _interopRequireDefault(_AssessmentResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Represents the assessment that will look if the images have alt-tags and checks if the keyword is present in one of them.
 */
var TextImagesAssessment = function (_Assessment) {
	_inherits(TextImagesAssessment, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {object} config The configuration to use.
  *
  * @returns {void}
  */
	function TextImagesAssessment() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, TextImagesAssessment);

		var _this = _possibleConstructorReturn(this, (TextImagesAssessment.__proto__ || Object.getPrototypeOf(TextImagesAssessment)).call(this));

		var defaultConfig = {
			parametersRecalibration: {
				lowerBoundary: 0.3,
				upperBoundary: 0.75
			},
			scoresRegular: {
				noImages: 3,
				withAltKeyword: 9,
				withAltNonKeyword: 6,
				withAlt: 6,
				noAlt: 6
			},
			scoresRecalibration: {
				noImages: 3,
				withAltGoodNumberOfKeywordMatches: 9,
				withAltTooFewKeywordMatches: 6,
				withAltTooManyKeywordMatches: 6,
				withAltNonKeyword: 6,
				withAlt: 6,
				noAlt: 6
			},
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33c"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33d")
		};

		_this.identifier = "textImages";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Execute the Assessment and return a result.
  *
  * @param {Paper} paper The Paper object to assess.
  * @param {Researcher} researcher The Researcher object containing all available researches.
  * @param {Jed} i18n The locale object.
  *
  * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
  */


	_createClass(TextImagesAssessment, [{
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			this.imageCount = researcher.getResearch("imageCount");
			this.altProperties = researcher.getResearch("altTagCount");

			var calculatedScore = void 0;
			if (process.env.YOAST_RECALIBRATION === "enabled") {
				this._minNumberOfKeywordMatches = Math.ceil(this.imageCount * this._config.parametersRecalibration.lowerBoundary);
				this._maxNumberOfKeywordMatches = Math.floor(this.imageCount * this._config.parametersRecalibration.upperBoundary);

				calculatedScore = this.calculateResultRecalibration(i18n);
			} else {
				calculatedScore = this.calculateResultRegular(i18n);
			}

			var assessmentResult = new _AssessmentResult2.default();
			assessmentResult.setScore(calculatedScore.score);
			assessmentResult.setText(calculatedScore.resultText);

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
   * Calculate the score and the feedback string based on the current image count and current image alt-tag count.
   *
   * @param {Jed} i18n The object used for translations.
   *
   * @returns {Object} The calculated score and the feedback string.
   */

	}, {
		key: "calculateResultRegular",
		value: function calculateResultRegular(i18n) {
			if (this.imageCount === 0) {
				return {
					score: this._config.scoresRegular.noImages,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext("js-text-analysis", "%1$sImage alt attributes%3$s: No images appear on this page. %2$sAdd some%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			// Has alt-tag and keywords
			if (this.altProperties.withAltKeyword > 0) {
				return {
					score: this._config.scoresRegular.withAltKeyword,
					resultText: i18n.sprintf(
					/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
					i18n.dgettext("js-text-analysis", "%1$sImage alt attributes%2$s: " + "Some images on this page contain alt attributes with words to your keyword! Good job!"), this._config.urlTitle, "</a>")
				};
			}

			// Has alt-tag, but no keywords and it's not okay
			if (this.altProperties.withAltNonKeyword > 0) {
				return {
					score: this._config.scoresRegular.withAltNonKeyword,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext("js-text-analysis", "%1$sImage alt attributes%3$s: " + "Images on this page do not have alt attributes with words to your keyword. %2$sFix that%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			// Has alt-tag, but no keyword is set
			if (this.altProperties.withAlt > 0) {
				return {
					score: this._config.scoresRegular.withAlt,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext("js-text-analysis", "%1$sImage alt attributes%3$s: " + "Images on this page do not have alt attributes with words to your keyword. %2$sFix that%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			// Has no alt-tag
			if (this.altProperties.noAlt > 0) {
				return {
					score: this._config.scoresRegular.noAlt,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext("js-text-analysis", "%1$sImage alt attributes%3$s: " + "Images on this page do not have alt attributes with words to your keyword. %2$sFix that%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}
			return null;
		}

		/**
   * Checks whether there are too few alt tags with keywords. This check is applicable when there are
   * 5 or more images.
   *
   * @returns {boolean} Returns true if there are at least 5 images and the number of alt tags
   * with keywords is under the specified recommended minimum.
   */

	}, {
		key: "hasTooFewMatches",
		value: function hasTooFewMatches() {
			return this.imageCount > 4 && this.altProperties.withAltKeyword > 0 && this.altProperties.withAltKeyword < this._minNumberOfKeywordMatches;
		}

		/**
   * Checks whether there is a sufficient number of alt tags with keywords. There are different recommended
   * ranges for less than 5 keywords, exactly 5 keywords, and more than 5 keywords.
   *
   * @returns {boolean} Returns true if the number of alt tags with keywords is within the recommended range.
   */

	}, {
		key: "hasGoodNumberOfMatches",
		value: function hasGoodNumberOfMatches() {
			return this.imageCount < 5 && this.altProperties.withAltKeyword > 0 || this.imageCount === 5 && (0, _inRange.inRangeStartEndInclusive)(this.altProperties.withAltKeyword, 2, 4) || this.imageCount > 4 && (0, _inRange.inRangeStartEndInclusive)(this.altProperties.withAltKeyword, this._minNumberOfKeywordMatches, this._maxNumberOfKeywordMatches);
		}

		/**
   * Checks whether there is a sufficient number of alt tags with keywords. This check is applicable when there are
   * 5 or more images.
   *
   * @returns {boolean} Returns true if there are at least 5 images and the number of alt tags with keywords
   * is within the recommended range.
   */

	}, {
		key: "hasTooManyMatches",
		value: function hasTooManyMatches() {
			return this.imageCount > 4 && this.altProperties.withAltKeyword > this._maxNumberOfKeywordMatches;
		}

		/**
   * Calculate the result based on the current image count and current image alt-tag count.
   *
   * @param {Object} i18n The object used for translations.
   *
   * @returns {Object} The calculated result.
   */

	}, {
		key: "calculateResultRecalibration",
		value: function calculateResultRecalibration(i18n) {
			// No images.
			if (this.imageCount === 0) {
				return {
					score: this._config.scoresRecalibration.noImages,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext("js-text-analysis", "%1$sImage alt attributes%3$s: No images appear on this page. %2$sAdd some%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			// Has alt-tags, but no keyword is set.
			if (this.altProperties.withAlt > 0) {
				return {
					score: this._config.scoresRecalibration.withAlt,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext("js-text-analysis", "%1$sImage alt attributes%3$s: " + "Images on this page have alt attributes, but you have not set your keyword. %2$sFix that%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			// Has alt-tags, but no keywords while a keyword is set.
			if (this.altProperties.withAltNonKeyword > 0 && this.altProperties.withAltKeyword === 0) {
				return {
					score: this._config.scoresRecalibration.withAltNonKeyword,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext("js-text-analysis", "%1$sImage alt attributes%3$s: " + "Images on this page do not have alt attributes that reflect the topic of your text. " + "%2$sAdd your keyword or synonyms to the alt tags of relevant images%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			// Image count ≥5, has alt-tags with too few keywords.
			if (this.hasTooFewMatches()) {
				return {
					score: this._config.scoresRecalibration.withAltTooFewKeywordMatches,
					resultText: i18n.sprintf(
					/* Translators: %1$d expands to the number of images containing an alt attribute with the keyword,
      * %2$d expands to the total number of images, %3$s and %4$s expand to links on yoast.com,
      * %5$s expands to the anchor end tag. */
					i18n.dngettext("js-text-analysis", "%3$sImage alt attributes%5$s: Out of %2$d images on this page, only %1$d has an alt attribute that " + "reflects the topic of your text. " + "%4$sAdd your keyword or synonyms to the alt tags of more relevant images%5$s!", "%3$sImage alt attributes%5$s: Out of %2$d images on this page, only %1$d have alt attributes that " + "reflect the topic of your text. " + "%4$sAdd your keyword or synonyms to the alt tags of more relevant images%5$s!", this.altProperties.withAltKeyword), this.altProperties.withAltKeyword, this.imageCount, this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			/*
    * The hasGoodNumberOfMatches check needs to be made before the check for too many matches because of the special rule for
    * exactly 5 matches.
    */
			if (this.hasGoodNumberOfMatches()) {
				return {
					score: this._config.scoresRecalibration.withAltGoodNumberOfKeywordMatches,
					resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com,
      * %2$s expands to the anchor end tag. */
					i18n.dgettext("js-text-analysis", "%1$sImage alt attributes%2$s: Good job!"), this._config.urlTitle, "</a>")
				};
			}

			if (this.hasTooManyMatches()) {
				return {
					score: this._config.scoresRecalibration.withAltTooManyKeywordMatches,
					resultText: i18n.sprintf(
					/* Translators: %1$d expands to the number of images containing an alt attribute with the keyword,
                     * %2$d expands to the total number of images, %3$s and %4$s expand to a link on yoast.com,
      * %5$s expands to the anchor end tag. */
					i18n.dgettext("js-text-analysis", "%3$sImage alt attributes%5$s: Out of %2$d images on this page, %1$d have alt attributes with " + "words to your keyword or synonyms. " + "That's a bit much. %4$sOnly include the keyword or its synonyms when it really fits the image%5$s."), this.altProperties.withAltKeyword, this.imageCount, this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			// Images, but no alt tags.
			return {
				score: this._config.scoresRecalibration.noAlt,
				resultText: i18n.sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				i18n.dgettext("js-text-analysis", "%1$sImage alt attributes%3$s: " + "Images on this page do not have alt attributes that reflect the topic of your text. " + "%2$sAdd your keyword or synonyms to the alt tags of relevant images%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
			};
		}
	}]);

	return TextImagesAssessment;
}(_assessment2.default);

exports.default = TextImagesAssessment;
//# sourceMappingURL=TextImagesAssessment.js.map
