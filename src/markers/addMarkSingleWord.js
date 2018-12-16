"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (text) {
	// Strip the word boundaries at the start of the text.
	var strippedTextStart = (0, _stripWordBoundaries.stripWordBoundariesStart)(text);
	var wordBoundaryStart = "";
	var wordBoundaryEnd = "";

	// Get the actual word boundaries from the start of the text.
	if (strippedTextStart !== text) {
		var wordBoundaryStartIndex = text.search(strippedTextStart);
		wordBoundaryStart = text.substr(0, wordBoundaryStartIndex);
	}

	// Strip word boundaries at the end of the text.
	var strippedTextEnd = (0, _stripWordBoundaries.stripWordBoundariesEnd)(strippedTextStart);
	// Get the actual word boundaries from the end of the text.
	if (strippedTextEnd !== strippedTextStart) {
		var wordBoundaryEndIndex = strippedTextStart.search(strippedTextEnd) + strippedTextEnd.length;
		wordBoundaryEnd = strippedTextStart.substr(wordBoundaryEndIndex);
	}

	return wordBoundaryStart + "<yoastmark class='yoast-text-mark'>" + strippedTextEnd + "</yoastmark>" + wordBoundaryEnd;
};

var _stripWordBoundaries = require("../stringProcessing/stripWordBoundaries");
//# sourceMappingURL=addMarkSingleWord.js.map
