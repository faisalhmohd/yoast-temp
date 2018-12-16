"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = wrapTryCatchAroundAction;
/**
 * Wraps the given action in a try-catch that logs the error message.
 *
 * @param {Logger}   logger                  The logger instance to log with.
 * @param {Function} action                  The action to safely run.
 * @param {string}   [errorMessagePrefix=""] The prefix of the error message.
 *
 * @returns {Function} The wrapped action.
 */
function wrapTryCatchAroundAction(logger, action) {
	var errorMessagePrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

	return function () {
		try {
			return action.apply(undefined, arguments);
		} catch (error) {
			var errorMessage = errorMessagePrefix ? [errorMessagePrefix] : [];

			if (error.name && error.message) {
				if (error.stack) {
					logger.debug(error.stack);
				}
				// Standard JavaScript error (e.g. when calling `throw new Error( message )`).
				errorMessage.push(error.name + ": " + error.message);
			}

			errorMessage = errorMessage.join("\n\t");
			logger.error(errorMessage);
			return { error: errorMessage };
		}
	};
}
//# sourceMappingURL=wrapTryCatchAroundAction.js.map
