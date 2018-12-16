"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (participles) {
	var passive = false;
	(0, _lodashEs.forEach)(participles, function (participle) {
		if (participle.determinesSentencePartIsPassive()) {
			passive = true;
			return;
		}
	});
	return passive;
};

var _lodashEs = require("lodash");
//# sourceMappingURL=determineSentencePartIsPassive.js.map
