"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = parse;

var _lodashEs = require("lodash");

var _AssessmentResult = require("../../values/AssessmentResult");

var _AssessmentResult2 = _interopRequireDefault(_AssessmentResult);

var _Mark = require("../../values/Mark");

var _Mark2 = _interopRequireDefault(_Mark);

var _Paper = require("../../values/Paper");

var _Paper2 = _interopRequireDefault(_Paper);

var _Participle = require("../../values/Participle");

var _Participle2 = _interopRequireDefault(_Participle);

var _Sentence = require("../../values/Sentence");

var _Sentence2 = _interopRequireDefault(_Sentence);

var _SentencePart = require("../../values/SentencePart");

var _SentencePart2 = _interopRequireDefault(_SentencePart);

var _WordCombination = require("../../values/WordCombination");

var _WordCombination2 = _interopRequireDefault(_WordCombination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PARSE_CLASSES = {
	AssessmentResult: _AssessmentResult2.default,
	Mark: _Mark2.default,
	Paper: _Paper2.default,
	Participle: _Participle2.default,
	Sentence: _Sentence2.default,
	SentencePart: _SentencePart2.default,
	WordCombination: _WordCombination2.default
};

/**
 * Parses a data structure that has previously been serialized.
 *
 * @param {*} thing The data structure to parse.
 *
 * @returns {*} The parsed data structure.
 */
function parse(thing) {
	if ((0, _lodashEs.isArray)(thing)) {
		return thing.map(parse);
	}

	var thingIsObject = (0, _lodashEs.isObject)(thing);

	if (thingIsObject && thing._parseClass && PARSE_CLASSES[thing._parseClass]) {
		return PARSE_CLASSES[thing._parseClass].parse(thing);
	}

	if (thingIsObject) {
		return (0, _lodashEs.mapValues)(thing, function (value) {
			return parse(value);
		});
	}

	return thing;
}
//# sourceMappingURL=parse.js.map
