"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (paper) {
	// These numbers are based on research into average reading times.
	var wordsPerMinute = 200;
	var minutesPerImage = 0.2;

	var numberOfWords = (0, _wordCountInText2.default)(paper);
	var numberOfImages = (0, _imageCountInText2.default)(paper);

	/*
  * This formula is based on the average number of words a person is expected to read per minute,
  * plus extra time for each image in the text. It returns the expected reading time in whole minutes,
  * rounded up to the nearest minute.
  */
	return Math.ceil(numberOfWords / wordsPerMinute + numberOfImages * minutesPerImage);
};

var _wordCountInText = require("./wordCountInText.js");

var _wordCountInText2 = _interopRequireDefault(_wordCountInText);

var _imageCountInText = require("./imageCountInText.js");

var _imageCountInText2 = _interopRequireDefault(_imageCountInText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=readingTime.js.map
