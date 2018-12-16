"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-unused-vars */
/**
 * Represents the defaults of an assessment.
 */
var Assessment = function () {
	function Assessment() {
		_classCallCheck(this, Assessment);
	}

	_createClass(Assessment, [{
		key: "getResult",

		/**
   * Executes the assessment and return its result.
   *
   * @param {Paper} paper The paper to run this assessment on.
   * @param {Researcher} researcher The researcher used for the assessment.
   * @param {object} i18n The i18n-object used for parsing translations.
   *
   * @returns {AssessmentResult} The result of the assessment.
   */
		value: function getResult(paper, researcher, i18n) {
			throw "The method getResult is not implemented";
		}

		/**
   * Checks whether the assessment is applicable
   *
   * @param {Paper} paper The paper to use for the assessment.
   *
   * @returns {boolean} True.
   */

	}, {
		key: "isApplicable",
		value: function isApplicable(paper) {
			return true;
		}
	}]);

	return Assessment;
}();

/* eslint-enable no-unused-vars */

exports.default = Assessment;
//# sourceMappingURL=assessment.js.map
