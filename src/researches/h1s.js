"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (paper) {
	var text = paper.getText();

	var blocks = (0, _html.getBlocks)(text);

	var h1s = [];
	blocks.forEach(function (block, index) {
		var match = h1Regex.exec(block);
		if (match) {
			h1s.push({
				tag: "h1",
				content: match[1],
				position: index
			});
		}
	});

	return h1s;
};

var _html = require("../helpers/html");

var h1Regex = /<h1.*?>(.*?)<\/h1>/;

/**
 * Gets all H1s in a text, including their content and their position with regards to other HTML blocks.
 *
 * @param {Paper} paper The paper for which to get the H1s.
 *
 * @returns {Array} An array with all H1s, their content and position.
 */
//# sourceMappingURL=h1s.js.map
