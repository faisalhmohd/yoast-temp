"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (array, disableWordBoundary) {
	var regexString;
	var _disableWordBoundary = disableWordBoundary || false;

	var boundedArray = (0, _lodashEs.map)(array, function (string) {
		if (_disableWordBoundary) {
			return string;
		}
		return (0, _addWordboundary2.default)(string, true);
	});

	regexString = "(" + boundedArray.join(")|(") + ")";

	return new RegExp(regexString, "ig");
};

var _addWordboundary = require("../stringProcessing/addWordboundary.js");

var _addWordboundary2 = _interopRequireDefault(_addWordboundary);

var _lodashEs = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=createRegexFromArray.js.map
