"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _lodashEs = require("lodash");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // External dependencies.


var Task =
/**
 * Initializes a task.
 *
 * @param {number}   id      The task identifier.
 * @param {function} execute Executes the job with the data.
 * @param {function} done    Callback for the scheduler.
 * @param {Object}   [data]  Optional data for when executing the task.
 * @param {string}   type    The type of the task (analyze, analyzeRelatedKeywords, loadScript or customMessage)
 */
function Task(id, execute, done) {
	var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "analyze";

	_classCallCheck(this, Task);

	if (!(0, _lodashEs.isNumber)(id)) {
		throw new Error("Task.id should be a number.");
	}
	if (!(0, _lodashEs.isFunction)(execute)) {
		throw new Error("Task.execute should be a function.");
	}
	if (!(0, _lodashEs.isFunction)(done)) {
		throw new Error("Task.done should be a function.");
	}
	if (!(0, _lodashEs.isObject)(data)) {
		throw new Error("Task.data should be an object.");
	}
	this.id = id;
	this.execute = execute;
	this.done = done;
	this.data = data;
	this.type = type;
};

exports.default = Task;
//# sourceMappingURL=Task.js.map
