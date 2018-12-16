"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require("tokenizer2/core");

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Contains a URL tokenizer that is capable of tokenizing a URL structure string.
 *
 * @type {Object}
 */
var urlTokenizer;

/**
 * Contains the tokens as parsed by the urlTokenizer.
 *
 * @type {Object[]}
 */
var tokens = void 0;

/**
 * Matches static parts of a URL, because we use %% as placeholder markers we don't support percentage signs in the URL.
 *
 * @type {RegExp}
 */
var staticRegex = /^[^%]+$/;

/**
 * Matches variable parts of a URL, format is %%placeholder%%.
 *
 * @type {RegExp}
 */
var variableRegex = /^%%[^%]+%%$/;

/**
 * Creates a tokenizer to tokenize HTML into blocks.
 *
 * @since 1.8.0
 *
 * @returns {void}
 */
function createTokenizer() {
	tokens = [];

	urlTokenizer = (0, _core2.default)(function (token) {
		tokens.push(token);
	});

	urlTokenizer.addRule(staticRegex, "static");
	urlTokenizer.addRule(variableRegex, "variable");
}

/**
 * Represents a URL structure. Placeholders can be defined using %%placeholder%% and can later be filled using the `applyData` method.
 *
 * @since 1.8.0
 */

var UrlStructure = function () {
	/**
  * Sets the structure to the passed structure.
  *
  * @since 1.8.0
  *
  * @param {Array} structure The structure of the URL.
  */
	function UrlStructure(structure) {
		_classCallCheck(this, UrlStructure);

		this._structure = structure;
	}

	/**
  * Builds a URL from this URL structure and the given data.
  *
  * @since 1.8.0
  *
  * @param {Object} data A key value store of all the variable parts of the URL structure.
  * @returns {string} A URL with all variables parts filled.
  */


	_createClass(UrlStructure, [{
		key: "buildUrl",
		value: function buildUrl(data) {
			var _this = this;

			return this._structure.reduce(function (url, urlPart) {
				if ("variable" === urlPart.type) {
					urlPart = _this._buildVariablePart(data, urlPart);
				} else {
					urlPart = urlPart.value;
				}

				return url + urlPart;
			}, "");
		}

		/**
   * Builds a URL part for a small part of the URL.
   *
   * @since 1.8.0
   *
   * @private
   *
   * @param {Object} data The data to fill the URL parts.
   * @param {Object} urlPartConfig The config for the URL part.
   * @returns {string} A URL part.
   */

	}, {
		key: "_buildVariablePart",
		value: function _buildVariablePart(data, urlPartConfig) {
			if (!data.hasOwnProperty(urlPartConfig.name)) {
				throw new TypeError('Data doesn\'t have required property "' + urlPartConfig.name + '"');
			}

			return data[urlPartConfig.name];
		}

		/**
   * Returns the structure.
   *
   * @since 1.8.0
   *
   * @returns {Array} The structure of the URL.
   */

	}, {
		key: "getStructure",
		value: function getStructure() {
			return this._structure;
		}

		/**
   * Parses a URL for static and variable parts. Variables should be surrounded by double percentage signs.
   *
   * @since 1.8.0
   *
   * @param {string} url The URL to parse.
   * @returns {UrlStructure} The parsed url structure.
   */

	}], [{
		key: "fromUrl",
		value: function fromUrl(url) {
			createTokenizer();

			urlTokenizer.onText(url);
			urlTokenizer.end();

			tokens = tokens.map(function (token) {
				var urlPart = {
					type: token.type,
					value: token.src
				};

				if ("variable" === token.type) {
					// Strip the %% at the start and the end of the variable URL part.
					urlPart.name = urlPart.value.substr(2, urlPart.value.length - 4);
				}

				return urlPart;
			});

			return new UrlStructure(tokens);
		}
	}]);

	return UrlStructure;
}();

exports.default = UrlStructure;
//# sourceMappingURL=urlStructure.js.map
