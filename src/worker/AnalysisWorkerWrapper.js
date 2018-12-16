"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Internal dependencies.


var _request = require("./request");

var _request2 = _interopRequireDefault(_request);

var _transporter = require("./transporter");

var _transporter2 = _interopRequireDefault(_transporter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Analysis worker is an API around the Web Worker.
 */
var AnalysisWorkerWrapper = function () {
	/**
  * Initializes the AnalysisWorkerWrapper class.
  *
  * @param {Worker} worker The worker to wrap.
  *
  * @constructor
  */
	function AnalysisWorkerWrapper(worker) {
		_classCallCheck(this, AnalysisWorkerWrapper);

		// Initialize instance variables.
		this._worker = worker;
		this._requests = {};
		this._autoIncrementedRequestId = -1;

		// Bind actions to this scope.
		this.initialize = this.initialize.bind(this);
		this.analyze = this.analyze.bind(this);
		this.analyzeRelatedKeywords = this.analyzeRelatedKeywords.bind(this);
		this.loadScript = this.loadScript.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.runResearch = this.runResearch.bind(this);

		// Bind event handlers to this scope.
		this.handleMessage = this.handleMessage.bind(this);
		this.handleMessageError = this.handleMessageError.bind(this);
		this.handleError = this.handleError.bind(this);

		// Initialize the worker event handlers.
		this._worker.onmessage = this.handleMessage;
		this._worker.onmessageerror = this.handleMessageError;
		this._worker.onerror = this.handleError;
	}

	/**
  * Receives the messages and determines the action.
  *
  * See: https://developer.mozilla.org/en-US/docs/Web/API/Worker/onmessage
  *
  * @param {MessageEvent} event              The post message event.
  * @param {Object}       event.data         The data object.
  * @param {string}       event.data.type    The action type.
  * @param {number}       event.data.id      The request id.
  * @param {string}       event.data.payload The payload of the action.
  *
  * @returns {void}
  */


	_createClass(AnalysisWorkerWrapper, [{
		key: "handleMessage",
		value: function handleMessage(_ref) {
			var _ref$data = _ref.data,
			    type = _ref$data.type,
			    id = _ref$data.id,
			    payload = _ref$data.payload;

			var request = this._requests[id];
			if (!request) {
				console.warn("AnalysisWebWorker unmatched response:", payload);
				return;
			}

			payload = _transporter2.default.parse(payload);

			switch (type) {
				case "initialize:done":
				case "loadScript:done":
				case "customMessage:done":
				case "runResearch:done":
				case "analyzeRelatedKeywords:done":
				case "analyze:done":
					request.resolve(payload);
					break;
				case "analyze:failed":
				case "loadScript:failed":
				case "customMessage:failed":
				case "analyzeRelatedKeywords:failed":
					request.reject(payload);
					break;
				default:
					console.warn("AnalysisWebWorker unrecognized action:", type);
			}
		}

		/**
   * Receives the message errors.
   *
   * See: https://developer.mozilla.org/en-US/docs/Web/Events/messageerror
   *
   * @param {MessageEvent} event The message event for the error that
   *                             occurred.
   *
   * @returns {void}
   */

	}, {
		key: "handleMessageError",
		value: function handleMessageError(event) {
			console.warn("AnalysisWebWorker message error:", event);
		}

		/**
   * Receives the errors.
   *
   * See:
   * https://developer.mozilla.org/en-US/docs/Web/API/AbstractWorker/onerror
   *
   * @param {Error} event The error event.
   *
   * @returns {void}
   */

	}, {
		key: "handleError",
		value: function handleError(event) {
			console.error("AnalysisWebWorker error:", event);
		}

		/**
   * Increments the request id.
   *
   * @returns {number} The incremented id.
   */

	}, {
		key: "createRequestId",
		value: function createRequestId() {
			this._autoIncrementedRequestId++;
			return this._autoIncrementedRequestId;
		}

		/**
   * Creates a new request inside a Promise.
   *
   * @param {number} id     The request id.
   * @param {Object} [data] Optional extra data.
   *
   * @returns {Promise} The callback promise.
   */

	}, {
		key: "createRequestPromise",
		value: function createRequestPromise(id) {
			var _this = this;

			var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			return new Promise(function (resolve, reject) {
				_this._requests[id] = new _request2.default(resolve, reject, data);
			});
		}

		/**
   * Sends a request to the worker and returns a promise that will resolve or reject once the worker finishes.
   *
   * @param {string} action  The action of the request.
   * @param {Object} payload The payload of the request.
   * @param {Object} [data]  Optional extra data.
   *
   * @returns {Promise} A promise that will resolve or reject once the worker finishes.
   */

	}, {
		key: "sendRequest",
		value: function sendRequest(action, payload) {
			var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			var id = this.createRequestId();
			var promise = this.createRequestPromise(id, data);

			this.send(action, id, payload);
			return promise;
		}

		/**
   * Sends a message to the worker.
   *
   * @param {string} type      The message type.
   * @param {number} id        The request id.
   * @param {Object} [payload] The payload to deliver.
   *
   * @returns {void}
   */

	}, {
		key: "send",
		value: function send(type, id) {
			var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			payload = _transporter2.default.serialize(payload);

			this._worker.postMessage({
				type: type,
				id: id,
				payload: payload
			});
		}

		/**
   * Initializes the worker with a configuration.
   *
   * @param {Object} configuration The configuration to initialize the worker
   *                               with.
   *
   * @returns {Promise} The promise of initialization.
   */

	}, {
		key: "initialize",
		value: function initialize(configuration) {
			return this.sendRequest("initialize", configuration);
		}

		/**
   * Analyzes the paper.
   *
   * @param {Object} paper           The paper to analyze.
   * @param {Object} relatedKeywords The related keywords.
   *
   * @returns {Promise} The promise of analyses.
   */

	}, {
		key: "analyzeRelatedKeywords",
		value: function analyzeRelatedKeywords(paper) {
			var relatedKeywords = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			return this.sendRequest("analyzeRelatedKeywords", { paper: paper, relatedKeywords: relatedKeywords });
		}

		/**
   * Analyzes the paper.
   *
   * @param {Object} paper           The paper to analyze.
   *
   * @returns {Promise} The promise of analyses.
   */

	}, {
		key: "analyze",
		value: function analyze(paper) {
			return this.sendRequest("analyze", { paper: paper });
		}

		/**
   * Imports a script to the worker.
   *
   * @param {string} url The relative url to the script to be loaded.
   *
   * @returns {Promise} The promise of the script import.
   */

	}, {
		key: "loadScript",
		value: function loadScript(url) {
			return this.sendRequest("loadScript", { url: url });
		}

		/**
   * Sends a custom message to the worker.
   *
   * @param {string} name       The name of the message.
   * @param {string} data       The data of the message.
   * @param {string} pluginName The plugin that registered this type of message.
   *
   * @returns {Promise} The promise of the custom message.
   */

	}, {
		key: "sendMessage",
		value: function sendMessage(name, data, pluginName) {
			name = pluginName + "-" + name;
			return this.sendRequest("customMessage", { name: name, data: data }, data);
		}

		/**
   * Runs the specified research in the worker. Optionally pass a paper.
   *
   * @param {string} name    The name of the research to run.
   * @param {Paper} [paper] The paper to run the research on if it shouldn't
   *                         be run on the latest paper.
   *
   * @returns {Promise} The promise of the research.
   */

	}, {
		key: "runResearch",
		value: function runResearch(name) {
			var paper = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			return this.sendRequest("runResearch", { name: name, paper: paper });
		}
	}]);

	return AnalysisWorkerWrapper;
}();

exports.default = AnalysisWorkerWrapper;
//# sourceMappingURL=AnalysisWorkerWrapper.js.map
