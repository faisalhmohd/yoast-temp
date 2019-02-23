"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (text) {
  if(text) {
    return text.replace(sentenceTerminators, "");
  }
  return text;
};

// These are sentence terminators, that never should be in the middle of a word.
var sentenceTerminators = /[.?!:;,]/g;

/**
 * Replaces sentence terminators from the text.
 *
 * @param {String} text The text to remove the terminators from.
 *
 * @returns {String} The sanitized text.
 */
//# sourceMappingURL=removeSentenceTerminators.js.map
