"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Result serves as data structure for the AnalysisWorkerWrapper request result.
 */
var Result =
/**
 * Initializes a result.
 *
 * @param {Object} result The result.
 * @param {Object} [data] Optional extra data.
 */
function Result(result) {
	var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	_classCallCheck(this, Result);

	this.result = result;
	this.data = data;
};

exports.default = Result;
//# sourceMappingURL=Result.js.map
