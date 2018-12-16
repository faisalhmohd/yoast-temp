"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // External dependencies.


// YoastSEO.js dependencies.


var _autop = require("@wordpress/autop");

var _jed = require("jed");

var _jed2 = _interopRequireDefault(_jed);

var _lodashEs = require("lodash");

var _loglevel = require("loglevel");

var _assessments = require("../assessments");

var assessments = _interopRequireWildcard(_assessments);

var _bundledPlugins = require("../bundledPlugins");

var bundledPlugins = _interopRequireWildcard(_bundledPlugins);

var _helpers = require("../helpers");

var helpers = _interopRequireWildcard(_helpers);

var _markers = require("../markers");

var markers = _interopRequireWildcard(_markers);

var _stringProcessing = require("../stringProcessing");

var string = _interopRequireWildcard(_stringProcessing);

var _interpreters = require("../interpreters");

var interpreters = _interopRequireWildcard(_interpreters);

var _config = require("../config");

var config = _interopRequireWildcard(_config);

var _assessor = require("../assessor");

var _assessor2 = _interopRequireDefault(_assessor);

var _assessment = require("../assessment");

var _assessment2 = _interopRequireDefault(_assessment);

var _seoAssessor = require("../seoAssessor");

var _seoAssessor2 = _interopRequireDefault(_seoAssessor);

var _contentAssessor = require("../contentAssessor");

var _contentAssessor2 = _interopRequireDefault(_contentAssessor);

var _taxonomyAssessor = require("../taxonomyAssessor");

var _taxonomyAssessor2 = _interopRequireDefault(_taxonomyAssessor);

var _pluggable = require("../pluggable");

var _pluggable2 = _interopRequireDefault(_pluggable);

var _researcher = require("../researcher");

var _researcher2 = _interopRequireDefault(_researcher);

var _snippetPreview = require("../snippetPreview");

var _snippetPreview2 = _interopRequireDefault(_snippetPreview);

var _Paper = require("../values/Paper");

var _Paper2 = _interopRequireDefault(_Paper);

var _AssessmentResult = require("../values/AssessmentResult");

var _AssessmentResult2 = _interopRequireDefault(_AssessmentResult);

var _relatedKeywordAssessor = require("../relatedKeywordAssessor");

var _relatedKeywordAssessor2 = _interopRequireDefault(_relatedKeywordAssessor);

var _contentAssessor3 = require("../cornerstone/contentAssessor");

var _contentAssessor4 = _interopRequireDefault(_contentAssessor3);

var _relatedKeywordAssessor3 = require("../cornerstone/relatedKeywordAssessor");

var _relatedKeywordAssessor4 = _interopRequireDefault(_relatedKeywordAssessor3);

var _seoAssessor3 = require("../cornerstone/seoAssessor");

var _seoAssessor4 = _interopRequireDefault(_seoAssessor3);

var _invalidType = require("../errors/invalidType");

var _invalidType2 = _interopRequireDefault(_invalidType);

var _includesAny = require("../helpers/includesAny");

var _includesAny2 = _interopRequireDefault(_includesAny);

var _shortlinker = require("../helpers/shortlinker");

var _relatedKeywordTaxonomyAssessor = require("../relatedKeywordTaxonomyAssessor");

var _relatedKeywordTaxonomyAssessor2 = _interopRequireDefault(_relatedKeywordTaxonomyAssessor);

var _scheduler = require("./scheduler");

var _scheduler2 = _interopRequireDefault(_scheduler);

var _transporter = require("./transporter");

var _transporter2 = _interopRequireDefault(_transporter);

var _wrapTryCatchAroundAction = require("./wrapTryCatchAroundAction");

