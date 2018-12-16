"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (matchString) {
	var positiveLookAhead = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	var extraWordBoundary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

	var wordBoundary, wordBoundaryStart, wordBoundaryEnd;

	wordBoundary = "[ \\u00a0\xA0\\n\\r\\t.,()\u201D\u201C\u301D\u301E\u301F\u201F\u201E\"+\\-;!\xA1?\xBF:/\xBB\xAB\u2039\u203A" + extraWordBoundary + "<>";
	wordBoundaryStart = "(^|" + wordBoundary + "'‘’‛`])";
	if (positiveLookAhead) {
		wordBoundaryEnd = "($|((?=" + wordBoundary + "]))|((['‘’‛`])(" + wordBoundary + "])))";
	} else {
		wordBoundaryEnd = "($|(" + wordBoundary + "])|((['‘’‛`])(" + wordBoundary + "])))";
	}

	return wordBoundaryStart + matchString + wordBoundaryEnd;
};
//# sourceMappingURL=addWordboundary.js.map
