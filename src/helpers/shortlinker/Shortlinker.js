"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Shortlinker to handle appending parameters to a link.
 */
var Shortlinker = function () {
	/**
  * Initialize the Shortlinker class.
  *
  * @param {Object} [config={}] Optional configuration.
  */
	function Shortlinker() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Shortlinker);

		this.configure(config);
	}

	/**
  * Saves the passed configuration.
  *
  * @param {Object} config             The configuration.
  * @param {Object} [config.params={}] The default params to create the query string with.
  *
  * @returns {void}
  */


	_createClass(Shortlinker, [{
		key: "configure",
		value: function configure(config) {
			this._config = _extends({
				params: {}
			}, config);
		}

		/**
   * Creates a query string from a params object.
   *
   * @param {Object} params Params for in the query string.
   *
   * @returns {string} URI encoded query string.
   */

	}, {
		key: "append",


		/**
   * Creates a link by combining the params from the config and appending them to the url.
   *
   * @param {string} url         The base url.
   * @param {Object} [params={}] Optional params for in the url.
   *
   * @returns {string} The url with query string.
   */
		value: function append(url) {
			var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var link = encodeURI(url);
			var queryString = Shortlinker.createQueryString(_extends({}, this._config.params, params));

			if (queryString !== "") {
				link += "?" + queryString;
			}

			return link;
		}

		/**
   * Creates an anchor opening tag; uses the append function to create the url.
   *
   * @param {string} url         The base url.
   * @param {Object} [params={}] Optional params for in the url.
   *
   * @returns {string} The anchor opening tag.
   */

	}, {
		key: "createAnchorOpeningTag",
		value: function createAnchorOpeningTag(url) {
			var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			return "<a href='" + this.append(url, params) + "' target='_blank'>";
		}
	}], [{
		key: "createQueryString",
		value: function createQueryString(params) {
			return Object.keys(params).map(function (key) {
				return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
			}).join("&");
		}
	}]);

	return Shortlinker;
}();

exports.default = Shortlinker;
//# sourceMappingURL=Shortlinker.js.map
