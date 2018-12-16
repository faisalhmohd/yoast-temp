"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodashEs = require("lodash");

var _assessment = require("../../assessment");

var _assessment2 = _interopRequireDefault(_assessment);

var _config = require("../../config/config");

var _config2 = _interopRequireDefault(_config);

var _shortlinker = require("../../helpers/shortlinker");

var _AssessmentResult = require("../../values/AssessmentResult");

var _AssessmentResult2 = _interopRequireDefault(_AssessmentResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var maximumMetaDescriptionLength = _config2.default.maxMeta;

/**
 * Assessment for calculating the length of the meta description.
 */

var MetaDescriptionLengthAssessment = function (_Assessment) {
	_inherits(MetaDescriptionLengthAssessment, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {Object} [config] The configuration to use.
  *
  * @returns {void}
  */
	function MetaDescriptionLengthAssessment() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, MetaDescriptionLengthAssessment);

		var _this = _possibleConstructorReturn(this, (MetaDescriptionLengthAssessment.__proto__ || Object.getPrototypeOf(MetaDescriptionLengthAssessment)).call(this));

		var defaultConfig = {
			recommendedMaximumLength: 120,
			maximumLength: maximumMetaDescriptionLength,
			scores: {
				noMetaDescription: 1,
				tooLong: 6,
				tooShort: 6,
				correctLength: 9
			},
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34d"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34e")
		};

		_this.identifier = "metaDescriptionLength";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Returns the maximum length.
  *
  * @returns {number} The maximum length.
  */


	_createClass(MetaDescriptionLengthAssessment, [{
		key: "getMaximumLength",
		value: function getMaximumLength() {
			return this._config.maximumLength;
		}

		/**
   * Runs the metaDescriptionLength module, based on this returns an assessment result with score.
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
			var descriptionLength = researcher.getResearch("metaDescriptionLength");
			var assessmentResult = new _AssessmentResult2.default();

			assessmentResult.setScore(this.calculateScore(descriptionLength));
			assessmentResult.setText(this.translateScore(descriptionLength, i18n));

			// Max and actual are used in the snippet editor progress bar.
			assessmentResult.max = this._config.maximumLength;
			assessmentResult.actual = descriptionLength;

			return assessmentResult;
		}

		/**
   * Returns the score for the descriptionLength.
   *
   * @param {number} descriptionLength The length of the metadescription.
   *
   * @returns {number} The calculated score.
   */

	}, {
		key: "calculateScore",
		value: function calculateScore(descriptionLength) {
			if (descriptionLength === 0) {
				return this._config.scores.noMetaDescription;
			}

			if (descriptionLength <= this._config.recommendedMaximumLength) {
				return this._config.scores.tooShort;
			}

			if (descriptionLength > this._config.maximumLength) {
				return this._config.scores.tooLong;
			}

			if (descriptionLength >= this._config.recommendedMaximumLength && descriptionLength <= this._config.maximumLength) {
				return this._config.scores.correctLength;
			}

			return 0;
		}

		/**
   * Translates the descriptionLength to a message the user can understand.
   *
   * @param {number} descriptionLength The length of the metadescription.
   * @param {object} i18n The object used for translations.
   *
   * @returns {string} The translated string.
   */

	}, {
		key: "translateScore",
		value: function translateScore(descriptionLength, i18n) {
			if (descriptionLength === 0) {
				return i18n.sprintf(
				/* Translators:  %1$s and %2$s expand to a links on yoast.com, %3$s expands to the anchor end tag */
				i18n.dgettext("js-text-analysis", "%1$sMeta description length%3$s:  No meta description has been specified. " + "Search engines will display copy to the page instead. %2$sMake sure to write one%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>");
			}

			if (descriptionLength <= this._config.recommendedMaximumLength) {
				return i18n.sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag,
    %4$d expands to the number of characters in the meta description, %5$d expands to
    the total available number of characters in the meta description */
				i18n.dgettext("js-text-analysis", "%1$sMeta description length%3$s: The meta description is too short (under %4$d characters). " + "Up to %5$d characters are available. %2$sUse the space%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>", this._config.recommendedMaximumLength, this._config.maximumLength);
			}

			if (descriptionLength > this._config.maximumLength) {
				return i18n.sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag,
    %4$d expands to	the total available number of characters in the meta description */
				i18n.dgettext("js-text-analysis", "%1$sMeta description length%3$s: The meta description is over %4$d characters. " + "To ensure the entire description will be visible, %2$syou should reduce the length%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>", this._config.maximumLength);
			}

			if (descriptionLength >= this._config.recommendedMaximumLength && descriptionLength <= this._config.maximumLength) {
				return i18n.sprintf(
				/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext("js-text-analysis", "%1$sMeta description length%2$s: Well done!"), this._config.urlTitle, "</a>");
			}
		}
	}]);

	return MetaDescriptionLengthAssessment;
}(_assessment2.default);

exports.default = MetaDescriptionLengthAssessment;
//# sourceMappingURL=MetaDescriptionLengthAssessment.js.map
