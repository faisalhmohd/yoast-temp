"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (url, topicForms) {
	var locale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "en_EN";

	var formatUrl = url.match(/>(.*)/ig);
	if (formatUrl !== null) {
		formatUrl = formatUrl[0].replace(/<.*?>\s?/ig, "");
		formatUrl = formatUrl.slice(1).toString();

		var topicInLinkText = (0, _findKeywordFormsInString.findTopicFormsInString)(topicForms, formatUrl, true, locale);

		return topicInLinkText.percentWordMatches === 100;
	}

	return false;
};

var _findKeywordFormsInString = require("../researches/findKeywordFormsInString.js");
//# sourceMappingURL=findKeywordInUrl.js.map
