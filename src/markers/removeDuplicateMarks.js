"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodashEs = require("lodash");

/**
 * Removes duplicate marks to an array
 *
 * @param {Array} marks The marks to remove duplications to
 * @returns {Array} A list of de-duplicated marks.
 */
function removeDuplicateMarks(marks) {
  return (0, _lodashEs.uniqBy)(marks, function (mark) {
    return mark.getOriginal();
  });
}

exports.default = removeDuplicateMarks;
//# sourceMappingURL=removeDuplicateMarks.js.map
