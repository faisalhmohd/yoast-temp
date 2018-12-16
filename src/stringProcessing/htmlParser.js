"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (text) {
	textArray = [];
	parser.write(text);
	return textArray.join("");
};

var _htmlparser = require("htmlparser2");

var _htmlparser2 = _interopRequireDefault(_htmlparser);

var _lodashEs = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The array containing the text parts without the blocks defined in inlineTags.
// We use an external library, which can be found here: https://github.com/fb55/htmlparser2.
var textArray = void 0;

// False when we are not in a block defined in inlineTags. True if we are.
var inScriptBlock = false;

// The blocks we filter out of the text that needs to be parsed.
var inlineTags = ["script", "style", "code", "pre"];

/**
 * Parses the text.
 */
var parser = new _htmlparser2.default.Parser({
	/**
  * Handles the opening tag. If the opening tag is included in the inlineTags array, set inScriptBlock to true.
  * If the opening tag is not included in the inlineTags array, push the tag to the textArray.
  *
  * @param {string} tagName The tag name.
  * @param {object} nodeValue The attribute with the keys and values of the tag.
  * @returns {void}
  */
	onopentag: function onopentag(tagName, nodeValue) {
		if ((0, _lodashEs.includes)(inlineTags, tagName)) {
			inScriptBlock = true;
			return;
		}

		var nodeValueType = Object.keys(nodeValue);
		var nodeValueString = "";

		nodeValueType.forEach(function (node) {
			// Build the tag again.
			nodeValueString += " " + node + "='" + nodeValue[node] + "'";
		});

		textArray.push("<" + tagName + nodeValueString + ">");
	},
	/**
  * Handles the text that doesn't contain opening or closing tags. If inScriptBlock is false, the text gets pushed to the textArray array.
  *
  * @param {string} text The text that doesn't contain opening or closing tags.
  *
  * @returns {void}
  */
	ontext: function ontext(text) {
		if (!inScriptBlock) {
			textArray.push(text);
		}
	},
	/**
  * Handles the closing tag. If the closing tag is included in the inlineTags array, set inScriptBlock to false.
  * If the closing tag is not included in the inlineTags array, push the tag to the textArray.
  *
  * @param {string} tagName The tag name.
  *
  * @returns {void}
  */
	onclosetag: function onclosetag(tagName) {
		if ((0, _lodashEs.includes)(inlineTags, tagName)) {
			inScriptBlock = false;
			return;
		}

		textArray.push("</" + tagName + ">");
	}
}, { decodeEntities: true });

/**
 * Calls the htmlparser and returns the text without the HTML blocks as defined in the inlineTags array.
 *
 * @param {string} text The text to parse.
 * @returns {string} The text without the HTML blocks as defined in the inlineTags array.
 */
//# sourceMappingURL=htmlParser.js.map
