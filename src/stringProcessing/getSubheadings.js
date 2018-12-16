"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Gets all subheadings from the text and returns these in an array.
 *
 * @param {string} text The text to return the headings from.
 *
 * @returns {Array<string[]>} Matches of subheadings in the text, first key is everything including tags,
 *                            second is the heading level, third is the content of the subheading.
 */
function getSubheadings(text) {
	var subheadings = [];
	var regex = /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig;
	var match = void 0;

	while ((match = regex.exec(text)) !== null) {
		subheadings.push(match);
	}

	return subheadings;
}

/**
 * Gets all the level 2 and 3 subheadings from the text and returns these in an array.
 *
 * @param {string} text The text to return the headings from.
 *
 * @returns {Array<string[]>} Matches of subheadings in the text, first key is everything including tags,
 *                            second is the heading level, third is the content of the subheading.
 */
function getSubheadingsTopLevel(text) {
	var subheadings = [];
	var regex = /<h([2-3])(?:[^>]+)?>(.*?)<\/h\1>/ig;
	var match = void 0;

	while ((match = regex.exec(text)) !== null) {
		subheadings.push(match);
	}

	return subheadings;
}

/**
 * Gets the content of subheadings in the text.
 *
 * @param {string} text The text to get the subheading contents from.
 *
 * @returns {string[]} A list of all the subheadings with their content.
 */
function getSubheadingContents(text) {
	var subheadings = getSubheadings(text);

	return subheadings.map(function (subheading) {
		return subheading[0];
	});
}

/**
 * Gets the content of subheadings h2 and h3 in the text.
 *
 * @param {string} text The text to get the subheading contents from.
 *
 * @returns {string[]} A list of all the subheadings with their content.
 */
function getSubheadingContentsTopLevel(text) {
	var subheadings = getSubheadingsTopLevel(text);

	// Only return the entire string matched, not the rest of the outputs of the regex.exec function.
	return subheadings.map(function (subheading) {
		return subheading[0];
	});
}

exports.getSubheadings = getSubheadings;
exports.getSubheadingsTopLevel = getSubheadingsTopLevel;
exports.getSubheadingContents = getSubheadingContents;
exports.getSubheadingContentsTopLevel = getSubheadingContentsTopLevel;
exports.default = {
	getSubheadings: getSubheadings,
	getSubheadingsTopLevel: getSubheadingsTopLevel,
	getSubheadingContents: getSubheadingContents,
	getSubheadingContentsTopLevel: getSubheadingContentsTopLevel
};
//# sourceMappingURL=getSubheadings.js.map
