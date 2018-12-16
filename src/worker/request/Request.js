"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Result = require("./Result");

var _Result2 = _interopRequireDefault(_Result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Request serves as helper for the AnalysisWorkerWrapper.
 *
 * It holds the resolve and reject functions that it needs to fulfill the
 * promise. Any optional data will get included in the Result it can generate.
 */
var Request = function () {
	/**
  * Initializes a request.
  *
  * @param {Function} resolve The resolve function.
  * @param {Function} reject  The reject function.
  * @param {Object}  [data]   Optional extra data.
  */
	function Request(resolve, reject) {
		var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		_classCallCheck(this, Request);

		this._resolve = resolve;
		this._reject = reject;
		this._data = data;
	}

	/**
  * Resolves the request with a result.
  *
  * @param {Object} [payload] Optional payload.
  *
  * @returns {void}
  */


	_createClass(Request, [{
		key: "resolve",
		value: function resolve() {
			var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var result = new _Result2.default(payload, this._data);
			this._resolve(result);
		}

		/**
   * Rejects the request with a result.
   *
   * @param {Object} [payload] Optional payload.
   *
   * @returns {void}
   */

	}, {
		key: "reject",
		value: function reject() {
			var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var result = new _Result2.default(payload, this._data);
			this._reject(result);
		}
	}]);

	return Request;
}();

exports.default = Request;
//# sourceMappingURL=Request.js.map
