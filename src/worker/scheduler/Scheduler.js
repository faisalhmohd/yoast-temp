"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // External dependencies.


// Internal dependencies.


var _lodashEs = require("lodash");

var _Task = require("./Task");

var _Task2 = _interopRequireDefault(_Task);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_CONFIGURATION = {
	pollTime: 50
};

var Scheduler = function () {
	/**
  * Initializes a Scheduler.
  *
  * @param {Object}  [configuration]             The configuration.
  * @param {number}  [configuration.pollTime]    The time in between each task
  *                                              poll in milliseconds,
  *                                              defaults to 50.
  */
	function Scheduler() {
		var configuration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Scheduler);

		this._configuration = (0, _lodashEs.merge)(DEFAULT_CONFIGURATION, configuration);
		this._tasks = {
			standard: [],
			extensions: [],
			analyze: [],
			analyzeRelatedKeywords: []
		};
		this._pollHandle = null;
		this._started = false;

		// Bind functions to this scope.
		this.startPolling = this.startPolling.bind(this);
		this.stopPolling = this.stopPolling.bind(this);
		this.tick = this.tick.bind(this);
	}

	/**
  * Initialize polling.
  *
  * @returns {void}
  */


	_createClass(Scheduler, [{
		key: "startPolling",
		value: function startPolling() {
			if (this._started) {
				return;
			}

			this._started = true;

			this.tick();
		}

		/**
   * Do a tick and execute a task.
   *
   * @returns {void}
   */

	}, {
		key: "tick",
		value: function tick() {
			var _this = this;

			this.executeNextTask().then(function () {
				setTimeout(_this.tick, _this._configuration.pollTime);
			});
		}

		/**
   * Stop polling.
   *
   * @returns {void}
   */

	}, {
		key: "stopPolling",
		value: function stopPolling() {
			clearTimeout(this._pollHandle);
			this._pollHandle = null;
		}

		/**
   * Schedule a task.
   *
   * @param {Object}   task         The task object.
   * @param {number}   task.id      The task id.
   * @param {function} task.execute The function to run for task execution.
   * @param {function} task.done    The function to run when the task is done.
   * @param {Object}   task.data    The data object to execute with.
   * @param {string}   task.type    The type of the task.
   *
   * @returns {void}
   */

	}, {
		key: "schedule",
		value: function schedule(_ref) {
			var id = _ref.id,
			    execute = _ref.execute,
			    done = _ref.done,
			    data = _ref.data,
			    type = _ref.type;

			var task = new _Task2.default(id, execute, done, data, type);
			switch (type) {
				case "customMessage":
				case "loadScript":
					this._tasks.extensions.push(task);
					break;
				case "analyze":
					this._tasks.analyze = [task];
					break;
				case "analyzeRelatedKeywords":
					this._tasks.analyzeRelatedKeywords = [task];
					break;
				default:
					this._tasks.standard.push(task);
			}
		}

		/**
   * Retrieves the next task to the queue. Queues are sorted to lowest to highest priority.
   *
   * @returns {Task|null} The next task or null if none are available.
   */

	}, {
		key: "getNextTask",
		value: function getNextTask() {
			if (this._tasks.extensions.length > 0) {
				return this._tasks.extensions.shift();
			}

			if (this._tasks.analyze.length > 0) {
				return this._tasks.analyze.shift();
			}

			if (this._tasks.analyzeRelatedKeywords.length > 0) {
				return this._tasks.analyzeRelatedKeywords.shift();
			}

			if (this._tasks.standard.length > 0) {
				return this._tasks.standard.shift();
			}

			return null;
		}

		/**
   * Executes the next task.
   *
   * @returns {Promise} Resolves once the task is done, with the result of the task.
   */

	}, {
		key: "executeNextTask",
		value: function executeNextTask() {
			var task = this.getNextTask();
			if (task === null) {
				return Promise.resolve(null);
			}

			return Promise.resolve().then(function () {
				return task.execute(task.id, task.data);
			}).then(function (result) {
				task.done(task.id, result);

				return result;
			});
		}
	}]);

	return Scheduler;
}();

exports.default = Scheduler;
//# sourceMappingURL=Scheduler.js.map
