"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sentenceText, language) {
  return determineSentenceIsPassive(sentenceText, language);
};

var _lodashEs = require("lodash");

var _getWords = require("../../../stringProcessing/getWords.js");

var _getWords2 = _interopRequireDefault(_getWords);

var _participlesShortenedList = require("../../russian/passiveVoice/participlesShortenedList.js");

var _participlesShortenedList2 = _interopRequireDefault(_participlesShortenedList);

var _participles = require("../../swedish/passiveVoice/participles.js");

var _participles2 = _interopRequireDefault(_participles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getPassiveVerbsRussian = (0, _participlesShortenedList2.default)().all;

// Verb-form lists per language

var getPassiveVerbsSwedish = (0, _participles2.default)().all;

/**
 * Matches the sentence against passive verbs.
 *
 * @param {string} sentence The sentence to match against.
 * @param {Array} passiveVerbs The array containing passive verb-forms.
 * @returns {Array} The found passive verbs.
 */
var matchPassiveVerbs = function matchPassiveVerbs(sentence, passiveVerbs) {
  return (0, _lodashEs.filter)((0, _getWords2.default)(sentence), function (word) {
    return passiveVerbs.includes(word.toLocaleLowerCase());
  });
};

/**
 * Checks the passed sentences to see if they contain passive verb-forms.
 *
 * @param {string} sentence The sentence to match against.
 * @param {string} language The language of the text.
 * @returns {Array} The list of encountered passive verbs.
 */
var determineSentenceIsPassive = function determineSentenceIsPassive(sentence, language) {
  var passiveVerbs = [];

  switch (language) {
    case "ru":
      passiveVerbs = getPassiveVerbsRussian;
      break;
    case "sv":
      passiveVerbs = getPassiveVerbsSwedish;
      break;
  }
  return matchPassiveVerbs(sentence, passiveVerbs).length !== 0;
};

/**
 * Determines whether a sentence is passive.
 *
 * @param {string} sentenceText The sentence to determine voice for.
 * @param {string} language The language of the sentence part.

 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
//# sourceMappingURL=determinePassiveSentence.js.map
