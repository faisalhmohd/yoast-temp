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
 * Assessment for calculating the outbound links in the text.
 */
var OutboundLinksAssessment = function (_Assessment) {
	_inherits(OutboundLinksAssessment, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {Object} [config] The configuration to use.
  *
  * @returns {void}
  */
	function OutboundLinksAssessment() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, OutboundLinksAssessment);

		var _this = _possibleConstructorReturn(this, (OutboundLinksAssessment.__proto__ || Object.getPrototypeOf(OutboundLinksAssessment)).call(this));

		var defaultConfig = {
			scores: {
				noLinksRegular: 6,
				noLinksRecalibration: 3,
				allNofollowed: 7,
				someNoFollowed: 8,
				allFollowed: 9
			},
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34f"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34g")
		};

		_this.identifier = "externalLinks";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Runs the getLinkStatistics module, based on this returns an assessment result with score.
  *
  * @param {Paper} paper The paper to use for the assessment.
  * @param {Researcher} researcher The researcher used for calling research.
  * @param {Jed} i18n The object used for translations
  *
  * @returns {AssessmentResult} The assessment result.
  */


	_createClass(OutboundLinksAssessment, [{
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			var linkStatistics = researcher.getResearch("getLinkStatistics");
			var assessmentResult = new _AssessmentResult2.default();
			if (!(0, _lodashEs.isEmpty)(linkStatistics)) {
				assessmentResult.setScore(this.calculateScore(linkStatistics));
				assessmentResult.setText(this.translateScore(linkStatistics, i18n));
			}
			return assessmentResult;
		}

		/**
   * Checks whether paper has text.
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
   * Returns a score based on the linkStatistics object.
   *
   * @param {object} linkStatistics The object with all link statistics.
   *
   * @returns {number|null} The calculated score.
   */

	}, {
		key: "calculateScore",
		value: function calculateScore(linkStatistics) {
			if (linkStatistics.externalTotal === 0) {
				if (process.env.YOAST_RECALIBRATION === "enabled") {
					return this._config.scores.noLinksRecalibration;
				}

				return this._config.scores.noLinksRegular;
			}

			if (linkStatistics.externalNofollow === linkStatistics.externalTotal) {
				return this._config.scores.allNofollowed;
			}

			if (linkStatistics.externalDofollow < linkStatistics.externalTotal) {
				return this._config.scores.someNoFollowed;
			}

			if (linkStatistics.externalDofollow === linkStatistics.externalTotal) {
				return this._config.scores.allFollowed;
			}

			return null;
		}

		/**
   * Translates the score to a message the user can understand.
   *
   * @param {Object} linkStatistics The object with all link statistics.
   * @param {Jed} i18n The object used for translations.
   *
   * @returns {string} The translated string.
   */

	}, {
		key: "translateScore",
		value: function translateScore(linkStatistics, i18n) {
			if (linkStatistics.externalTotal === 0) {
				return i18n.sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				i18n.dgettext("js-text-analysis", "%1$sOutbound links%3$s: " + "No outbound links appear in this page. " + "%2$sAdd some%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>");
			}

			if (linkStatistics.externalNofollow === linkStatistics.externalTotal) {
				return i18n.sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				i18n.dgettext("js-text-analysis", "%1$sOutbound links%3$s: " + "All outbound links on this page are nofollowed. " + "%2$sAdd some normal links%3$s."), this._config.urlTitle, this._config.urlCallToAction, "</a>");
			}

			if (linkStatistics.externalDofollow === linkStatistics.externalTotal) {
				return i18n.sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext("js-text-analysis", "%1$sOutbound links%2$s: " + "Good job!"), this._config.urlTitle, "</a>");
			}

			if (linkStatistics.externalDofollow < linkStatistics.externalTotal) {
				return i18n.sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext("js-text-analysis", "%1$sOutbound links%2$s: " + "There are both nofollowed and normal outbound links on this page. " + "Good job!"), this._config.urlTitle, "</a>");
			}

			return "";
		}
	}]);

	return OutboundLinksAssessment;
}(_assessment2.default);

exports.default = OutboundLinksAssessment;
//# sourceMappingURL=OutboundLinksAssessment.js.map
