"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (text) {
	/*
  Matching this in a regex is pretty hard, since we need to find a way for matching the text after a heading, and before the end of the text.
  The hard thing capturing this is with a capture, it captures the next subheading as well, so it skips the next part of the text,
  since the subheading is already matched.
  For now we use this method to be sure we capture the right blocks of text. We remove all | 's to text,
  then replace all headings with a | and split on a |.
  */
	text = text.replace(/\|/ig, "");
	text = text.replace(/<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig, "|");

	var subheadingsTexts = text.split("|");

	if ((0, _lodashEs.isEmpty)(subheadingsTexts[0])) {
		subheadingsTexts.shift();
	}

	return subheadingsTexts;
};

var _lodashEs = require("lodash");
//# sourceMappingURL=getSubheadingTexts.js.map
