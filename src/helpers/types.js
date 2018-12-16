"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Gets the parsed type name of subjects.
 *
 * @param {array|object|string|number} subject The subject to get the parsed type from.
 * @returns {string} The parsed type name.
 */
var getType = function getType(subject) {
  if (Array.isArray(subject)) {
    return "array";
  }
  return typeof subject === "undefined" ? "undefined" : _typeof(subject);
};

/**
 * Validates the type of subjects. Throws an error if the type is invalid.
 *
 * @param {object} subject The object containing all subjects.
 * @param {string} expectedType The expected type.
 * @returns {boolean} Returns true if types matches expected type. Otherwise returns false.
 */
var isSameType = function isSameType(subject, expectedType) {
  var passedType = getType(subject);
  return passedType === expectedType;
};

exports.getType = getType;
exports.isSameType = isSameType;
exports.default = {
  getType: getType,
  isSameType: isSameType
};
//# sourceMappingURL=types.js.map
