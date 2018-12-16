"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (text, locale) {
  var map = (0, _transliterationsWPstyle2.default)(locale);
  for (var i = map.length - 1; i >= 0; i--) {
    text = text.replace(map[i].letter, map[i].alternative);
  }
  return text;
};

var _transliterationsWPstyle = require("../config/transliterationsWPstyle.js");

var _transliterationsWPstyle2 = _interopRequireDefault(_transliterationsWPstyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=transliterateWPstyle.js.map
