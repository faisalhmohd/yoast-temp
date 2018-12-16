"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	return {
		en: englishFunctionWords,
		de: germanFunctionWords,
		nl: dutchFunctionWords,
		fr: frenchFunctionWords,
		es: spanishFunctionWords,
		it: italianFunctionWords,
		pt: portugueseFunctionWords,
		ru: russianFunctionWords,
		pl: polishFunctionWords,
		sv: swedishFunctionWords
	};
};

var _functionWords = require("../researches/german/functionWords.js");

var _functionWords2 = _interopRequireDefault(_functionWords);

var _functionWords3 = require("../researches/english/functionWords.js");

var _functionWords4 = _interopRequireDefault(_functionWords3);

var _functionWords5 = require("../researches/dutch/functionWords.js");

var _functionWords6 = _interopRequireDefault(_functionWords5);

var _functionWords7 = require("../researches/spanish/functionWords.js");

var _functionWords8 = _interopRequireDefault(_functionWords7);

var _functionWords9 = require("../researches/italian/functionWords.js");

var _functionWords10 = _interopRequireDefault(_functionWords9);

var _functionWords11 = require("../researches/french/functionWords.js");

var _functionWords12 = _interopRequireDefault(_functionWords11);

var _functionWords13 = require("../researches/portuguese/functionWords.js");

var _functionWords14 = _interopRequireDefault(_functionWords13);

var _functionWords15 = require("../researches/russian/functionWords.js");

var _functionWords16 = _interopRequireDefault(_functionWords15);

var _functionWords17 = require("../researches/polish/functionWords.js");

var _functionWords18 = _interopRequireDefault(_functionWords17);

var _functionWords19 = require("../researches/swedish/functionWords.js");

var _functionWords20 = _interopRequireDefault(_functionWords19);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var germanFunctionWords = (0, _functionWords2.default)(); /*
                                                           * The script collects all the lists of function words per language and returns this collection to a Researcher or a
                                                           * stringProcessing script
                                                           */

var englishFunctionWords = (0, _functionWords4.default)();

var dutchFunctionWords = (0, _functionWords6.default)();

var spanishFunctionWords = (0, _functionWords8.default)();

var italianFunctionWords = (0, _functionWords10.default)();

var frenchFunctionWords = (0, _functionWords12.default)();

var portugueseFunctionWords = (0, _functionWords14.default)();

var russianFunctionWords = (0, _functionWords16.default)();

var polishFunctionWords = (0, _functionWords18.default)();

var swedishFunctionWords = (0, _functionWords20.default)();

/**
 * Returns the function words for all languages.
 *
 * @returns {Object} Function words for all languages.
 */
//# sourceMappingURL=getFunctionWords.js.map
