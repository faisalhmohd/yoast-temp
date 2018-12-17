"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getDistraction = exports.keyphraseDistributionResearcher = exports.maximizeSentenceScores = exports.computeScoresPerSentenceLongTopic = exports.computeScoresPerSentenceShortTopic = undefined;

var _getSentences = require("../stringProcessing/getSentences");

var _getSentences2 = _interopRequireDefault(_getSentences);

var _findKeywordFormsInString = require("./findKeywordFormsInString");

var _lodashEs = require("lodash");

var _markWordsInSentences = require("../stringProcessing/markWordsInSentences");

var _getLanguage = require("../helpers/getLanguage");

var _getLanguage2 = _interopRequireDefault(_getLanguage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks whether at least half of the content words to the topic are found within the sentence.
 * Assigns a score to every sentence following the following schema:
 * 9 if at least half of the content words to the topic are in the sentence,
 * 3 otherwise.
 *
 * @param {Array}  topic     The word forms of all content words in a keyphrase or a synonym.
 * @param {Array}  sentences An array of all sentences in the text.
 * @param {string} locale    The locale of the paper to analyse.
 *
 * @returns {Array} The scores per sentence.
 */
var computeScoresPerSentenceLongTopic = function computeScoresPerSentenceLongTopic(topic, sentences, locale) {
	var sentenceScores = Array(sentences.length);

	for (var i = 0; i < sentences.length; i++) {
		var foundInCurrentSentence = (0, _findKeywordFormsInString.findWordFormsInString)(topic, sentences[i], locale);

		if (foundInCurrentSentence.percentWordMatches >= 50) {
			sentenceScores[i] = 9;
		} else {
			sentenceScores[i] = 3;
		}
	}

	return sentenceScores;
};

/**
 * Checks whether all content words to the topic are found within one sentence.
 * Assigns a score to every sentence following the following schema:
 * 9 if all content words to the topic are in the sentence,
 * 3 if not all content words to the topic were found in the sentence.
 *
 * @param {Array}  topic     The word forms of all content words in a keyphrase or a synonym.
 * @param {Array}  sentences An array of all sentences in the text.
 * @param {string} locale    The locale of the paper to analyse.
 *
 * @returns {Array} The scores per sentence.
 */
var computeScoresPerSentenceShortTopic = function computeScoresPerSentenceShortTopic(topic, sentences, locale) {
	var sentenceScores = Array(sentences.length);

	for (var i = 0; i < sentences.length; i++) {
		var currentSentence = sentences[i];
		var foundInCurrentSentence = (0, _findKeywordFormsInString.findWordFormsInString)(topic, currentSentence, locale);
		if (foundInCurrentSentence.percentWordMatches === 100) {
			sentenceScores[i] = 9;
		} else {
			sentenceScores[i] = 3;
		}
	}
	return sentenceScores;
};

/**
 * Maximizes scores: Give every sentence a maximal score that it got to analysis of all topics
 *
 * @param {Array} sentenceScores The scores for every sentence, as assessed per keyphrase and every synonym.
 *
 * @returns {Array} Maximal scores of topic relevance per sentence.
 */
var maximizeSentenceScores = function maximizeSentenceScores(sentenceScores) {
	var sentenceScoresTransposed = sentenceScores[0].map(function (col, i) {
		return sentenceScores.map(function (row) {
			return row[i];
		});
	});

	return sentenceScoresTransposed.map(function (scoresForOneSentence) {
		return (0, _lodashEs.max)(scoresForOneSentence);
	});
};

/**
 * Computes the maximally long piece of text that does not include the topic.
 *
 * @param {Array} sentenceScores The array of scores per sentence.
 *
 * @returns {number} The maximum number of sentences that do not include the topic.
 */
var getDistraction = function getDistraction(sentenceScores) {
	var numberOfSentences = sentenceScores.length;
	var allTopicSentencesIndices = [];

	for (var i = 0; i < numberOfSentences; i++) {
		if (sentenceScores[i] > 3) {
			allTopicSentencesIndices.push(i);
		}
	}

	var numberOfTopicSentences = allTopicSentencesIndices.length;

	if (numberOfTopicSentences === 0) {
		return numberOfSentences;
	}

	/**
  * Add fake topic sentences at the very beginning and at the very end
  * to account for cases when the text starts or ends with a train of distraction.
  */
	allTopicSentencesIndices.unshift(-1);
	allTopicSentencesIndices.push(numberOfSentences);

	var distances = [];

	for (var _i = 1; _i < numberOfTopicSentences + 2; _i++) {
		distances.push(allTopicSentencesIndices[_i] - allTopicSentencesIndices[_i - 1] - 1);
	}

	return (0, _lodashEs.max)(distances);
};

/**
 * Computes the per-sentence scores depending on the length of the topic phrase and maximizes them over all topic phrases.
 *
 * @param {Array}  sentences              The sentences to get scores for.
 * @param {Array}  topicFormsInOneArray   The topic phrases forms to search for in the sentences.
 * @param {string} locale                 The locale to work in.
 *
 * @returns {Object} An array with maximized score per sentence and an array with all sentences that do not contain the topic.
 */
var getSentenceScores = function getSentenceScores(sentences, topicFormsInOneArray, locale) {
	// Compute per-sentence scores of topic-relatedness.
	var topicNumber = topicFormsInOneArray.length;

	var sentenceScores = Array(topicNumber);

	// Determine whether the language has function words.
	var language = (0, _getLanguage2.default)(locale);

	// For languages with function words apply either full match or partial match depending on topic length
	if ((0, _lodashEs.indexOf)(["en", "de", "nl", "fr", "es", "it", "pt", "ru", "pl"], language) >= 0) {
		for (var i = 0; i < topicNumber; i++) {
			var topic = topicFormsInOneArray[i];
			if (topic.length < 4) {
				sentenceScores[i] = computeScoresPerSentenceShortTopic(topic, sentences, locale);
			} else {
				sentenceScores[i] = computeScoresPerSentenceLongTopic(topic, sentences, locale);
			}
		}
	} else {
		// For languages without function words apply the full match always
		for (var _i2 = 0; _i2 < topicNumber; _i2++) {
			var _topic = topicFormsInOneArray[_i2];
			sentenceScores[_i2] = computeScoresPerSentenceShortTopic(_topic, sentences, locale);
		}
	}

	// Maximize scores: Give every sentence a maximal score that it got to analysis of all topics
	var maximizedSentenceScores = maximizeSentenceScores(sentenceScores);

	// Zip an array combining each sentence with the associated maximized score.
	var sentencesWithMaximizedScores = (0, _lodashEs.zipWith)(sentences, maximizedSentenceScores, function (sentence, score) {
		return { sentence: sentence, score: score };
	});

	// Filter sentences that contain topic words for future highlights.
	var sentencesWithTopic = sentencesWithMaximizedScores.filter(function (sentenceObject) {
		return sentenceObject.score > 3;
	});

	return {
		maximizedSentenceScores: maximizedSentenceScores,
		sentencesWithTopic: sentencesWithTopic.map(function (sentenceObject) {
			return sentenceObject.sentence;
		})
	};
};

/**
 * Determines which portions of the text did not receive a lot of content words to keyphrase and synonyms.
 *
 * @param {Paper}       paper       The paper to check the keyphrase distribution for.
 * @param {Researcher}  researcher  The researcher to use for analysis.
 *
 * @returns {Object} The scores of topic relevance per portion of text and an array of all word forms to highlight.
 */
var keyphraseDistributionResearcher = function keyphraseDistributionResearcher(paper, researcher) {
	var sentences = (0, _getSentences2.default)(paper.getText());
	var topicForms = researcher.getResearch("morphology");
	var locale = paper.getLocale();
	var topicFormsInOneArray = [topicForms.keyphraseForms];

	topicForms.synonymsForms.forEach(function (synonym) {
		topicFormsInOneArray.push(synonym);
	});

	var allTopicWords = (0, _lodashEs.uniq)((0, _lodashEs.flattenDeep)(topicFormsInOneArray)).sort(function (a, b) {
		return b.length - a.length;
	});

	// Get per-sentence scores and sentences that have topic.
	var sentenceScores = getSentenceScores(sentences, topicFormsInOneArray, locale);
	var maximizedSentenceScores = sentenceScores.maximizedSentenceScores;
	var maxLengthDistraction = getDistraction(maximizedSentenceScores);

	return {
		sentencesToHighlight: (0, _markWordsInSentences.markWordsInSentences)(allTopicWords, sentenceScores.sentencesWithTopic, locale),
		keyphraseDistributionScore: maxLengthDistraction / sentences.length * 100
	};
};

exports.computeScoresPerSentenceShortTopic = computeScoresPerSentenceShortTopic;
exports.computeScoresPerSentenceLongTopic = computeScoresPerSentenceLongTopic;
exports.maximizeSentenceScores = maximizeSentenceScores;
exports.keyphraseDistributionResearcher = keyphraseDistributionResearcher;
exports.getDistraction = getDistraction;
//# sourceMappingURL=keyphraseDistribution.js.map
