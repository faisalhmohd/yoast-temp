"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var wordBoundary = "[ \\u00a0\xA0\\n\\r\\t.,'()\"+-;!?:/\xBB\xAB\u2039\u203A<>]";
var wordBoundaryStart = new RegExp("^(" + wordBoundary + "+)", "ig");
var wordBoundaryEnd = new RegExp("(" + wordBoundary + "+$)", "ig");

/**
 * Strip word boundary markers from text in the beginning
 *
 * @param {String} text The text to strip word boundary markers from.
 *
 * @returns {String} The text without double word boundary markers.
 */
var stripWordBoundariesStart = function stripWordBoundariesStart(text) {
  // Remove first character if word boundary
  text = text.replace(wordBoundaryStart, "");

  return text;
};

/**
 * Strip word boundary markers from text in the end
 *
 * @param {String} text The text to strip word boundary markers from.
 *
 * @returns {String} The text without double word boundary markers.
 */
var stripWordBoundariesEnd = function stripWordBoundariesEnd(text) {
  // Remove last character if word boundary
  text = text.replace(wordBoundaryEnd, "");

  return text;
};

/**
 * Strip word boundary markers from text in the beginning and in the end
 *
 * @param {String} text The text to strip word boundary markers from.
 *
 * @returns {String} The text without word boundary markers.
 */
var stripWordBoundariesEverywhere = function stripWordBoundariesEverywhere(text) {
  // Remove first/last character if word boundary
  text = text.replace(wordBoundaryStart, "");
  text = text.replace(wordBoundaryEnd, "");

  return text;
};

exports.stripWordBoundariesStart = stripWordBoundariesStart;
exports.stripWordBoundariesEnd = stripWordBoundariesEnd;
exports.stripWordBoundariesEverywhere = stripWordBoundariesEverywhere;
exports.default = {
  stripWordBoundariesStart: stripWordBoundariesStart,
  stripWordBoundariesEnd: stripWordBoundariesEnd,
  stripWordBoundariesEverywhere: stripWordBoundariesEverywhere
};
//# sourceMappingURL=stripWordBoundaries.js.map
