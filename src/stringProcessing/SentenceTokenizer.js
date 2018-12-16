"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodashEs = require("lodash");

var _core = require("tokenizer2/core");

var _core2 = _interopRequireDefault(_core);

var _quotes = require("../stringProcessing/quotes.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// All characters that indicate a sentence delimiter.
var fullStop = ".";
// The \u2026 character is an ellipsis
var sentenceDelimiters = "?!;\u2026";

var fullStopRegex = new RegExp("^[" + fullStop + "]$");
var sentenceDelimiterRegex = new RegExp("^[" + sentenceDelimiters + "]$");
var sentenceRegex = new RegExp("^[^" + fullStop + sentenceDelimiters + "<\\(\\)\\[\\]]+$");
var smallerThanContentRegex = /^<[^><]*$/;
var htmlStartRegex = /^<([^>\s/]+)[^>]*>$/mi;
var htmlEndRegex = /^<\/([^>\s]+)[^>]*>$/mi;

var blockStartRegex = /^\s*[[({]\s*$/;
var blockEndRegex = /^\s*[\])}]\s*$/;

var sentenceEndRegex = new RegExp("[" + fullStop + sentenceDelimiters + "]$");

/**
 * Class for tokenizing a (html) text into sentences.
 */

var SentenceTokenizer = function () {
	function SentenceTokenizer() {
		_classCallCheck(this, SentenceTokenizer);
	}

	_createClass(SentenceTokenizer, [{
		key: "isNumber",

		/**
   * Returns whether or not a certain character is a number.
   *
   * @param {string} character The character to check.
   * @returns {boolean} Whether or not the character is a capital letter.
   */
		value: function isNumber(character) {
			return !(0, _lodashEs.isNaN)(parseInt(character, 10));
		}

		/**
   * Returns whether or not a given HTML tag is a break tag.
   *
   * @param {string} htmlTag The HTML tag to check.
   * @returns {boolean} Whether or not the given HTML tag is a break tag.
   */

	}, {
		key: "isBreakTag",
		value: function isBreakTag(htmlTag) {
			return (/<br/.test(htmlTag)
			);
		}

		/**
   * Returns whether or not a given character is quotation mark.
   *
   * @param {string} character The character to check.
   * @returns {boolean} Whether or not the given character is a quotation mark.
   */

	}, {
		key: "isQuotation",
		value: function isQuotation(character) {
			character = (0, _quotes.normalize)(character);

			return "'" === character || "\"" === character;
		}

		/**
   * Returns whether or not a given character is a punctuation mark that can be at the beginning
   * of a sentence, like ¿ and ¡ used in Spanish.
   *
   * @param {string} character The character to check.
   * @returns {boolean} Whether or not the given character is a punctuation mark.
   */

	}, {
		key: "isPunctuation",
		value: function isPunctuation(character) {
			return "¿" === character || "¡" === character;
		}

		/**
   * Removes duplicate whitespace from a given text.
   *
   * @param {string} text The text with duplicate whitespace.
   * @returns {string} The text without duplicate whitespace.
   */

	}, {
		key: "removeDuplicateWhitespace",
		value: function removeDuplicateWhitespace(text) {
			return text.replace(/\s+/, " ");
		}

		/**
   * Returns whether or not a certain character is a capital letter.
   *
   * @param {string} character The character to check.
   * @returns {boolean} Whether or not the character is a capital letter.
   */

	}, {
		key: "isCapitalLetter",
		value: function isCapitalLetter(character) {
			return character !== character.toLocaleLowerCase();
		}

		/**
   * Checks whether the given character is a smaller than sign.
   *
   * This function is used to make sure that tokenizing the content after
   * the smaller than sign works as expected.
   * E.g. 'A sentence. < Hello world!' = ['A sentence.', '< Hello world!'].
   *
   * @param {string} character The character to check.
   * @returns {boolean} Whether the character is a smaller than sign ('<') or not.
   */

	}, {
		key: "isSmallerThanSign",
		value: function isSmallerThanSign(character) {
			return character === "<";
		}

		/**
   * Retrieves the next two characters from an array with the two next tokens.
   *
   * @param {Array} nextTokens The two next tokens. Might be undefined.
   * @returns {string} The next two characters.
   */

	}, {
		key: "getNextTwoCharacters",
		value: function getNextTwoCharacters(nextTokens) {
			var next = "";

			if (!(0, _lodashEs.isUndefined)(nextTokens[0])) {
				next += nextTokens[0].src;
			}

			if (!(0, _lodashEs.isUndefined)(nextTokens[1])) {
				next += nextTokens[1].src;
			}

			next = this.removeDuplicateWhitespace(next);

			return next;
		}

		/**
   * Checks if the sentenceBeginning beginning is a valid beginning.
   *
   * @param {string} sentenceBeginning The beginning of the sentence to validate.
   * @returns {boolean} Returns true if it is a valid beginning, false if it is not.
   */

	}, {
		key: "isValidSentenceBeginning",
		value: function isValidSentenceBeginning(sentenceBeginning) {
			return this.isCapitalLetter(sentenceBeginning) || this.isNumber(sentenceBeginning) || this.isQuotation(sentenceBeginning) || this.isPunctuation(sentenceBeginning) || this.isSmallerThanSign(sentenceBeginning);
		}

		/**
   * Checks if the token is a valid sentence ending.
   *
   * @param {Object} token The token to validate.
   * @returns {boolean} Returns true if the token is valid ending, false if it is not.
   */

	}, {
		key: "isSentenceStart",
		value: function isSentenceStart(token) {
			return !(0, _lodashEs.isUndefined)(token) && ("html-start" === token.type || "html-end" === token.type || "block-start" === token.type);
		}

		/**
   * Tokens that represent a '<', followed by content until it enters another '<' or '>'
   * gets another pass by the tokenizer.
   *
   * @param {Object} token A token of type 'smaller-than-sign-content'.
   * @param {string[]} tokenSentences The current array of found sentences. Sentences may get added by this method.
   * @param {string} currentSentence The current sentence. Sentence parts may get appended by this method.
   * @returns {{tokenSentences, currentSentence}} The found sentences and the current sentence, appended when necessary.
   */

	}, {
		key: "tokenizeSmallerThanContent",
		value: function tokenizeSmallerThanContent(token, tokenSentences, currentSentence) {
			/*
   	Remove the '<' from the text, to avoid matching this rule
   	recursively again and again.
   	We add it again later on.
   */
			var localText = token.src.substring(1);

			// Tokenize the current smaller-than-content token without the first '<'.
			var tokenizerResult = this.createTokenizer();
			this.tokenize(tokenizerResult.tokenizer, localText);
			var localSentences = this.getSentencesFromTokens(tokenizerResult.tokens, false);

			localSentences[0] = (0, _lodashEs.isUndefined)(localSentences[0]) ? "<" : "<" + localSentences[0];

			/*
    * When the first sentence has a valid sentence beginning.
    * Add the currently build sentence to the sentences.
    * Start building the next sentence.
    */
			if (this.isValidSentenceBeginning(localSentences[0])) {
				tokenSentences.push(currentSentence);
				currentSentence = "";
			}
			currentSentence += localSentences[0];

			if (localSentences.length > 1) {
				/*
    	There is a new sentence after the first,
    	add and reset the current sentence.
     */
				tokenSentences.push(currentSentence);
				currentSentence = "";

				// Remove the first sentence (we do not need to add it again).
				localSentences.shift();
				// Last sentence gets special treatment.
				var lastSentence = localSentences.pop();

				// Add the remaining found sentences.
				localSentences.forEach(function (sentence) {
					tokenSentences.push(sentence);
				});

				// Check if the last sentence has a valid sentence ending.
				if (lastSentence.match(sentenceEndRegex)) {
					// If so, add it as a sentence.
					tokenSentences.push(lastSentence);
				} else {
					// If not, start making a new one.
					currentSentence = lastSentence;
				}
			}
			return {
				tokenSentences: tokenSentences,
				currentSentence: currentSentence
			};
		}

		/**
   * Creates a tokenizer.
   *
   * @returns {Object} The tokenizer and the tokens.
   */

	}, {
		key: "createTokenizer",
		value: function createTokenizer() {
			var tokens = [];
			var tokenizer = (0, _core2.default)(function (token) {
				tokens.push(token);
			});

			tokenizer.addRule(fullStopRegex, "full-stop");
			tokenizer.addRule(smallerThanContentRegex, "smaller-than-sign-content");
			tokenizer.addRule(htmlStartRegex, "html-start");
			tokenizer.addRule(htmlEndRegex, "html-end");
			tokenizer.addRule(blockStartRegex, "block-start");
			tokenizer.addRule(blockEndRegex, "block-end");
			tokenizer.addRule(sentenceDelimiterRegex, "sentence-delimiter");
			tokenizer.addRule(sentenceRegex, "sentence");

			return {
				tokenizer: tokenizer,
				tokens: tokens
			};
		}

		/**
   * Tokenizes the given text using the given tokenizer.
   *
   * @param {Object} tokenizer The tokenizer to use.
   * @param {string} text The text to tokenize.
   * @returns {void}
   */

	}, {
		key: "tokenize",
		value: function tokenize(tokenizer, text) {
			tokenizer.onText(text);

			try {
				tokenizer.end();
			} catch (e) {
				console.error("Tokenizer end error:", e, e.tokenizer2);
			}
		}

		/**
   * Returns an array of sentences for a given array of tokens, assumes that the text has already been split into blocks.
   *
   * @param {Object[]} tokenArray The tokens from the sentence tokenizer.
   * @param {boolean} [trimSentences=true] Whether to trim the sentences at the end or not.
   *
   * @returns {string[]} A list of sentences.
   */

	}, {
		key: "getSentencesFromTokens",
		value: function getSentencesFromTokens(tokenArray) {
			var _this = this;

			var trimSentences = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			var tokenSentences = [],
			    currentSentence = "",
			    nextSentenceStart = void 0,
			    sliced = void 0;

			// Drop the first and last HTML tag if both are present.
			do {
				sliced = false;
				var firstToken = tokenArray[0];
				var lastToken = tokenArray[tokenArray.length - 1];

				if (firstToken && lastToken && firstToken.type === "html-start" && lastToken.type === "html-end") {
					tokenArray = tokenArray.slice(1, tokenArray.length - 1);

					sliced = true;
				}
			} while (sliced && tokenArray.length > 1);

			tokenArray.forEach(function (token, i) {
				var hasNextSentence = void 0,
				    nextCharacters = void 0,
				    tokenizeResults = void 0;
				var nextToken = tokenArray[i + 1];
				var secondToNextToken = tokenArray[i + 2];

				switch (token.type) {
					case "html-start":
					case "html-end":
						if (_this.isBreakTag(token.src)) {
							tokenSentences.push(currentSentence);
							currentSentence = "";
						} else {
							currentSentence += token.src;
						}
						break;

					case "smaller-than-sign-content":
						tokenizeResults = _this.tokenizeSmallerThanContent(token, tokenSentences, currentSentence);
						tokenSentences = tokenizeResults.tokenSentences;
						currentSentence = tokenizeResults.currentSentence;
						break;
					case "sentence":
						currentSentence += token.src;
						break;
					case "sentence-delimiter":
						currentSentence += token.src;

						if (!(0, _lodashEs.isUndefined)(nextToken) && "block-end" !== nextToken.type && "sentence-delimiter" !== nextToken.type) {
							tokenSentences.push(currentSentence);
							currentSentence = "";
						}
						break;

					case "full-stop":
						currentSentence += token.src;

						nextCharacters = _this.getNextTwoCharacters([nextToken, secondToNextToken]);

						// For a new sentence we need to check the next two characters.
						hasNextSentence = nextCharacters.length >= 2;
						nextSentenceStart = hasNextSentence ? nextCharacters[1] : "";
						// If the next character is a number, never split. For example: IPv4-numbers.
						if (hasNextSentence && _this.isNumber(nextCharacters[0])) {
							break;
						}
						// Only split on sentence delimiters when the next sentence looks like the start of a sentence.
						if (hasNextSentence && _this.isValidSentenceBeginning(nextSentenceStart) || _this.isSentenceStart(nextToken)) {
							tokenSentences.push(currentSentence);
							currentSentence = "";
						}
						break;

					case "block-start":
						currentSentence += token.src;
						break;

					case "block-end":
						currentSentence += token.src;

						nextCharacters = _this.getNextTwoCharacters([nextToken, secondToNextToken]);

						// For a new sentence we need to check the next two characters.
						hasNextSentence = nextCharacters.length >= 2;
						nextSentenceStart = hasNextSentence ? nextCharacters[0] : "";
						// If the next character is a number, never split. For example: IPv4-numbers.
						if (hasNextSentence && _this.isNumber(nextCharacters[0])) {
							break;
						}

						if (hasNextSentence && _this.isValidSentenceBeginning(nextSentenceStart) || _this.isSentenceStart(nextToken)) {
							tokenSentences.push(currentSentence);
							currentSentence = "";
						}
						break;
				}
			});

			if ("" !== currentSentence) {
				tokenSentences.push(currentSentence);
			}

			if (trimSentences) {
				tokenSentences = (0, _lodashEs.map)(tokenSentences, function (sentence) {
					return sentence.trim();
				});
			}

			return tokenSentences;
		}
	}]);

	return SentenceTokenizer;
}();

exports.default = SentenceTokenizer;
//# sourceMappingURL=SentenceTokenizer.js.map
