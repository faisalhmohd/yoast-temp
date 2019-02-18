"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodashEs = require("lodash");

var _assessment = require("../../assessment");

var _assessment2 = _interopRequireDefault(_assessment);

var _getFunctionWordsLanguages = require("../../helpers/getFunctionWordsLanguages");

var _getFunctionWordsLanguages2 = _interopRequireDefault(_getFunctionWordsLanguages);

var _getLanguage = require("../../helpers/getLanguage");

var _getLanguage2 = _interopRequireDefault(_getLanguage);

var _shortlinker = require("../../helpers/shortlinker");

var _AssessmentResult = require("../../values/AssessmentResult");

var _AssessmentResult2 = _interopRequireDefault(_AssessmentResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Assessment to check whether the keyphrase has a good length.
 */
var KeyphraseLengthAssessment = function (_Assessment) {
	_inherits(KeyphraseLengthAssessment, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {Object} [config] The configuration to use.
  * @param {number} [config.parameters.recommendedMinimum] The recommended minimum length of the keyphrase (in words).
  * @param {number} [config.parameters.acceptableMaximum] The acceptable maximum length of the keyphrase (in words).
  * @param {number} [config.scores.veryBad] The score to return if the length of the keyphrase is below recommended minimum.
  * @param {number} [config.scores.consideration] The score to return if the length of the keyphrase is above acceptable maximum.
  *
  * @returns {void}
  */
	function KeyphraseLengthAssessment() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, KeyphraseLengthAssessment);

		var _this = _possibleConstructorReturn(this, (KeyphraseLengthAssessment.__proto__ || Object.getPrototypeOf(KeyphraseLengthAssessment)).call(this));

		var defaultConfig = {
			parameters: {
				recommendedMinimum: 1,
				recommendedMaximum: 4,
				acceptableMaximum: 8
			},
			parametersNoFunctionWordSupport: {
				recommendedMaximum: 6,
				acceptableMaximum: 9
			},
			scores: {
				veryBad: -999,
				bad: 3,
				okay: 6,
				good: 9
			},
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33i"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/33j"),
			isRelatedKeyphrase: false
		};

		_this.identifier = "keyphraseLength";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Assesses the keyphrase presence and length.
  *
  * @param {Paper} paper The paper to use for the assessment.
  * @param {Researcher} researcher The researcher used for calling research.
  * @param {Jed} i18n The object used for translations.
  *
  * @returns {AssessmentResult} The result of this assessment.
  */


	_createClass(KeyphraseLengthAssessment, [{
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			this._keyphraseLength = researcher.getResearch("keyphraseLength");
			var assessmentResult = new _AssessmentResult2.default();
			this._boundaries = this._config.parameters;

			if (process.env.YOAST_RECALIBRATION === "enabled") {
				var languagesWithFunctionWords = (0, _getFunctionWordsLanguages2.default)();

				// Make the boundaries less strict if the language of the current paper doesn't have function word support.
				if (languagesWithFunctionWords.includes((0, _getLanguage2.default)(paper.getLocale())) === false) {
					this._boundaries = (0, _lodashEs.merge)({}, this._config.parameters, this._config.parametersNoFunctionWordSupport);
				}
			}

			var calculatedResult = this.calculateResult(i18n);

			if (!(0, _lodashEs.isUndefined)(calculatedResult)) {
				assessmentResult.setScore(calculatedResult.score);
				assessmentResult.setText(calculatedResult.resultText);
			}

			return assessmentResult;
		}

		/**
   * Calculates the result based on the keyphraseLength research.
   *
   * @param {Jed} i18n The object used for translations.
   *
   * @returns {Object} Object with score and text.
   */

	}, {
		key: "calculateResult",
		value: function calculateResult(i18n) {
			if (this._keyphraseLength < this._boundaries.recommendedMinimum) {
				if (this._config.isRelatedKeyphrase) {
					return {
						score: this._config.scores.veryBad,
						resultText: i18n.sprintf(
						/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
						i18n.dgettext("js-text-analysis", "%1$sKeyword length%3$s: " + "%2$sSet a keyword in order to calculate your SEO score%3$s."), this._config.urlTitle, this._config.urlCallToAction, "</a>")
					};
				}
				return {
					score: this._config.scores.veryBad,
					resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext("js-text-analysis", "%1$sKeyword length%3$s: No focus keyword was set for this page. " + "%2$sSet a keyword in order to calculate your SEO score%3$s."), this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			if ((0, _lodashEs.inRange)(this._keyphraseLength, this._boundaries.recommendedMinimum, this._boundaries.recommendedMaximum + 1)) {
				return {
					score: this._config.scores.good,
					resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					i18n.dgettext("js-text-analysis", "%1$sKeyword length%2$s: Good job!"), this._config.urlTitle, "</a>")
				};
			}

			if ((0, _lodashEs.inRange)(this._keyphraseLength, this._boundaries.recommendedMaximum + 1, this._boundaries.acceptableMaximum + 1)) {
				return {
					score: this._config.scores.okay,
					resultText: i18n.sprintf(
					/* Translators:
     %1$d expands to the number of words in the keyphrase,
     %2$d expands to the recommended maximum of words in the keyphrase,
     %3$s and %4$s expand to links on yoast.com,
     %5$s expands to the anchor end tag. */
					i18n.dgettext("js-text-analysis", "%3$sKeyword length%5$s: The keyword is %1$d words long. That's more than the recommended maximum of %2$d words. " + "%4$sMake it shorter%5$s!"), this._keyphraseLength, this._boundaries.recommendedMaximum, this._config.urlTitle, this._config.urlCallToAction, "</a>")
				};
			}

			return {
				score: this._config.scores.bad,
				resultText: i18n.sprintf(
				/* Translators:
    %1$d expands to the number of words in the keyphrase,
    %2$d expands to the recommended maximum of words in the keyphrase,
    %3$s and %4$s expand to links on yoast.com,
    %5$s expands to the anchor end tag. */
				i18n.dgettext("js-text-analysis", "%3$sKeyword length%5$s: The keyword is %1$d words long. That's way more than the recommended maximum of %2$d words. " + "%4$sMake it shorter%5$s!"), this._keyphraseLength, this._boundaries.recommendedMaximum, this._config.urlTitle, this._config.urlCallToAction, "</a>")
			};
		}
	}]);

	return KeyphraseLengthAssessment;
}(_assessment2.default);

exports.default = KeyphraseLengthAssessment;
//# sourceMappingURL=KeyphraseLengthAssessment.js.map
