"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (locale) {
	switch ((0, _getLanguage2.default)(locale)) {
		case "de":
			return _firstWordExceptions4.default;
		case "fr":
			return _firstWordExceptions8.default;
		case "es":
			return _firstWordExceptions6.default;
		case "nl":
			return _firstWordExceptions10.default;
		case "it":
			return _firstWordExceptions12.default;
		case "ru":
			return _firstWordExceptions14.default;
		case "pl":
			return _firstWordExceptions16.default;
		case "sv":
			return _firstWordExceptions18.default;
		default:
		case "en":
			return _firstWordExceptions2.default;
	}
};

var _firstWordExceptions = require("../researches/english/firstWordExceptions.js");

var _firstWordExceptions2 = _interopRequireDefault(_firstWordExceptions);

var _firstWordExceptions3 = require("../researches/german/firstWordExceptions.js");

var _firstWordExceptions4 = _interopRequireDefault(_firstWordExceptions3);

var _firstWordExceptions5 = require("../researches/spanish/firstWordExceptions.js");

var _firstWordExceptions6 = _interopRequireDefault(_firstWordExceptions5);

var _firstWordExceptions7 = require("../researches/french/firstWordExceptions.js");

var _firstWordExceptions8 = _interopRequireDefault(_firstWordExceptions7);

var _firstWordExceptions9 = require("../researches/dutch/firstWordExceptions.js");

var _firstWordExceptions10 = _interopRequireDefault(_firstWordExceptions9);

var _firstWordExceptions11 = require("../researches/italian/firstWordExceptions.js");

var _firstWordExceptions12 = _interopRequireDefault(_firstWordExceptions11);

var _firstWordExceptions13 = require("../researches/russian/firstWordExceptions.js");

var _firstWordExceptions14 = _interopRequireDefault(_firstWordExceptions13);

var _firstWordExceptions15 = require("../researches/polish/firstWordExceptions.js");

var _firstWordExceptions16 = _interopRequireDefault(_firstWordExceptions15);

var _firstWordExceptions17 = require("../researches/swedish/firstWordExceptions.js");

var _firstWordExceptions18 = _interopRequireDefault(_firstWordExceptions17);

var _getLanguage = require("./getLanguage.js");

var _getLanguage2 = _interopRequireDefault(_getLanguage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=getFirstWordExceptions.js.map
