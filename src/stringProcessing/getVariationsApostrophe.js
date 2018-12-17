"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVariationsApostropheInArray = exports.getVariationsApostrophe = undefined;

var _lodashEs = require("lodash");

/**
 * Checks if the input word contains a normalized or a non-normalized apostrophe.
 * If so generates a complementary form (e.g., "il'y a" > "il’a")
 *
 * @param {string} word The word to check.
 *
 * @returns {Array} All possible variations of the input word.
 */
var getVariationsApostrophe = function getVariationsApostrophe(word) {
  var apostrophes = ["'", "‘", "’", "‛", "`"];

  return (0, _lodashEs.uniq)((0, _lodashEs.flatten)([].concat(apostrophes.map(function (apostropheOuter) {
    return [].concat(apostrophes.map(function (apostropheInner) {
      return word.replace(apostropheOuter, apostropheInner);
    }));
  }))));
};

/**
 * Applies getVariationsApostrophe to an array of strings
 *
 * @param {Array} forms The word to check.
 *
 * @returns {Array} Original array with normalized and non-normalized apostrophes switched.
 */
var getVariationsApostropheInArray = function getVariationsApostropheInArray(forms) {
  return [].concat(forms.map(function (form) {
    return getVariationsApostrophe(form);
  })).filter(Boolean);
};

exports.getVariationsApostrophe = getVariationsApostrophe;
exports.getVariationsApostropheInArray = getVariationsApostropheInArray;
//# sourceMappingURL=getVariationsApostrophe.js.map
