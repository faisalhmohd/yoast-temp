'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var locale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en_US";

	var language = (0, _getLanguage2.default)(locale);

	if (languages.hasOwnProperty(language)) {
		return languages[language];
	}

	// If an unknown locale is used, default to English.
	return languages["en"];
};

var _getLanguage = require('../helpers/getLanguage.js');

var _getLanguage2 = _interopRequireDefault(_getLanguage);

var _lodashEs = require('lodash');

var _de = require('./syllables/de.json');

var _de2 = _interopRequireDefault(_de);

var _en = require('./syllables/en.json');

var _en2 = _interopRequireDefault(_en);

var _nl = require('./syllables/nl.json');

var _nl2 = _interopRequireDefault(_nl);

var _it = require('./syllables/it.json');

var _it2 = _interopRequireDefault(_it);

var _ru = require('./syllables/ru.json');

var _ru2 = _interopRequireDefault(_ru);

var _fr = require('./syllables/fr.json');

var _fr2 = _interopRequireDefault(_fr);

var _es = require('./syllables/es.json');

var _es2 = _interopRequireDefault(_es);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var languages = { de: _de2.default, nl: _nl2.default, en: _en2.default, it: _it2.default, ru: _ru2.default, fr: _fr2.default, es: _es2.default }; /** @module config/syllables */

;
//# sourceMappingURL=syllables.js.map
