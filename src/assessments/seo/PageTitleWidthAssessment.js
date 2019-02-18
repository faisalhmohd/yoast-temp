"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodashEs = require("lodash");

var _assessment = require("../../assessment");

var _assessment2 = _interopRequireDefault(_assessment);

var _inRange = require("../../helpers/inRange");

var _shortlinker = require("../../helpers/shortlinker");

var _AssessmentResult = require("../../values/AssessmentResult");

var _AssessmentResult2 = _interopRequireDefault(_AssessmentResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var maximumLength = 600;
/**
 * Represents the assessment that will calculate if the width of the page title is correct.
 */

var PageTitleWidthAssesment = function (_Assessment) {
	_inherits(PageTitleWidthAssesment, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {Object} [config] The configuration to use.
  *
  * @returns {void}
  */
	function PageTitleWidthAssesment() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, PageTitleWidthAssesment);

		var _this = _possibleConstructorReturn(this, (PageTitleWidthAssesment.__proto__ || Object.getPrototypeOf(PageTitleWidthAssesment)).call(this));

		var defaultConfig = {
			minLength: 400,
			maxLength: maximumLength,
			scores: {
				noTitle: 1,
				widthTooShort: 6,
				widthTooLong: 3,
				widthCorrect: 9
			},
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34h"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34i")
		};

		_this.identifier = "titleWidth";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Returns the maximum length.
  *
  * @returns {number} The maximum length.
  */


	_createClass(PageTitleWidthAssesment, [{
		key: "getMaximumLength",
		value: function getMaximumLength() {
			return maximumLength;
		}

		/**
   * Runs the pageTitleWidth module, based on this returns an assessment result with score.
   *
   * @param {Paper} paper The paper to use for the assessment.
   * @param {Researcher} researcher The researcher used for calling research.
   * @param {Jed} i18n The object used for translations
   *
   * @returns {AssessmentResult} The assessment result.
   */

	}, {
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			var pageTitleWidth = researcher.getResearch("pageTitleWidth");
			var assessmentResult = new _AssessmentResult2.default();

			assessmentResult.setScore(this.calculateScore(pageTitleWidth));
			assessmentResult.setText(this.translateScore(pageTitleWidth, i18n));

			// Max and actual are used in the snippet editor progress bar.
			assessmentResult.max = this._config.maxLength;
			assessmentResult.actual = pageTitleWidth;
			return assessmentResult;
		}

		/**
   * Returns the score for the pageTitleWidth
   *
   * @param {number} pageTitleWidth The width of the pageTitle.
   *
   * @returns {number} The calculated score.
   */

	}, {
		key: "calculateScore",
		value: function calculateScore(pageTitleWidth) {
			if ((0, _inRange.inRangeEndInclusive)(pageTitleWidth, 1, 400)) {
				return this._config.scores.widthTooShort;
			}

			if ((0, _inRange.inRangeEndInclusive)(pageTitleWidth, this._config.minLength, this._config.maxLength)) {
				return this._config.scores.widthCorrect;
			}

			if (pageTitleWidth > this._config.maxLength) {
				return this._config.scores.widthTooLong;
			}

			return this._config.scores.noTitle;
		}

		/**
   * Translates the pageTitleWidth score to a message the user can understand.
   *
   * @param {number} pageTitleWidth The width of the pageTitle.
   * @param {Jed} i18n The object used for translations.
   *
   * @returns {string} The translated string.
   */

	}, {
		key: "translateScore",
		value: function translateScore(pageTitleWidth, i18n) {
			if ((0, _inRange.inRangeEndInclusive)(pageTitleWidth, 1, 400)) {
				return i18n.sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				i18n.dgettext("js-text-analysis", "%1$sSEO title width%3$s: The SEO title is too short. " + "%2$sUse the space to add keyword variations or create compelling call-to-action copy%3$s."), this._config.urlTitle, this._config.urlCallToAction, "</a>");
			}

			if ((0, _inRange.inRangeEndInclusive)(pageTitleWidth, this._config.minLength, this._config.maxLength)) {
				return i18n.sprintf(
				/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext("js-text-analysis", "%1$sSEO title width%2$s: Good job!"), this._config.urlTitle, "</a>");
			}

			if (pageTitleWidth > this._config.maxLength) {
				return i18n.sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				i18n.dgettext("js-text-analysis", "%1$sSEO title width%3$s: The SEO title wider than the viewable limit. %2$sTry to make it shorter%3$s."), this._config.urlTitle, this._config.urlCallToAction, "</a>");
			}

			return i18n.sprintf(
			/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
			i18n.dgettext("js-text-analysis", "%1$sSEO title width%3$s: %2$sPlease create an SEO title%3$s."), this._config.urlTitle, this._config.urlCallToAction, "</a>");
		}
	}]);

	return PageTitleWidthAssesment;
}(_assessment2.default);

exports.default = PageTitleWidthAssesment;
//# sourceMappingURL=PageTitleWidthAssessment.js.map
