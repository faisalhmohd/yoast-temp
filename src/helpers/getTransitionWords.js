"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (locale) {
	switch ((0, _getLanguage2.default)(locale)) {
		case "de":
			return {
				transitionWords: transitionWordsGerman,
				twoPartTransitionWords: _twoPartTransitionWords4.default
			};
		case "es":
			return {
				transitionWords: transitionWordsSpanish,
				twoPartTransitionWords: _twoPartTransitionWords8.default
			};
		case "fr":
			return {
				transitionWords: transitionWordsFrench,
				twoPartTransitionWords: _twoPartTransitionWords6.default
			};
		case "nl":
			return {
				transitionWords: transitionWordsDutch,
				twoPartTransitionWords: _twoPartTransitionWords10.default
			};
		case "it":
			return {
				transitionWords: transitionWordsItalian,
				twoPartTransitionWords: _twoPartTransitionWords12.default
			};
		case "pt":
			return {
				transitionWords: transitionWordsPortuguese,
				twoPartTransitionWords: _twoPartTransitionWords14.default
			};
		case "ru":
			return {
				transitionWords: transitionWordsRussian,
				twoPartTransitionWords: _twoPartTransitionWords16.default
			};
		case "ca":
			return {
				transitionWords: transitionWordsCatalan,
				twoPartTransitionWords: _twoPartTransitionWords18.default
			};
		case "pl":
			return {
				transitionWords: transitionWordsPolish,
				twoPartTransitionWords: _twoPartTransitionWords20.default
			};
		case "sv":
			return {
				transitionWords: transitionWordsSwedish,
				twoPartTransitionWords: _twoPartTransitionWords22.default
			};
		default:
		case "en":
			return {
				transitionWords: transitionWordsEnglish,
				twoPartTransitionWords: _twoPartTransitionWords2.default
			};
	}
};

var _transitionWords = require("../researches/english/transitionWords.js");

var _transitionWords2 = _interopRequireDefault(_transitionWords);

var _twoPartTransitionWords = require("../researches/english/twoPartTransitionWords.js");

var _twoPartTransitionWords2 = _interopRequireDefault(_twoPartTransitionWords);

var _transitionWords3 = require("../researches/german/transitionWords.js");

var _transitionWords4 = _interopRequireDefault(_transitionWords3);

var _twoPartTransitionWords3 = require("../researches/german/twoPartTransitionWords.js");

var _twoPartTransitionWords4 = _interopRequireDefault(_twoPartTransitionWords3);

var _transitionWords5 = require("../researches/french/transitionWords.js");

var _transitionWords6 = _interopRequireDefault(_transitionWords5);

var _twoPartTransitionWords5 = require("../researches/french/twoPartTransitionWords.js");

var _twoPartTransitionWords6 = _interopRequireDefault(_twoPartTransitionWords5);

var _transitionWords7 = require("../researches/spanish/transitionWords.js");

var _transitionWords8 = _interopRequireDefault(_transitionWords7);

var _twoPartTransitionWords7 = require("../researches/spanish/twoPartTransitionWords.js");

var _twoPartTransitionWords8 = _interopRequireDefault(_twoPartTransitionWords7);

var _transitionWords9 = require("../researches/dutch/transitionWords.js");

var _transitionWords10 = _interopRequireDefault(_transitionWords9);

var _twoPartTransitionWords9 = require("../researches/dutch/twoPartTransitionWords.js");

var _twoPartTransitionWords10 = _interopRequireDefault(_twoPartTransitionWords9);

var _transitionWords11 = require("../researches/italian/transitionWords.js");

var _transitionWords12 = _interopRequireDefault(_transitionWords11);

var _twoPartTransitionWords11 = require("../researches/italian/twoPartTransitionWords.js");

var _twoPartTransitionWords12 = _interopRequireDefault(_twoPartTransitionWords11);

var _transitionWords13 = require("../researches/portuguese/transitionWords.js");

var _transitionWords14 = _interopRequireDefault(_transitionWords13);

var _twoPartTransitionWords13 = require("../researches/portuguese/twoPartTransitionWords.js");

var _twoPartTransitionWords14 = _interopRequireDefault(_twoPartTransitionWords13);

var _transitionWords15 = require("../researches/russian/transitionWords.js");

var _transitionWords16 = _interopRequireDefault(_transitionWords15);

var _twoPartTransitionWords15 = require("../researches/russian/twoPartTransitionWords.js");

var _twoPartTransitionWords16 = _interopRequireDefault(_twoPartTransitionWords15);

var _transitionWords17 = require("../researches/catalan/transitionWords.js");

var _transitionWords18 = _interopRequireDefault(_transitionWords17);

var _twoPartTransitionWords17 = require("../researches/catalan/twoPartTransitionWords.js");

var _twoPartTransitionWords18 = _interopRequireDefault(_twoPartTransitionWords17);

var _transitionWords19 = require("../researches/polish/transitionWords.js");

var _transitionWords20 = _interopRequireDefault(_transitionWords19);

var _twoPartTransitionWords19 = require("../researches/polish/twoPartTransitionWords.js");

var _twoPartTransitionWords20 = _interopRequireDefault(_twoPartTransitionWords19);

var _transitionWords21 = require("../researches/swedish/transitionWords.js");

var _transitionWords22 = _interopRequireDefault(_transitionWords21);

var _twoPartTransitionWords21 = require("../researches/swedish/twoPartTransitionWords.js");

var _twoPartTransitionWords22 = _interopRequireDefault(_twoPartTransitionWords21);

var _getLanguage = require("./getLanguage.js");

var _getLanguage2 = _interopRequireDefault(_getLanguage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transitionWordsEnglish = (0, _transitionWords2.default)().allWords;

var transitionWordsGerman = (0, _transitionWords4.default)().allWords;

var transitionWordsFrench = (0, _transitionWords6.default)().allWords;

var transitionWordsSpanish = (0, _transitionWords8.default)().allWords;

var transitionWordsDutch = (0, _transitionWords10.default)().allWords;

var transitionWordsItalian = (0, _transitionWords12.default)().allWords;

var transitionWordsPortuguese = (0, _transitionWords14.default)().allWords;

var transitionWordsRussian = (0, _transitionWords16.default)().allWords;

var transitionWordsCatalan = (0, _transitionWords18.default)().allWords;

var transitionWordsPolish = (0, _transitionWords20.default)().allWords;

var transitionWordsSwedish = (0, _transitionWords22.default)().allWords;

/**
 * Returns transition words for a specific locale.
 *
 * @param {string} locale The locale to return function words for.
 *
 * @returns {Object} The function words for a locale.
 */
//# sourceMappingURL=getTransitionWords.js.map
