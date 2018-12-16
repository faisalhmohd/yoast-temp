"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (paper) {
	var text = paper.getText();
	var locale = paper.getLocale();
	var language = (0, _getLanguage2.default)(locale);
	var sentences = (0, _getSentences2.default)(text).map(function (sentence) {
		return new _Sentence2.default(sentence);
	});
	var totalNumberSentences = sentences.length;

	if (morphologicalLanguages.includes(language)) {
		return {
			total: totalNumberSentences,
			passives: getMorphologicalPassives(sentences, language).passiveSentences
		};
	}
	if (periphrasticLanguages.includes(language)) {
		return {
			total: totalNumberSentences,
			passives: getPeriphrasticPassives(sentences, language).passiveSentences
		};
	}
};

var _getSentences = require("../stringProcessing/getSentences.js");

var _getSentences2 = _interopRequireDefault(_getSentences);

var _stripHTMLTags = require("../stringProcessing/stripHTMLTags.js");

var _getLanguage = require("../helpers/getLanguage.js");

var _getLanguage2 = _interopRequireDefault(_getLanguage);

var _Sentence = require("../values/Sentence.js");

var _Sentence2 = _interopRequireDefault(_Sentence);

var _lodashEs = require("lodash");

var _determinePassiveSentencePart = require("./passiveVoice/periphrastic/determinePassiveSentencePart.js");

var _determinePassiveSentencePart2 = _interopRequireDefault(_determinePassiveSentencePart);

var _determinePassiveSentence = require("./passiveVoice/morphological/determinePassiveSentence.js");

var _determinePassiveSentence2 = _interopRequireDefault(_determinePassiveSentence);

var _getSentenceParts = require("./passiveVoice/periphrastic/getSentenceParts.js");

var _getSentenceParts2 = _interopRequireDefault(_getSentenceParts);

var _getSentencePartsSplitOnStopwords = require("./passiveVoice/periphrastic/getSentencePartsSplitOnStopwords.js");

var _getSentencePartsSplitOnStopwords2 = _interopRequireDefault(_getSentencePartsSplitOnStopwords);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var morphologicalLanguages = ["ru", "tr", "sv"];
var periphrasticLanguages = ["en", "de", "nl", "fr", "es", "it", "pt", "cn", "pl"];

/* Languages that employ both morphological and periphrastic passive voice marking have not been implemented yet.
 * const morphologicalAndPeriphrasticLanguages = [ "da", "nb" ];
 */

/**
 * Looks for morphological passive voice.
 *
 * @param {Array} sentences Sentences extracted to the text.
 * @param {string} language Language of the text.
 * @returns {Object} The found passive sentences.
 */
var getMorphologicalPassives = function getMorphologicalPassives(sentences, language) {
	var passiveSentences = [];

	(0, _lodashEs.forEach)(sentences, function (sentence) {
		var strippedSentence = (0, _stripHTMLTags.stripFullTags)(sentence.getSentenceText()).toLocaleLowerCase();

		sentence.setPassive((0, _determinePassiveSentence2.default)(strippedSentence, language));

		if (sentence.isPassive() === true) {
			passiveSentences.push(sentence.getSentenceText());
		}
	});
	return {
		passiveSentences: passiveSentences
	};
};

/**
 * Looks for periphrastic passive voice.
 *
 * @param {Array} sentences Sentences extracted to the text.
 * @param {string} language Language of the text.
 * @returns {Object} The found passive sentences.
 */
var getPeriphrasticPassives = function getPeriphrasticPassives(sentences, language) {
	var passiveSentences = [];

	(0, _lodashEs.forEach)(sentences, function (sentence) {
		var strippedSentence = (0, _stripHTMLTags.stripFullTags)(sentence.getSentenceText()).toLocaleLowerCase();

		// The functionality based on sentencePart objects should be rewritten using array indices of stopwords and auxiliaries.
		var sentenceParts = [];

		if (language === "de" || language === "nl" || language === "pl") {
			sentenceParts = (0, _getSentencePartsSplitOnStopwords2.default)(strippedSentence, language);
		} else {
			sentenceParts = (0, _getSentenceParts2.default)(strippedSentence, language);
		}

		var passive = false;
		(0, _lodashEs.forEach)(sentenceParts, function (sentencePart) {
			sentencePart.setPassive((0, _determinePassiveSentencePart2.default)(sentencePart.getSentencePartText(), sentencePart.getAuxiliaries(), language));
			passive = passive || sentencePart.isPassive();
		});
		if (passive) {
			passiveSentences.push(sentence.getSentenceText());
		}
	});
	return {
		passiveSentences: passiveSentences
	};
};

/**
 * Determines the number of passive sentences in the text.
 *
 * @param {Paper} paper The paper object to get the text to.
 * @returns {Object} The total number of sentences in the text and the found passive sentences.
 */
//# sourceMappingURL=getPassiveVoice.js.map
