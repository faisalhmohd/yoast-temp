"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (sentencePartText, sentencePartAuxiliaries, language) {
	var participles = [];
	// For German, Dutch and Polish, this path is taken in order to ensure that sentence parts without auxiliaries are not set to passive.
	if (language === "de" || language === "nl" || language === "pl") {
		// Return false if there are no auxiliaries in the sentence part.
		if (!sentencePartAuxiliaries.some(function (auxiliary) {
			return languageVariables[language].auxiliaries.includes(auxiliary);
		})) {
			return false;
		}
		// For German, we use a separate function to get participles.
		if (language === "de") {
			participles = (0, _getParticiples4.default)(sentencePartText, sentencePartAuxiliaries, language);
		}
		// For Dutch and Polish, we use the same function as for other languages.
		if (language === "nl" || language === "pl") {
			participles = (0, _getParticiples2.default)(sentencePartText, sentencePartAuxiliaries, language);
		}
	} else {
		participles = (0, _getParticiples2.default)(sentencePartText, sentencePartAuxiliaries, language);
	}

	return (0, _determineSentencePartIsPassive2.default)(participles);
};

var _determineSentencePartIsPassive = require("./determineSentencePartIsPassive.js");

var _determineSentencePartIsPassive2 = _interopRequireDefault(_determineSentencePartIsPassive);

var _getParticiples = require("./getParticiples.js");

var _getParticiples2 = _interopRequireDefault(_getParticiples);

var _auxiliaries = require("../../german/passiveVoice/auxiliaries.js");

var _auxiliaries2 = _interopRequireDefault(_auxiliaries);

var _getParticiples3 = require("../../german/passiveVoice/getParticiples.js");

var _getParticiples4 = _interopRequireDefault(_getParticiples3);

var _auxiliaries3 = require("../../dutch/passiveVoice/auxiliaries.js");

var _auxiliaries4 = _interopRequireDefault(_auxiliaries3);

var _auxiliaries5 = require("../../polish/passiveVoice/auxiliaries.js");

var _auxiliaries6 = _interopRequireDefault(_auxiliaries5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var auxiliariesGerman = (0, _auxiliaries2.default)().allAuxiliaries;

// Imports specific for German.


// Imports specific for Dutch.


var auxiliariesDutch = (0, _auxiliaries4.default)();

// Imports specific for Polish.


var auxiliariesPolish = (0, _auxiliaries6.default)();

// The language-specific auxiliaries.
var languageVariables = {
	de: {
		auxiliaries: auxiliariesGerman
	},
	nl: {
		auxiliaries: auxiliariesDutch
	},
	pl: {
		auxiliaries: auxiliariesPolish
	}
};

/**
 * Determines whether a sentence part is passive.
 *
 * @param {string}  sentencePartText        The sentence part to determine voice for.
 * @param {Array}   sentencePartAuxiliaries A list with auxiliaries in this sentence part.
 * @param {string}  language                The language of the sentence part.

 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
//# sourceMappingURL=determinePassiveSentencePart.js.map
