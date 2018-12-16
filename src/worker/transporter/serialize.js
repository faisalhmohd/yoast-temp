"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = serialize;

var _lodashEs = require("lodash");

/**
 * Serializes a data structure to transfer it over a web worker message.
 *
 * @param {*} thing The data structure to serialize.
 *
 * @returns {*} The serialized data structure.
 */
function serialize(thing) {
	if ((0, _lodashEs.isArray)(thing)) {
		return thing.map(serialize);
	}

	var thingIsObject = (0, _lodashEs.isObject)(thing);

	if (thingIsObject && thing.serialize) {
		return thing.serialize();
	}

	if (thingIsObject) {
		return (0, _lodashEs.mapValues)(thing, function (value) {
			return serialize(value);
		});
	}

	return thing;
}
//# sourceMappingURL=serialize.js.map
