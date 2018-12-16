"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (array) {
	return array.map(function (pair) {
		if (pair.length === 2) {
			return {
				reg: new RegExp(pair[0], "i"),
				repl: pair[1]
			};
		}
		if (pair.length === 3) {
			return {
				reg: new RegExp(pair[0], "i"),
				repl1: pair[1],
				repl2: pair[2]
			};
		}
	});
};
//# sourceMappingURL=createRulesFromMorphologyData.js.map
