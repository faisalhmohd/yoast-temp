"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _util = require("util");

var _IntroductionKeywordAssessment = require("../assessments/seo/IntroductionKeywordAssessment");

var _IntroductionKeywordAssessment2 = _interopRequireDefault(_IntroductionKeywordAssessment);

var _KeyphraseLengthAssessment = require("../assessments/seo/KeyphraseLengthAssessment");

var _KeyphraseLengthAssessment2 = _interopRequireDefault(_KeyphraseLengthAssessment);

var _KeywordDensityAssessment = require("../assessments/seo/KeywordDensityAssessment");

var _KeywordDensityAssessment2 = _interopRequireDefault(_KeywordDensityAssessment);

var _MetaDescriptionKeywordAssessment = require("../assessments/seo/MetaDescriptionKeywordAssessment");

var _MetaDescriptionKeywordAssessment2 = _interopRequireDefault(_MetaDescriptionKeywordAssessment);

var _TextCompetingLinksAssessment = require("../assessments/seo/TextCompetingLinksAssessment");

var _TextCompetingLinksAssessment2 = _interopRequireDefault(_TextCompetingLinksAssessment);

var _InternalLinksAssessment = require("../assessments/seo/InternalLinksAssessment");

var _InternalLinksAssessment2 = _interopRequireDefault(_InternalLinksAssessment);

var _TitleKeywordAssessment = require("../assessments/seo/TitleKeywordAssessment");

var _TitleKeywordAssessment2 = _interopRequireDefault(_TitleKeywordAssessment);

var _UrlKeywordAssessment = require("../assessments/seo/UrlKeywordAssessment");

var _UrlKeywordAssessment2 = _interopRequireDefault(_UrlKeywordAssessment);

var _assessor = require("../assessor");

var _assessor2 = _interopRequireDefault(_assessor);

var _seoAssessor = require("../seoAssessor");

var _seoAssessor2 = _interopRequireDefault(_seoAssessor);

var _MetaDescriptionLengthAssessment = require("../assessments/seo/MetaDescriptionLengthAssessment");

var _MetaDescriptionLengthAssessment2 = _interopRequireDefault(_MetaDescriptionLengthAssessment);

var _SubHeadingsKeywordAssessment = require("../assessments/seo/SubHeadingsKeywordAssessment");

var _SubHeadingsKeywordAssessment2 = _interopRequireDefault(_SubHeadingsKeywordAssessment);

var _TextImagesAssessment = require("../assessments/seo/TextImagesAssessment");

var _TextImagesAssessment2 = _interopRequireDefault(_TextImagesAssessment);

var _TextLengthAssessment = require("../assessments/seo/TextLengthAssessment");

var _TextLengthAssessment2 = _interopRequireDefault(_TextLengthAssessment);

var _OutboundLinksAssessment = require("../assessments/seo/OutboundLinksAssessment");

var _OutboundLinksAssessment2 = _interopRequireDefault(_OutboundLinksAssessment);

var _PageTitleWidthAssessment = require("../assessments/seo/PageTitleWidthAssessment");

var _PageTitleWidthAssessment2 = _interopRequireDefault(_PageTitleWidthAssessment);

var _UrlLengthAssessment = require("../assessments/seo/UrlLengthAssessment");

var _UrlLengthAssessment2 = _interopRequireDefault(_UrlLengthAssessment);

var _urlStopWordsAssessment = require("../assessments/seo/urlStopWordsAssessment");

var _urlStopWordsAssessment2 = _interopRequireDefault(_urlStopWordsAssessment);

var _FunctionWordsInKeyphraseAssessment = require("../assessments/seo/FunctionWordsInKeyphraseAssessment");

var _FunctionWordsInKeyphraseAssessment2 = _interopRequireDefault(_FunctionWordsInKeyphraseAssessment);

var _SingleH1Assessment = require("../assessments/seo/SingleH1Assessment");

var _SingleH1Assessment2 = _interopRequireDefault(_SingleH1Assessment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates the Assessor
 *
 * @param {Object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var CornerstoneSEOAssessor = function CornerstoneSEOAssessor(i18n, options) {
	_assessor2.default.call(this, i18n, options);
	this.type = "CornerstoneSEOAssessor";

	if (process.env.YOAST_RECALIBRATION === "enabled") {
		this._assessments = [new _IntroductionKeywordAssessment2.default(), new _KeyphraseLengthAssessment2.default(), new _KeywordDensityAssessment2.default(), new _MetaDescriptionKeywordAssessment2.default(), new _MetaDescriptionLengthAssessment2.default({
			scores: {
				tooLong: 3,
				tooShort: 3
			}
		}), new _SubHeadingsKeywordAssessment2.default(), new _TextCompetingLinksAssessment2.default(), new _TextImagesAssessment2.default({
			scores: {
				noImages: 3,
				withAltNonKeyword: 3,
				withAlt: 3,
				noAlt: 3
			}
		}), new _TextLengthAssessment2.default({
			recommendedMinimum: 900,
			slightlyBelowMinimum: 400,
			belowMinimum: 300,

			scores: {
				belowMinimum: -20,
				farBelowMinimum: -20
			}
		}), new _OutboundLinksAssessment2.default({
			scores: {
				noLinks: 3
			}
		}), new _TitleKeywordAssessment2.default(), new _InternalLinksAssessment2.default(), new _PageTitleWidthAssessment2.default({
			scores: {
				widthTooShort: 3,
				widthTooLong: 3
			}
		}), new _UrlKeywordAssessment2.default({
			scores: {
				okay: 3
			}
		}), new _FunctionWordsInKeyphraseAssessment2.default(), new _SingleH1Assessment2.default()];
	} else {
		this._assessments = [new _IntroductionKeywordAssessment2.default(), new _KeyphraseLengthAssessment2.default(), new _KeywordDensityAssessment2.default(), new _MetaDescriptionKeywordAssessment2.default(), new _MetaDescriptionLengthAssessment2.default({
			scores: {
				tooLong: 3,
				tooShort: 3
			}
		}), new _SubHeadingsKeywordAssessment2.default({
			scoresRegular: {
				noMatches: 3,
				oneMatch: 6,
				multipleMatches: 9
			}
		}), new _TextCompetingLinksAssessment2.default(), new _TextImagesAssessment2.default({
			scores: {
				noImages: 3,
				withAltNonKeyword: 3,
				withAlt: 3,
				noAlt: 3
			}
		}), new _TextLengthAssessment2.default({
			recommendedMinimum: 900,
			slightlyBelowMinimum: 400,
			belowMinimum: 300,

			scores: {
				belowMinimum: -20,
				farBelowMinimum: -20
			}
		}), new _OutboundLinksAssessment2.default({
			scores: {
				noLinks: 3
			}
		}), new _TitleKeywordAssessment2.default(), new _InternalLinksAssessment2.default(), new _PageTitleWidthAssessment2.default({
			scores: {
				widthTooShort: 3,
				widthTooLong: 3
			}
		}), new _UrlKeywordAssessment2.default({
			scores: {
				okay: 3
			}
		}), new _UrlLengthAssessment2.default({
			scores: {
				tooLong: 3
			}
		}), _urlStopWordsAssessment2.default, new _FunctionWordsInKeyphraseAssessment2.default()];
	}
};

(0, _util.inherits)(CornerstoneSEOAssessor, _seoAssessor2.default);

exports.default = CornerstoneSEOAssessor;
//# sourceMappingURL=seoAssessor.js.map