var _wrapTryCatchAroundAction2 = _interopRequireDefault(_wrapTryCatchAroundAction);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var YoastSEO = {
	Assessor: _assessor2.default,
	Assessment: _assessment2.default,
	SEOAssessor: _seoAssessor2.default,
	ContentAssessor: _contentAssessor2.default,
	TaxonomyAssessor: _taxonomyAssessor2.default,
	Pluggable: _pluggable2.default,
	Researcher: _researcher2.default,
	SnippetPreview: _snippetPreview2.default,
	RelatedKeywordAssessor: _relatedKeywordAssessor2.default,

	Paper: _Paper2.default,
	AssessmentResult: _AssessmentResult2.default,

	assessments: assessments,
	bundledPlugins: bundledPlugins,
	helpers: helpers,
	markers: markers,
	string: string,
	interpreters: interpreters,
	config: config
};

// Internal dependencies.


var keyphraseDistribution = new assessments.seo.KeyphraseDistributionAssessment();

var logger = (0, _loglevel.getLogger)("yoast-analysis-worker");
logger.setDefaultLevel("error");

/**
 * Analysis Web Worker.
 *
 * Worker API:     https://developer.mozilla.org/en-US/docs/Web/API/Worker
 * Webpack loader: https://github.com/webpack-contrib/worker-loader
 */

