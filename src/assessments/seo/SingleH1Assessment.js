"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodashEs = require("lodash");

var _assessment = require("../../assessment.js");

var _assessment2 = _interopRequireDefault(_assessment);

var _shortlinker = require("../../helpers/shortlinker");

var _addMark = require("../../markers/addMark.js");

var _addMark2 = _interopRequireDefault(_addMark);

var _AssessmentResult = require("../../values/AssessmentResult.js");

var _AssessmentResult2 = _interopRequireDefault(_AssessmentResult);

var _Mark = require("../../values/Mark.js");

var _Mark2 = _interopRequireDefault(_Mark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Assessment to check whether the body of the text contains H1s in the body (except at the very beginning,
 * where they are acceptable).
 */
var singleH1Assessment = function (_Assessment) {
	_inherits(singleH1Assessment, _Assessment);

	/**
  * Sets the identifier and the config.
  *
  * @param {Object} config The configuration to use.
  *
  * @returns {void}
  */
	function singleH1Assessment() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, singleH1Assessment);

		var _this = _possibleConstructorReturn(this, (singleH1Assessment.__proto__ || Object.getPrototypeOf(singleH1Assessment)).call(this));

		var defaultConfig = {
			scores: {
				textContainsSuperfluousH1: 1
			},
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/3a6"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/3a7")
		};

		_this.identifier = "singleH1";
		_this._config = (0, _lodashEs.merge)(defaultConfig, config);
		return _this;
	}

	/**
  * Runs the h1 research and based on this returns an assessment result with a score.
  *
  * @param {Paper} paper The paper to use for the assessment.
  * @param {Researcher} researcher The researcher used for calling the research.
  * @param {Jed} i18n The object used for translations
  *
  * @returns {AssessmentResult} The assessment result.
  */


	_createClass(singleH1Assessment, [{
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			this._h1s = researcher.getResearch("h1s");

			var assessmentResult = new _AssessmentResult2.default();

			var calculatedResult = this.calculateResult(i18n);

			if (!(0, _lodashEs.isUndefined)(calculatedResult)) {
				assessmentResult.setScore(calculatedResult.score);
				assessmentResult.setText(calculatedResult.resultText);
				assessmentResult.setHasMarks(true);
			}

			return assessmentResult;
		}

		/**
   * Checks whether an H1 is in the first position of the body.
   *
   * @returns {boolean} Returns true if there is an H1 in the first position of the body.
   */

	}, {
		key: "firstH1AtBeginning",
		value: function firstH1AtBeginning() {
			return this._h1s[0].position === 0;
		}

		/**
   * Returns the score and the feedback string for the single H1 assessment.
   *
   * @param {Jed} i18n The object used for translations.
   *
   * @returns {Object|null} The calculated score and the feedback string.
   */

	}, {
		key: "calculateResult",
		value: function calculateResult(i18n) {
			// Returns the default assessment result if there are no H1s in the body.
			if (this._h1s.length === 0) {
				return;
			}

			// Returns the default assessment result if there is one H1 and it's at the beginning of the body.
			if (this._h1s.length === 1 && this.firstH1AtBeginning()) {
				return;
			}

			return {
				score: this._config.scores.textContainsSuperfluousH1,
				resultText: i18n.sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				i18n.dgettext("js-text-analysis", "%1$sSingle title%3$s: H1s should only be used as your main title. Find all H1s in your text " + "that aren't your main title and %2$schange them to a lower heading level%3$s!"), this._config.urlTitle, this._config.urlCallToAction, "</a>")
			};
		}

		/**
   * Marks all H1s in the body of the text (except at the very beginning,
   * where they are acceptable and don't need to be changed).
   *
   * @returns {Array} Array with all the marked H1s.
   */

	}, {
		key: "getMarks",
		value: function getMarks() {
			var h1s = this._h1s;

			/*
    * Removes the first H1 to the array if that H1 is in the first position of the body.
    * The very beginning of the body is the only position where an H1 is deemed acceptable.
    */
			if (this.firstH1AtBeginning()) {
				h1s.shift();
			}

			return (0, _lodashEs.map)(h1s, function (h1) {
				return new _Mark2.default({
					original: "<h1>" + h1.content + "</h1>",
					marked: "<h1>" + (0, _addMark2.default)(h1.content) + "</h1>"
				});
			});
		}

		/**
   * Checks whether the paper has a text.
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
	}]);

	return singleH1Assessment;
}(_assessment2.default);

exports.default = singleH1Assessment;
//# sourceMappingURL=SingleH1Assessment.js.map
