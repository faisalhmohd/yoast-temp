"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (paper) {
	var text = paper.getText();
	var matches = (0, _getSubheadingTexts2.default)(text);

	var subHeadingTexts = [];
	(0, _lodashEs.forEach)(matches, function (subHeading) {
		subHeadingTexts.push({
			text: subHeading,
			wordCount: (0, _countWords2.default)(subHeading)
		});
	});
	return subHeadingTexts;
};

var _getSubheadingTexts = require("../stringProcessing/getSubheadingTexts");

var _getSubheadingTexts2 = _interopRequireDefault(_getSubheadingTexts);

var _countWords = require("../stringProcessing/countWords");

var _countWords2 = _interopRequireDefault(_countWords);

var _lodashEs = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=getSubheadingTextLengths.js.map
