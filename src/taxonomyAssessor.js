"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getTextLengthAssessment = undefined;

var _util = require("util");

var _IntroductionKeywordAssessment = require("./assessments/seo/IntroductionKeywordAssessment");

var _IntroductionKeywordAssessment2 = _interopRequireDefault(_IntroductionKeywordAssessment);

var _KeyphraseLengthAssessment = require("./assessments/seo/KeyphraseLengthAssessment");

var _KeyphraseLengthAssessment2 = _interopRequireDefault(_KeyphraseLengthAssessment);

var _KeywordDensityAssessment = require("./assessments/seo/KeywordDensityAssessment");

var _KeywordDensityAssessment2 = _interopRequireDefault(_KeywordDensityAssessment);

var _MetaDescriptionKeywordAssessment = require("./assessments/seo/MetaDescriptionKeywordAssessment");

var _MetaDescriptionKeywordAssessment2 = _interopRequireDefault(_MetaDescriptionKeywordAssessment);

var _TitleKeywordAssessment = require("./assessments/seo/TitleKeywordAssessment");

var _TitleKeywordAssessment2 = _interopRequireDefault(_TitleKeywordAssessment);

var _taxonomyTextLengthAssessment = require("./assessments/seo/taxonomyTextLengthAssessment");

var _taxonomyTextLengthAssessment2 = _interopRequireDefault(_taxonomyTextLengthAssessment);

var _UrlKeywordAssessment = require("./assessments/seo/UrlKeywordAssessment");

var _UrlKeywordAssessment2 = _interopRequireDefault(_UrlKeywordAssessment);

var _assessor = require("./assessor");

var _assessor2 = _interopRequireDefault(_assessor);

var _MetaDescriptionLengthAssessment = require("./assessments/seo/MetaDescriptionLengthAssessment");

var _MetaDescriptionLengthAssessment2 = _interopRequireDefault(_MetaDescriptionLengthAssessment);

var _TextLengthAssessment = require("./assessments/seo/TextLengthAssessment");

var _TextLengthAssessment2 = _interopRequireDefault(_TextLengthAssessment);

var _PageTitleWidthAssessment = require("./assessments/seo/PageTitleWidthAssessment");

var _PageTitleWidthAssessment2 = _interopRequireDefault(_PageTitleWidthAssessment);

var _UrlLengthAssessment = require("./assessments/seo/UrlLengthAssessment");

var _UrlLengthAssessment2 = _interopRequireDefault(_UrlLengthAssessment);

var _urlStopWordsAssessment = require("./assessments/seo/urlStopWordsAssessment");

var _urlStopWordsAssessment2 = _interopRequireDefault(_urlStopWordsAssessment);

var _FunctionWordsInKeyphraseAssessment = require("./assessments/seo/FunctionWordsInKeyphraseAssessment");

var _FunctionWordsInKeyphraseAssessment2 = _interopRequireDefault(_FunctionWordsInKeyphraseAssessment);

var _SingleH1Assessment = require("./assessments/seo/SingleH1Assessment");

var _SingleH1Assessment2 = _interopRequireDefault(_SingleH1Assessment);

var _shortlinker = require("./helpers/shortlinker");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns the text length assessment to use, based on whether recalibration has been
 * activated or not.
 *
 * @param {boolean} useRecalibration If the recalibration assessment should be used or not.
 * @returns {Object} The text length assessment to use.
 */
var getTextLengthAssessment = exports.getTextLengthAssessment = function getTextLengthAssessment(useRecalibration) {
	// Export so it can be used in tests.
	if (useRecalibration) {
		return new _TextLengthAssessment2.default({
			recommendedMinimum: 250,
			slightlyBelowMinimum: 200,
			belowMinimum: 100,
			veryFarBelowMinimum: 50,
			urlTitle: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34j"),
			urlCallToAction: (0, _shortlinker.createAnchorOpeningTag)("https://yoa.st/34k")
		});
	}
	return _taxonomyTextLengthAssessment2.default;
};

/**
 * Creates the Assessor used for taxonomy pages.
 *
 * @param {object} i18n The i18n object used for translations.
 * @constructor
 */
var TaxonomyAssessor = function TaxonomyAssessor(i18n) {
	_assessor2.default.call(this, i18n);
	this.type = "TaxonomyAssessor";

	// Get the text length boundaries (they are different for recalibration).
	var textLengthAssessment = getTextLengthAssessment(process.env.YOAST_RECALIBRATION === "enabled");

	if (process.env.YOAST_RECALIBRATION === "enabled") {
		this._assessments = [new _IntroductionKeywordAssessment2.default(), new _KeyphraseLengthAssessment2.default(), new _KeywordDensityAssessment2.default(), new _MetaDescriptionKeywordAssessment2.default(), new _MetaDescriptionLengthAssessment2.default(), textLengthAssessment, new _TitleKeywordAssessment2.default(), new _PageTitleWidthAssessment2.default(), new _UrlKeywordAssessment2.default(), new _FunctionWordsInKeyphraseAssessment2.default(), new _SingleH1Assessment2.default()];
	} else {
		this._assessments = [new _IntroductionKeywordAssessment2.default(), new _KeyphraseLengthAssessment2.default(), new _KeywordDensityAssessment2.default(), new _MetaDescriptionKeywordAssessment2.default(), new _MetaDescriptionLengthAssessment2.default(), textLengthAssessment, new _TitleKeywordAssessment2.default(), new _PageTitleWidthAssessment2.default(), new _UrlKeywordAssessment2.default(), new _UrlLengthAssessment2.default(), _urlStopWordsAssessment2.default, new _FunctionWordsInKeyphraseAssessment2.default()];
	}
};

(0, _util.inherits)(TaxonomyAssessor, _assessor2.default);

exports.default = TaxonomyAssessor;
//# sourceMappingURL=taxonomyAssessor.js.map
