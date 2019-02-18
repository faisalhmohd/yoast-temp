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
 * Assessment to check whether the keyphrase only contains function words.
 */
var FunctionWordsInKeyphraseAssessment = function (_Assessment) {
	_inherits(FunctionWordsInKeyphraseAssessment, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {Object} [config] The configuration to use.
  * @param {number} [config.scores.onlyFunctionWords] The score to return if the keyphrase contains only function words.
  * @param {string} [config.urlTitle] The URL to the relevant KB article.
  * @param {string} [config.urlCallToAction] The URL to the call-to-action article.
  *
  * @returns {void}
  */
	function FunctionWordsInKeyphraseAssessment() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, FunctionWordsInKeyphraseAssessment);

		var _this = _possibleConstructorReturn(this, (FunctionWordsInKeyphraseAssessment.__proto__ || Object.getPrototypeOf(FunctionWordsInKeyphraseAssessment)).call(this));

		var defaultConfig = {
			scores: {
				onlyFunctionWords: 0
			},
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/functionwordskeyphrase-1"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/functionwordskeyphrase-2")
		};

		_this.identifier = "functionWordsInKeyphrase";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Runs the functionWordsInKeyphrase researcher, based on this returns an assessment result with score.
  *
  * @param {Paper} paper The paper to use for the assessment.
  * @param {Researcher} researcher The researcher used for calling research.
  * @param {Jed} i18n The object used for translations.
  *
  * @returns {AssessmentResult} The result of the assessment.
  */


	_createClass(FunctionWordsInKeyphraseAssessment, [{
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			this._functionWordsInKeyphrase = researcher.getResearch("functionWordsInKeyphrase");
			this._keyword = (0, _lodashEs.escape)(paper.getKeyword());
			var assessmentResult = new _AssessmentResult2.default();

			if (this._functionWordsInKeyphrase) {
				assessmentResult.setScore(this._config.scores.onlyFunctionWords);
				assessmentResult.setText(i18n.sprintf(
				/**
     * Translators:
     * %1$s and %2$s expand to links on yoast.com,
     * %3$s expands to the anchor end tag,
     * %4$s expands to the focus keyphrase of the article.
     */
				i18n.dgettext("js-text-analysis", "%1$sFunction words in keyword%3$s: " + "Your keyword \"%4$s\" contains function words only. " + "%2$sLearn more about what makes a good keyword.%3$s"), this._config.urlTitle, this._config.urlCallToAction, "</a>", this._keyword));
			}

			return assessmentResult;
		}

		/**
   * Checks if assessment is applicable to the paper.
   *
   * @param {Paper} paper The paper to be analyzed.
   *
   * @returns {boolean} Whether the paper has keyword.
   */

	}, {
		key: "isApplicable",
		value: function isApplicable(paper) {
			return paper.hasKeyword();
		}
	}]);

	return FunctionWordsInKeyphraseAssessment;
}(_assessment2.default);

exports.default = FunctionWordsInKeyphraseAssessment;
//# sourceMappingURL=FunctionWordsInKeyphraseAssessment.js.map
