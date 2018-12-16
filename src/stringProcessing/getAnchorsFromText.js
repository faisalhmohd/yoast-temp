"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (text) {
	var matches;

	// Regex matches everything between <a> and </a>
	matches = text.match(/<a(?:[^>]+)?>(.*?)<\/a>/ig);

	if (matches === null) {
		matches = [];
	}

	return matches;
};
//# sourceMappingURL=getAnchorsFromText.js.map
