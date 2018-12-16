"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	return [
	// Whitespace is always a word boundary.
	" ", "\\n", "\\r", "\\t",
	// NO-BREAK SPACE.
	"\xA0", " ", ".", ",", "'", "(", ")", "\"", "+", "-", ";", "!", "?", ":", "/", "»", "«", "‹", "›", "<", ">"];
};

;
//# sourceMappingURL=wordBoundaries.js.map
