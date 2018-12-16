"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getAnchorsFromText = require("../stringProcessing/getAnchorsFromText.js");

var _getAnchorsFromText2 = _interopRequireDefault(_getAnchorsFromText);

var _findKeywordInUrl = require("../stringProcessing/findKeywordInUrl.js");

var _findKeywordInUrl2 = _interopRequireDefault(_findKeywordInUrl);

var _getLinkType = require("../stringProcessing/getLinkType.js");

var _getLinkType2 = _interopRequireDefault(_getLinkType);

var _checkNofollow = require("../stringProcessing/checkNofollow.js");

var _checkNofollow2 = _interopRequireDefault(_checkNofollow);

var _url = require("../stringProcessing/url.js");

var _url2 = _interopRequireDefault(_url);

var _parseSynonyms = require("../stringProcessing/parseSynonyms");

var _parseSynonyms2 = _interopRequireDefault(_parseSynonyms);

var _buildKeywordForms = require("./buildKeywordForms");

var _getLanguage = require("../helpers/getLanguage");

var _getLanguage2 = _interopRequireDefault(_getLanguage);

var _lodashEs = require("lodash");

var _findKeywordFormsInString = require("./findKeywordFormsInString");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks whether the link is pointing at itself.
 * @param {string} anchor The link anchor.
 * @param {string} permalink The permalink of the paper.
 *
 * @returns {boolean} Whether the anchor is pointing at itself.
 */
/** @module analyses/getLinkStatistics */

var linkToSelf = function linkToSelf(anchor, permalink) {
	var anchorLink = _url2.default.getFromAnchorTag(anchor);

	return _url2.default.areEqual(anchorLink, permalink);
};

/**
 * Filters anchors that are not pointing at itself.
 * @param {Array} anchors An array with all anchors from the paper
 * @param {string} permalink The permalink of the paper.
 *
 * @returns {Array} The array of all anchors that are not pointing at the paper itself.
 */
var filterAnchorsLinkingToSelf = function filterAnchorsLinkingToSelf(anchors, permalink) {
	var anchorsLinkingToSelf = anchors.map(function (anchor) {
		return linkToSelf(anchor, permalink);
	});

	anchors = anchors.filter(function (anchor, index) {
		return anchorsLinkingToSelf[index] === false;
	});

	return anchors;
};

/**
 * Filters anchors that contain keyphrase or synonyms.
 * @param {Array} anchors An array with all anchors from the paper
 * @param {Object} topicForms The object with topicForms.
 * @param {string} locale The locale of the paper
 *
 * @returns {Array} The array of all anchors that contain keyphrase or synonyms.
 */
var filterAnchorsContainingTopic = function filterAnchorsContainingTopic(anchors, topicForms, locale) {
	var anchorsContainingKeyphraseOrSynonyms = anchors.map(function (anchor) {
		return (0, _findKeywordInUrl2.default)(anchor, topicForms, locale);
	});
	anchors = anchors.filter(function (anchor, index) {
		return anchorsContainingKeyphraseOrSynonyms[index] === true;
	});

	return anchors;
};

/**
 * Filters anchors that are contained within keyphrase or synonyms.
 * @param {Array} anchors An array with all anchors from the paper.
 * @param {Array} keyphraseAndSynonyms An array with keyphrase and its synonyms.
 * @param {string} locale The locale of the paper.
 * @param {Object} morphologyData The morphology data (regexes and exception lists) available for the language.
 *
 * @returns {Array} The array of all anchors that contain keyphrase or synonyms.
 */
var filterAnchorsContainedInTopic = function filterAnchorsContainedInTopic(anchors, keyphraseAndSynonyms, locale, morphologyData) {
	var anchorsContainedInTopic = [];

	anchors.forEach(function (currentAnchor) {
		// Generate the forms of the content words from within the anchor.
		var linkTextForms = (0, _buildKeywordForms.buildForms)(currentAnchor, (0, _getLanguage2.default)(locale), morphologyData);

		for (var j = 0; j < keyphraseAndSynonyms.length; j++) {
			var topic = keyphraseAndSynonyms[j];
			if ((0, _findKeywordFormsInString.findWordFormsInString)(linkTextForms, topic, locale).percentWordMatches === 100) {
				anchorsContainedInTopic.push(true);
				break;
			}
		}
	});

	anchors = anchors.filter(function (anchor, index) {
		return anchorsContainedInTopic[index] === true;
	});

	return anchors;
};

