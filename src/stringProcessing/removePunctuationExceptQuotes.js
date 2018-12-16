"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (text) {
  text = text.replace(punctuationRegexStart, "");
  text = text.replace(punctuationRegexEnd, "");

  return text;
};

// Replace all other punctuation characters at the beginning or at the end of a word.
var punctuationRegexString = "[\\\u2013\\-\\(\\)_\\[\\]\u2019'.?!:;,\xBF\xA1\xAB\xBB\u2039\u203A\u2014\xD7+&<>]+";
var punctuationRegexStart = new RegExp("^" + punctuationRegexString);
var punctuationRegexEnd = new RegExp(punctuationRegexString + "$");

/**
 * Replaces punctuation characters at the beginning and end of a given text string.
 *
 * @param {String} text The text to remove the punctuation characters for.
 *
 * @returns {String} The sanitized text.
 */
//# sourceMappingURL=removePunctuationExceptQuotes.js.map