var AnalysisWebWorker = function () {
	/**
  * Initializes the AnalysisWebWorker class.
  *
  * @param {Object} scope The scope for the messaging. Expected to have the
  *                       `onmessage` event and the `postMessage` function.
  */
	function AnalysisWebWorker(scope) {
		_classCallCheck(this, AnalysisWebWorker);

		this._scope = scope;

		this._configuration = {
			contentAnalysisActive: true,
			keywordAnalysisActive: true,
			useCornerstone: false,
			useTaxonomy: false,
			useKeywordDistribution: false,
			// The locale used for language-specific configurations in Flesch-reading ease and Sentence length assessments.
			locale: "en_US"
		};

		this._scheduler = new _scheduler2.default();

		this._paper = null;
		this._relatedKeywords = {};

		this._i18n = AnalysisWebWorker.createI18n();
		this._researcher = new _researcher2.default(this._paper);

		this._contentAssessor = null;
		this._seoAssessor = null;
		this._relatedKeywordAssessor = null;

		/*
   * The cached analyses results.
   *
   * A single result has the following structure:
   * {AssessmentResult[]} readability.results An array of assessment results; in serialized format.
   * {number}             readability.score   The overall score.
   *
   * The results have the following structure.
   * {Object} readability Content assessor results.
   * {Object} seo         SEO assessor results, per keyword identifier or empty string for the main.
   * {Object} seo[ "" ]   The result of the paper analysis for the main keyword.
   * {Object} seo[ key ]  Same as above, but instead for a related keyword.
   */
		this._results = {
			readability: {
				results: [],
				score: 0
			},
			seo: {
				"": {
					results: [],
					score: 0
				}
			}
		};
		this._registeredAssessments = [];
		this._registeredMessageHandlers = {};

		// Bind actions to this scope.
		this.analyze = this.analyze.bind(this);
		this.analyzeDone = this.analyzeDone.bind(this);
		this.analyzeRelatedKeywordsDone = this.analyzeRelatedKeywordsDone.bind(this);
		this.loadScript = this.loadScript.bind(this);
		this.loadScriptDone = this.loadScriptDone.bind(this);
		this.customMessage = this.customMessage.bind(this);
		this.customMessageDone = this.customMessageDone.bind(this);
		this.clearCache = this.clearCache.bind(this);
		this.runResearch = this.runResearch.bind(this);
		this.runResearchDone = this.runResearchDone.bind(this);

		// Bind register functions to this scope.
		this.registerAssessment = this.registerAssessment.bind(this);
		this.registerMessageHandler = this.registerMessageHandler.bind(this);
		this.refreshAssessment = this.refreshAssessment.bind(this);

		// Bind event handlers to this scope.
		this.handleMessage = this.handleMessage.bind(this);

		// Wrap try/catch around actions.
		this.analyzeRelatedKeywords = (0, _wrapTryCatchAroundAction2.default)(logger, this.analyze, "An error occurred while running the related keywords analysis.");
		/*
   * Overwrite this.analyze after we use it in this.analyzeRelatedKeywords so that this.analyzeRelatedKeywords
   * doesn't use the overwritten version. Therefore, this order shouldn't be changed.
   */
		this.analyze = (0, _wrapTryCatchAroundAction2.default)(logger, this.analyze, "An error occurred while running the analysis.");
	}

	/**
  * Registers this web worker with the scope passed to it's constructor.
  *
  * @returns {void}
  */


	_createClass(AnalysisWebWorker, [{
		key: "register",
		value: function register() {
			this._scope.onmessage = this.handleMessage;
			this._scope.analysisWorker = {
				registerAssessment: this.registerAssessment,
				registerMessageHandler: this.registerMessageHandler,
				refreshAssessment: this.refreshAssessment
			};
			this._scope.yoast = this._scope.yoast || {};
			this._scope.yoast.analysis = YoastSEO;
		}

		/**
   * Receives the post message and determines the action.
   *
   * See: https://developer.mozilla.org/en-US/docs/Web/API/Worker/onmessage
   *
   * @param {MessageEvent} event              The post message event.
   * @param {Object}       event.data         The data object.
   * @param {string}       event.data.type    The action type.
   * @param {string}       event.data.id      The request id.
   * @param {string}       event.data.payload The payload of the action.
   *
   * @returns {void}
   */

	}, {
		key: "handleMessage",
		value: function handleMessage(_ref) {
			var _ref$data = _ref.data,
			    type = _ref$data.type,
			    id = _ref$data.id,
			    payload = _ref$data.payload;

			payload = _transporter2.default.parse(payload);

			logger.debug("AnalysisWebWorker incoming:", type, id, payload);

			switch (type) {
				case "initialize":
					this.initialize(id, payload);
					this._scheduler.startPolling();
					break;
				case "analyze":
					this._scheduler.schedule({
						id: id,
						execute: this.analyze,
						done: this.analyzeDone,
						data: payload,
						type: type
					});
					break;
				case "analyzeRelatedKeywords":
					this._scheduler.schedule({
						id: id,
						execute: this.analyzeRelatedKeywords,
						done: this.analyzeRelatedKeywordsDone,
						data: payload,
						type: type
					});
					break;
				case "loadScript":
					this._scheduler.schedule({
						id: id,
						execute: this.loadScript,
						done: this.loadScriptDone,
						data: payload,
						type: type
					});
					break;
				case "runResearch":
					this._scheduler.schedule({
						id: id,
						execute: this.runResearch,
						done: this.runResearchDone,
						data: payload
					});
					break;
				case "customMessage":
					{
						var name = payload.name;
						if (name && this._registeredMessageHandlers[name]) {
							this._scheduler.schedule({
								id: id,
								execute: this.customMessage,
								done: this.customMessageDone,
								data: payload,
								type: type
							});
							break;
						}
						this.customMessageDone(id, { error: new Error("No message handler registered for messages with name: " + name) });
						break;
					}
				default:
					console.warn("AnalysisWebWorker unrecognized action:", type);
			}
		}

		/**
   * Initializes i18n object based on passed configuration.
   *
   * @param {Object} [translations] The translations to be used in the current
   *                                instance.
   *
   * @returns {Jed} Jed instance.
   */

	}, {
		key: "createContentAssessor",


		/**
   * Initializes the appropriate content assessor.
   *
   * @returns {null|ContentAssessor|CornerstoneContentAssessor} The chosen
   *                                                            content
   *                                                            assessor.
   */
		value: function createContentAssessor() {
			var _configuration = this._configuration,
			    contentAnalysisActive = _configuration.contentAnalysisActive,
			    useCornerstone = _configuration.useCornerstone,
			    locale = _configuration.locale;


			if (contentAnalysisActive === false) {
				return null;
			}

			var assessor = useCornerstone === true ? new _contentAssessor4.default(this._i18n, { locale: locale }) : new _contentAssessor2.default(this._i18n, { locale: locale });

			return assessor;
		}

		/**
   * Initializes the appropriate SEO assessor.
   *
   * @returns {null|SEOAssessor|CornerstoneSEOAssessor|TaxonomyAssessor} The chosen
   *                                                                     SEO
   *                                                                     assessor.
   */

	}, {
		key: "createSEOAssessor",
		value: function createSEOAssessor() {
			var _configuration2 = this._configuration,
			    keywordAnalysisActive = _configuration2.keywordAnalysisActive,
			    useCornerstone = _configuration2.useCornerstone,
			    useKeywordDistribution = _configuration2.useKeywordDistribution,
			    useTaxonomy = _configuration2.useTaxonomy,
			    locale = _configuration2.locale;


			if (keywordAnalysisActive === false) {
				return null;
			}

			var assessor = void 0;

			if (useTaxonomy === true) {
				assessor = new _taxonomyAssessor2.default(this._i18n);
			} else {
				assessor = useCornerstone === true ? new _seoAssessor4.default(this._i18n, { locale: locale, researcher: this._researcher }) : new _seoAssessor2.default(this._i18n, { locale: locale, researcher: this._researcher });
			}

			if (useKeywordDistribution && (0, _lodashEs.isUndefined)(assessor.getAssessment("keyphraseDistribution"))) {
				assessor.addAssessment("keyphraseDistribution", keyphraseDistribution);
			}

			this._registeredAssessments.forEach(function (_ref2) {
				var name = _ref2.name,
				    assessment = _ref2.assessment;

				if ((0, _lodashEs.isUndefined)(assessor.getAssessment(name))) {
					assessor.addAssessment(name, assessment);
				}
			});

			return assessor;
		}

		/**
   * Initializes the appropriate SEO assessor for related keywords.
   *
   * @returns {null|SEOAssessor|CornerstoneSEOAssessor|TaxonomyAssessor} The chosen
   *                                                                     related keywords
   *                                                                     assessor.
   */

	}, {
		key: "createRelatedKeywordsAssessor",
		value: function createRelatedKeywordsAssessor() {
			var _configuration3 = this._configuration,
			    keywordAnalysisActive = _configuration3.keywordAnalysisActive,
			    useCornerstone = _configuration3.useCornerstone,
			    useTaxonomy = _configuration3.useTaxonomy,
			    locale = _configuration3.locale;


			if (keywordAnalysisActive === false) {
				return null;
			}

			var assessor = void 0;

			if (useTaxonomy === true) {
				assessor = new _relatedKeywordTaxonomyAssessor2.default(this._i18n);
			} else {
				assessor = useCornerstone === true ? new _relatedKeywordAssessor4.default(this._i18n, { locale: locale, researcher: this._researcher }) : new _relatedKeywordAssessor2.default(this._i18n, { locale: locale, researcher: this._researcher });
			}

			this._registeredAssessments.forEach(function (_ref3) {
				var name = _ref3.name,
				    assessment = _ref3.assessment;

				if ((0, _lodashEs.isUndefined)(assessor.getAssessment(name))) {
					assessor.addAssessment(name, assessment);
				}
			});

			return assessor;
		}

		/**
   * Sends a message.
   *
   * @param {string} type      The message type.
   * @param {number} id        The request id.
   * @param {Object} [payload] The payload to deliver.
   *
   * @returns {void}
   */

	}, {
		key: "send",
		value: function send(type, id) {
			var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			logger.debug("AnalysisWebWorker outgoing:", type, id, payload);

			payload = _transporter2.default.serialize(payload);

			this._scope.postMessage({
				type: type,
				id: id,
				payload: payload
			});
		}

		/**
   * Checks which assessors should update giving a configuration.
   *
   * @param {Object}   configuration          The configuration to check.
   * @param {Assessor} [contentAssessor=null] The content assessor.
   * @param {Assessor} [seoAssessor=null]     The SEO assessor.
   *
   * @returns {Object} Containing seo and readability with true or false.
   */

	}, {
		key: "initialize",


		/**
   * Configures the analysis worker.
   *
   * @param {number}  id                                     The request id.
   * @param {Object}  configuration                          The configuration object.
   * @param {boolean} [configuration.contentAnalysisActive]  Whether the content analysis is active.
   * @param {boolean} [configuration.keywordAnalysisActive]  Whether the keyword analysis is active.
   * @param {boolean} [configuration.useCornerstone]         Whether the paper is cornerstone or not.
   * @param {boolean} [configuration.useTaxonomy]            Whether the taxonomy assessor should be used.
   * @param {boolean} [configuration.useKeywordDistribution] Whether the keyphraseDistribution assessment should run.
   * @param {string}  [configuration.locale]                 The locale used in the seo assessor.
   * @param {Object}  [configuration.translations]           The translation strings.
   * @param {Object}  [configuration.researchData]           Extra research data.
   * @param {Object}  [configuration.defaultQueryParams]     The default query params for the Shortlinker.
   * @param {string}  [configuration.logLevel]               Log level, see: https://github.com/pimterry/loglevel#documentation
   *
   * @returns {void}
   */
		value: function initialize(id, configuration) {
			var _this = this;

			var update = AnalysisWebWorker.shouldAssessorsUpdate(configuration, this._contentAssessor, this._seoAssessor);

			if ((0, _lodashEs.has)(configuration, "translations")) {
				this._i18n = AnalysisWebWorker.createI18n(configuration.translations);
				delete configuration.translations;
			}

			if ((0, _lodashEs.has)(configuration, "researchData")) {
				(0, _lodashEs.forEach)(configuration.researchData, function (data, research) {
					_this._researcher.addResearchData(research, data);
				});
				delete configuration.researchData;
			}

			if ((0, _lodashEs.has)(configuration, "defaultQueryParams")) {
				(0, _shortlinker.configureShortlinker)({ params: configuration.defaultQueryParams });
				delete configuration.defaultQueryParams;
			}

			if ((0, _lodashEs.has)(configuration, "logLevel")) {
				logger.setLevel(configuration.logLevel, false);
				delete configuration.logLevel;
			}

			this._configuration = (0, _lodashEs.merge)(this._configuration, configuration);

			if (update.readability) {
				this._contentAssessor = this.createContentAssessor();
			}
			if (update.seo) {
				this._seoAssessor = this.createSEOAssessor();
				this._relatedKeywordAssessor = this.createRelatedKeywordsAssessor();
			}

			// Reset the paper in order to not use the cached results on analyze.
			this.clearCache();

			this.send("initialize:done", id);
		}

		/**
   * Register an assessment for a specific plugin.
   *
   * @param {string}   name       The name of the assessment.
   * @param {function} assessment The function to run as an assessment.
   * @param {string}   pluginName The name of the plugin associated with the assessment.
   *
   * @returns {boolean} Whether registering the assessment was successful.
   */

	}, {
		key: "registerAssessment",
		value: function registerAssessment(name, assessment, pluginName) {
			if (!(0, _lodashEs.isString)(name)) {
				throw new _invalidType2.default("Failed to register assessment for plugin " + pluginName + ". Expected parameter `name` to be a string.");
			}

			if (!(0, _lodashEs.isObject)(assessment)) {
				throw new _invalidType2.default("Failed to register assessment for plugin " + pluginName + ". Expected parameter `assessment` to be a function.");
			}

			if (!(0, _lodashEs.isString)(pluginName)) {
				throw new _invalidType2.default("Failed to register assessment for plugin " + pluginName + ". Expected parameter `pluginName` to be a string.");
			}

			// Prefix the name with the pluginName so the test name is always unique.
			var combinedName = pluginName + "-" + name;

			if (this._seoAssessor !== null) {
				this._seoAssessor.addAssessment(combinedName, assessment);
			}
			this._registeredAssessments.push({ combinedName: combinedName, assessment: assessment });

			this.refreshAssessment(name, pluginName);

			return true;
		}

		/**
   * Register a message handler for a specific plugin.
   *
   * @param {string}   name       The name of the message handler.
   * @param {function} handler    The function to run as an message handler.
   * @param {string}   pluginName The name of the plugin associated with the message handler.
   *
   * @returns {boolean} Whether registering the message handler was successful.
   */

	}, {
		key: "registerMessageHandler",
		value: function registerMessageHandler(name, handler, pluginName) {
			if (!(0, _lodashEs.isString)(name)) {
				throw new _invalidType2.default("Failed to register handler for plugin " + pluginName + ". Expected parameter `name` to be a string.");
			}

			if (!(0, _lodashEs.isObject)(handler)) {
				throw new _invalidType2.default("Failed to register handler for plugin " + pluginName + ". Expected parameter `handler` to be a function.");
			}

			if (!(0, _lodashEs.isString)(pluginName)) {
				throw new _invalidType2.default("Failed to register handler for plugin " + pluginName + ". Expected parameter `pluginName` to be a string.");
			}

			// Prefix the name with the pluginName so the test name is always unique.
			name = pluginName + "-" + name;

			this._registeredMessageHandlers[name] = handler;
		}

		/**
   * Refreshes an assessment in the analysis.
   *
   * Custom assessments can use this to mark their assessment as needing a
   * refresh.
   *
   * @param {string} name The name of the assessment.
   * @param {string} pluginName The name of the plugin associated with the assessment.
   *
   * @returns {boolean} Whether refreshing the assessment was successful.
   */

	}, {
		key: "refreshAssessment",
		value: function refreshAssessment(name, pluginName) {
			if (!(0, _lodashEs.isString)(name)) {
				throw new _invalidType2.default("Failed to refresh assessment for plugin " + pluginName + ". Expected parameter `name` to be a string.");
			}

			if (!(0, _lodashEs.isString)(pluginName)) {
				throw new _invalidType2.default("Failed to refresh assessment for plugin " + pluginName + ". Expected parameter `pluginName` to be a string.");
			}

			this.clearCache();
		}

		/**
   * Clears the worker cache to force a new analysis.
   *
   * @returns {void}
   */

	}, {
		key: "clearCache",
		value: function clearCache() {
			this._paper = null;
		}

		/**
   * Changes the locale in the configuration.
   *
   * If the locale is different:
   * - Update the configuration locale.
   * - Create the content assessor.
   *
   * @param {string} locale The locale to set.
   *
   * @returns {void}
   */

	}, {
		key: "setLocale",
		value: function setLocale(locale) {
			if (this._configuration.locale === locale) {
				return;
			}
			this._configuration.locale = locale;
			this._contentAssessor = this.createContentAssessor();
		}

		/**
   * Checks if the paper contains changes that are used for readability.
   *
   * @param {Paper} paper The paper to check against the cached paper.
   *
   * @returns {boolean} True if there are changes detected.
   */

	}, {
		key: "shouldReadabilityUpdate",
		value: function shouldReadabilityUpdate(paper) {
			if (this._paper === null) {
				return true;
			}

			if (this._paper.getText() !== paper.getText()) {
				return true;
			}

			return this._paper.getLocale() !== paper.getLocale();
		}

		/**
   * Checks if the related keyword contains changes that are used for seo.
   *
   * @param {string} key                     The identifier of the related keyword.
   * @param {Object} relatedKeyword          The related keyword object.
   * @param {string} relatedKeyword.keyword  The keyword.
   * @param {string} relatedKeyword.synonyms The synonyms.
   *
   * @returns {boolean} True if there are changes detected.
   */

	}, {
		key: "shouldSeoUpdate",
		value: function shouldSeoUpdate(key, _ref4) {
			var keyword = _ref4.keyword,
			    synonyms = _ref4.synonyms;

			if ((0, _lodashEs.isUndefined)(this._relatedKeywords[key])) {
				return true;
			}

			if (this._relatedKeywords[key].keyword !== keyword) {
				return true;
			}

			return this._relatedKeywords[key].synonyms !== synonyms;
		}

		/**
   * Runs analyses on a paper.
   *
   * The paper includes the keyword and synonyms data. However, this is
   * possibly just one instance of these. From here we are going to split up
   * this data and keep track of the different sets of keyword-synonyms and
   * their results.
   *
   * @param {number} id                        The request id.
   * @param {Object} payload                   The payload object.
   * @param {Object} payload.paper             The paper to analyze.
   * @param {Object} [payload.relatedKeywords] The related keywords.
   *
   * @returns {Object} The result, may not contain readability or seo.
   */

	}, {
		key: "analyze",
		value: function analyze(id, _ref5) {
			var _this2 = this;

			var paper = _ref5.paper,
			    _ref5$relatedKeywords = _ref5.relatedKeywords,
			    relatedKeywords = _ref5$relatedKeywords === undefined ? {} : _ref5$relatedKeywords;

			// Automatically add paragraph tags, like Wordpress does, on blocks padded by double newlines or html elements.
			paper._text = (0, _autop.autop)(paper._text);
			paper._text = string.removeHtmlBlocks(paper._text);
			var paperHasChanges = this._paper === null || !this._paper.equals(paper);
			var shouldReadabilityUpdate = this.shouldReadabilityUpdate(paper);

			if (paperHasChanges) {
				this._paper = paper;
				this._researcher.setPaper(this._paper);

				// Update the configuration locale to the paper locale.
				this.setLocale(this._paper.getLocale());
			}

			if (this._configuration.keywordAnalysisActive && this._seoAssessor) {
				if (paperHasChanges) {
					this._seoAssessor.assess(this._paper);

					// Reset the cached results for the related keywords here too.
					this._results.seo = {};
					this._results.seo[""] = {
						results: this._seoAssessor.results,
						score: this._seoAssessor.calculateOverallScore()
					};
				}

				// Start an analysis for every related keyword.
				var requestedRelatedKeywordKeys = [""];
				(0, _lodashEs.forEach)(relatedKeywords, function (relatedKeyword, key) {
					requestedRelatedKeywordKeys.push(key);

					_this2._relatedKeywords[key] = relatedKeyword;

					var relatedPaper = _Paper2.default.parse(_extends({}, _this2._paper.serialize(), {
						keyword: _this2._relatedKeywords[key].keyword,
						synonyms: _this2._relatedKeywords[key].synonyms
					}));

					_this2._relatedKeywordAssessor.assess(relatedPaper);

					_this2._results.seo[key] = {
						results: _this2._relatedKeywordAssessor.results,
						score: _this2._relatedKeywordAssessor.calculateOverallScore()
					};
				});

				// Clear the unrequested results, but only if there are requested related keywords.
				if (requestedRelatedKeywordKeys.length > 1) {
					this._results.seo = (0, _lodashEs.pickBy)(this._results.seo, function (relatedKeyword, key) {
						return (0, _lodashEs.includes)(requestedRelatedKeywordKeys, key);
					});
				}
			}

			if (this._configuration.contentAnalysisActive && this._contentAssessor && shouldReadabilityUpdate) {
				this._contentAssessor.assess(this._paper);

				this._results.readability = {
					results: this._contentAssessor.results,
					score: this._contentAssessor.calculateOverallScore()
				};
			}

			return this._results;
		}

		/**
   * Loads a new script to an external source.
   *
   * @param {number} id  The request id.
   * @param {string} url The url of the script to load;
   *
   * @returns {Object} An object containing whether or not the url was loaded, the url and possibly an error message.
   */

	}, {
		key: "loadScript",
		value: function loadScript(id, _ref6) {
			var url = _ref6.url;

			if ((0, _lodashEs.isUndefined)(url)) {
				return { loaded: false, url: url, message: "Load Script was called without an URL." };
			}

			try {
				this._scope.importScripts(url);
			} catch (error) {
				return { loaded: false, url: url, message: error.message };
			}

			return { loaded: true, url: url };
		}

		/**
   * Sends the load script result back.
   *
   * @param {number} id     The request id.
   * @param {Object} result The result.
   *
   * @returns {void}
   */

	}, {
		key: "loadScriptDone",
		value: function loadScriptDone(id, result) {
			if (!result.loaded) {
				this.send("loadScript:failed", id, result);
				return;
			}

			this.send("loadScript:done", id, result);
		}

		/**
   * Sends the analyze result back.
   *
   * @param {number} id     The request id.
   * @param {Object} result The result.
   *
   * @returns {void}
   */

	}, {
		key: "analyzeDone",
		value: function analyzeDone(id, result) {
			if (result.error) {
				this.send("analyze:failed", id, result);
				return;
			}
			this.send("analyze:done", id, result);
		}

		/**
   * Sends the analyze related keywords result back.
   *
   * @param {number} id     The request id.
   * @param {Object} result The result.
   *
   * @returns {void}
   */

	}, {
		key: "analyzeRelatedKeywordsDone",
		value: function analyzeRelatedKeywordsDone(id, result) {
			if (result.error) {
				this.send("analyzeRelatedKeywords:failed", id, result);
				return;
			}
			this.send("analyzeRelatedKeywords:done", id, result);
		}

		/**
   * Handle a custom message using the registered handler.
   *
   * @param {number} id   The request id.
   * @param {string} name The name of the message.
   * @param {Object} data The data of the message.
   *
   * @returns {Object} An object containing either success and data or an error.
   */

	}, {
		key: "customMessage",
		value: function customMessage(id, _ref7) {
			var name = _ref7.name,
			    data = _ref7.data;

			try {
				return {
					success: true,
					data: this._registeredMessageHandlers[name](data)
				};
			} catch (error) {
				return { error: error };
			}
		}

		/**
   * Send the result of a custom message back.
   *
   * @param {number} id     The request id.
   * @param {Object} result The result.
   *
   * @returns {void}
   */

	}, {
		key: "customMessageDone",
		value: function customMessageDone(id, result) {
			if (result.success) {
				this.send("customMessage:done", id, result.data);
				return;
			}
			this.send("customMessage:failed", result.error);
		}

		/**
   * Runs the specified research in the worker. Optionally pass a paper.
   *
   * @param {number} id     The request id.
   * @param {string} name   The name of the research to run.
   * @param {Paper} [paper] The paper to run the research on if it shouldn't
   *                        be run on the latest paper.
   *
   * @returns {Promise} The promise of the research.
   */

	}, {
		key: "runResearch",
		value: function runResearch(id, _ref8) {
			var name = _ref8.name,
			    _ref8$paper = _ref8.paper,
			    paper = _ref8$paper === undefined ? null : _ref8$paper;

			// When a specific paper is passed we create a temporary new researcher.
			var researcher = paper === null ? this._researcher : new _researcher2.default(paper);

			return researcher.getResearch(name);
		}

		/**
   * Send the result of a custom message back.
   *
   * @param {number} id     The request id.
   * @param {Object} result The result.
   *
   * @returns {void}
   */

	}, {
		key: "runResearchDone",
		value: function runResearchDone(id, result) {
			this.send("runResearch:done", id, result);
		}
	}], [{
		key: "createI18n",
		value: function createI18n(translations) {
			// Use default object to prevent Jed to erroring out.
			translations = translations || {
				domain: "js-text-analysis",
				// eslint-disable-next-line camelcase
				locale_data: {
					"js-text-analysis": {
						"": {}
					}
				}
			};

			return new _jed2.default(translations);
		}
	}, {
		key: "shouldAssessorsUpdate",
		value: function shouldAssessorsUpdate(configuration) {
			var contentAssessor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
			var seoAssessor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			var readability = ["contentAnalysisActive", "useCornerstone", "locale", "translations"];
			var seo = ["keywordAnalysisActive", "useCornerstone", "useTaxonomy", "useKeywordDistribution", "locale", "translations", "researchData"];
			var configurationKeys = Object.keys(configuration);

			return {
				readability: (0, _lodashEs.isNull)(contentAssessor) || (0, _includesAny2.default)(configurationKeys, readability),
				seo: (0, _lodashEs.isNull)(seoAssessor) || (0, _includesAny2.default)(configurationKeys, seo)
			};
		}
	}]);

	return AnalysisWebWorker;
}();

exports.default = AnalysisWebWorker;
//# sourceMappingURL=AnalysisWebWorker.js.map