/**
 * Checks whether or not an anchor contains the passed keyword.
 * @param {Paper} paper The paper to research.
 * @param {Researcher} researcher The researcher to use.
 * @param {Array} anchors The array of anchors of the links found in the paper.
 * @param {string} permalink The string with a permalink of the paper.
 *
 * @returns {Object} How many anchors contained the keyphrase or synonyms, what are these anchors
 */
var keywordInAnchor = function keywordInAnchor(paper, researcher, anchors, permalink) {
	var result = { totalKeyword: 0, matchedAnchors: [] };

	var keyword = paper.getKeyword();

	// If no keyword is set, return empty result.
	if (keyword === "") {
		return result;
	}

	// Filter out anchors that point at the paper itself.
	anchors = filterAnchorsLinkingToSelf(anchors, permalink);
	if (anchors.length === 0) {
		return result;
	}

	var locale = paper.getLocale();
	var topicForms = researcher.getResearch("morphology");

	// Check if any anchors contain keyphrase or synonyms in them.
	anchors = filterAnchorsContainingTopic(anchors, topicForms, locale);
	if (anchors.length === 0) {
		return result;
	}

	// Check if content words from the anchors are all within the keyphrase or the synonyms.
	var synonyms = paper.getSynonyms();
	var keyphraseAndSynonyms = (0, _lodashEs.flatten)([].concat(keyword, (0, _parseSynonyms2.default)(synonyms)));

	var morphologyData = researcher.getData("morphology")[(0, _getLanguage2.default)(locale)] || false;

	anchors = filterAnchorsContainedInTopic(anchors, keyphraseAndSynonyms, locale, morphologyData);
	result.totalKeyword = anchors.length;
	result.matchedAnchors = anchors;

	return result;
};

/**
 * Counts the links found in the text.
 *
 * @param {Paper} paper The paper object containing text, keyword and url.
 * @param {Researcher} researcher The researcher to use for the paper.
 *
 * @returns {object} The object containing all linktypes.
 * total: the total number of links found.
 * totalNaKeyword: the total number of links if keyword is not available.
 * keyword: Object containing all the keyword related counts and matches.
 * keyword.totalKeyword: the total number of links with the keyword.
 * keyword.matchedAnchors: Array with the anchors that contain the keyword.
 * internalTotal: the total number of links that are internal.
 * internalDofollow: the internal links without a nofollow attribute.
 * internalNofollow: the internal links with a nofollow attribute.
 * externalTotal: the total number of links that are external.
 * externalDofollow: the external links without a nofollow attribute.
 * externalNofollow: the internal links with a dofollow attribute.
 * otherTotal: all links that are not HTTP or HTTPS.
 * otherDofollow: other links without a nofollow attribute.
 * otherNofollow: other links with a nofollow attribute.
 */
var countLinkTypes = function countLinkTypes(paper, researcher) {
	var anchors = (0, _getAnchorsFromText2.default)(paper.getText());
	var permalink = paper.getPermalink();

	var linkCount = {
		total: anchors.length,
		totalNaKeyword: 0,
		keyword: {
			totalKeyword: 0,
			matchedAnchors: []
		},
		internalTotal: 0,
		internalDofollow: 0,
		internalNofollow: 0,
		externalTotal: 0,
		externalDofollow: 0,
		externalNofollow: 0,
		otherTotal: 0,
		otherDofollow: 0,
		otherNofollow: 0
	};

	for (var i = 0; i < anchors.length; i++) {
		var currentAnchor = anchors[i];

		var linkType = (0, _getLinkType2.default)(currentAnchor, permalink);
		var linkFollow = (0, _checkNofollow2.default)(currentAnchor);

		linkCount[linkType + "Total"]++;
		linkCount[linkType + linkFollow]++;
	}

	var keywordInAnchors = keywordInAnchor(paper, researcher, anchors, permalink);
	linkCount.keyword.totalKeyword = keywordInAnchors.totalKeyword;
	linkCount.keyword.matchedAnchors = keywordInAnchors.matchedAnchors;

	return linkCount;
};

exports.default = countLinkTypes;
//# sourceMappingURL=getLinkStatistics.js.map
