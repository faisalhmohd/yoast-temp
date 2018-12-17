"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sentencePartText, auxiliaries, language) {
  var passive = false;
  var auxiliaryMatches = sentencePartText.match(auxiliaryRegex);
  if (auxiliaryMatches === null) {
    return passive;
  }
  var participles = (0, _getParticiples2.default)(sentencePartText, auxiliaries, language);
  return (0, _determineSentencePartIsPassive2.default)(participles);
};

var _createRegexFromArray = require("../../../stringProcessing/createRegexFromArray.js");

var _createRegexFromArray2 = _interopRequireDefault(_createRegexFromArray);

var _getParticiples = require("./getParticiples.js");

var _getParticiples2 = _interopRequireDefault(_getParticiples);

var _determineSentencePartIsPassive = require("../../passiveVoice/periphrastic/determineSentencePartIsPassive.js");

var _determineSentencePartIsPassive2 = _interopRequireDefault(_determineSentencePartIsPassive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var auxiliaries = require("./auxiliaries.js")().allAuxiliaries;


var auxiliaryRegex = (0, _createRegexFromArray2.default)(auxiliaries);

/**
 * Determines whether a sentence part is passive.
 *
 * @param {string} sentencePartText The sentence part to determine voice for.
 * @param {Array} auxiliaries A list with auxiliaries in this sentence part.
 * @param {string} language The language of the sentence part.

 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
//# sourceMappingURL=determinePassives.js.map
