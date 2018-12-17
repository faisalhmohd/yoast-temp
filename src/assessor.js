"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _researcher = require("./researcher.js");

var _researcher2 = _interopRequireDefault(_researcher);

var _missingArgument = require("./errors/missingArgument");

var _missingArgument2 = _interopRequireDefault(_missingArgument);

var _removeDuplicateMarks = require("./markers/removeDuplicateMarks");

var _removeDuplicateMarks2 = _interopRequireDefault(_removeDuplicateMarks);

var _AssessmentResult = require("./values/AssessmentResult.js");

var _AssessmentResult2 = _interopRequireDefault(_AssessmentResult);

var _errors = require("./helpers/errors.js");

var _lodashEs = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ScoreRating = 9;

/**
 * Creates the Assessor.
 *
 * @param {Object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 * @param {Object} options.researcher The researcher to use in the assessor.
 *
 * @constructor
 */
var Assessor = function Assessor(i18n, options) {
  this.type = "Assessor";
  this.setI18n(i18n);
  this._assessments = [];

  this._options = options || {};

  if (!(0, _lodashEs.isUndefined)(this._options.researcher)) {
    this._researcher = this._options.researcher;
  }
};

/**
 * Checks if the i18n object is defined and sets it.
 *
 * @param {Object} i18n The i18n object used for translations.
 * @throws {MissingArgument} Parameter needs to be a valid i18n object.
 * @returns {void}
 */
Assessor.prototype.setI18n = function (i18n) {
  if ((0, _lodashEs.isUndefined)(i18n)) {
    throw new _missingArgument2.default("The assessor requires an i18n object.");
  }
  this.i18n = i18n;
};

/**
 * Gets all available assessments.
 * @returns {object} assessment
 */
Assessor.prototype.getAvailableAssessments = function () {
  return this._assessments;
};

/**
 * Checks whether or not the Assessment is applicable.
 *
 * @param {Object} assessment The Assessment object that needs to be checked.
 * @param {Paper} paper The Paper object to check against.
 * @param {Researcher} [researcher] The Researcher object containing additional information.
 * @returns {boolean} Whether or not the Assessment is applicable.
 */
Assessor.prototype.isApplicable = function (assessment, paper, researcher) {
  if (assessment.hasOwnProperty("isApplicable") || typeof assessment.isApplicable === "function") {
    return assessment.isApplicable(paper, researcher);
  }

  return true;
};

/**
 * Determines whether or not an assessment has a marker.
 *
 * @param {Object} assessment The assessment to check for.
 * @returns {boolean} Whether or not the assessment has a marker.
 */
Assessor.prototype.hasMarker = function (assessment) {
  return (0, _lodashEs.isFunction)(this._options.marker) && (assessment.hasOwnProperty("getMarks") || typeof assessment.getMarks === "function");
};

/**
 * Returns the specific marker for this assessor.
 *
 * @returns {Function} The specific marker for this assessor.
 */
Assessor.prototype.getSpecificMarker = function () {
  return this._options.marker;
};

/**
 * Returns the paper that was most recently assessed.
 *
 * @returns {Paper} The paper that was most recently assessed.
 */
Assessor.prototype.getPaper = function () {
  return this._lastPaper;
};

/**
 * Returns the marker for a given assessment, composes the specific marker with the assessment getMarks function.
 *
 * @param {Object} assessment The assessment for which we are retrieving the composed marker.
 * @param {Paper} paper The paper to retrieve the marker for.
 * @param {Researcher} researcher The researcher for the paper.
 * @returns {Function} A function that can mark the given paper according to the given assessment.
 */
Assessor.prototype.getMarker = function (assessment, paper, researcher) {
  var specificMarker = this._options.marker;

  return function () {
    var marks = assessment.getMarks(paper, researcher);
    marks = (0, _removeDuplicateMarks2.default)(marks);

    specificMarker(paper, marks);
  };
};

/**
 * Runs the researches defined in the tasklist or the default researches.
 *
 * @param {Paper} paper The paper to run assessments on.
 * @returns {void}
 */
Assessor.prototype.assess = function (paper) {
  if ((0, _lodashEs.isUndefined)(this._researcher)) {
    this._researcher = new _researcher2.default(paper);
  } else {
    this._researcher.setPaper(paper);
  }

  var assessments = this.getAvailableAssessments();
  this.results = [];

  assessments = (0, _lodashEs.filter)(assessments, function (assessment) {
    return this.isApplicable(assessment, paper, this._researcher);
  }.bind(this));

  this.setHasMarkers(false);
  this.results = (0, _lodashEs.map)(assessments, this.executeAssessment.bind(this, paper, this._researcher));

  this._lastPaper = paper;
};

/**
 * Sets the value of has markers with a boolean to determine if there are markers.
 *
 * @param {boolean} hasMarkers True when there are markers, otherwise it is false.
 * @returns {void}
 */
Assessor.prototype.setHasMarkers = function (hasMarkers) {
  this._hasMarkers = hasMarkers;
};

/**
 * Returns true when there are markers.
 *
 * @returns {boolean} Are there markers
 */
Assessor.prototype.hasMarkers = function () {
  return this._hasMarkers;
};

/**
 * Executes an assessment and returns the AssessmentResult.
 *
 * @param {Paper} paper The paper to pass to the assessment.
 * @param {Researcher} researcher The researcher to pass to the assessment.
 * @param {Object} assessment The assessment to execute.
 * @returns {AssessmentResult} The result of the assessment.
 */
Assessor.prototype.executeAssessment = function (paper, researcher, assessment) {
  var result;

  try {
    result = assessment.getResult(paper, researcher, this.i18n);
    result.setIdentifier(assessment.identifier);

    if (result.hasMarks()) {
      result.marks = assessment.getMarks(paper, researcher);
      result.marks = (0, _removeDuplicateMarks2.default)(result.marks);
    }

    if (result.hasMarks() && this.hasMarker(assessment)) {
      this.setHasMarkers(true);

      result.setMarker(this.getMarker(assessment, paper, researcher));
    }
  } catch (assessmentError) {
    (0, _errors.showTrace)(assessmentError);

    result = new _AssessmentResult2.default();

    result.setScore(-1);
    result.setText(this.i18n.sprintf(
    /* Translators: %1$s expands to the name of the assessment. */
    this.i18n.dgettext("js-text-analysis", "An error occurred in the '%1$s' assessment"), assessment.identifier, assessmentError));
  }
  return result;
};

/**
 * Filters out all assessmentresults that have no score and no text.
 *
 * @returns {Array<AssessmentResult>} The array with all the valid assessments.
 */
Assessor.prototype.getValidResults = function () {
  return (0, _lodashEs.filter)(this.results, function (result) {
    return this.isValidResult(result);
  }.bind(this));
};

/**
 * Returns if an assessmentResult is valid.
 *
 * @param {object} assessmentResult The assessmentResult to validate.
 * @returns {boolean} whether or not the result is valid.
 */
Assessor.prototype.isValidResult = function (assessmentResult) {
  return assessmentResult.hasScore() && assessmentResult.hasText();
};

/**
 * Returns the overallscore. Calculates the totalscore by adding all scores and dividing these
 * by the number of results times the ScoreRating.
 *
 * @returns {number} The overallscore
 */
Assessor.prototype.calculateOverallScore = function () {
  var results = this.getValidResults();
  var totalScore = 0;

  (0, _lodashEs.forEach)(results, function (assessmentResult) {
    totalScore += assessmentResult.getScore();
  });

  return Math.round(totalScore / (results.length * ScoreRating) * 100) || 0;
};

/**
 * Register an assessment to add it to the internal assessments object.
 *
 * @param {string} name The name of the assessment.
 * @param {object} assessment The object containing function to run as an assessment and it's requirements.
 * @returns {boolean} Whether registering the assessment was successful.
 * @private
 */
Assessor.prototype.addAssessment = function (name, assessment) {
  if (!assessment.hasOwnProperty("identifier")) {
    assessment.identifier = name;
  }

  this._assessments.push(assessment);
  return true;
};

/**
 * Remove a specific Assessment to the list of Assessments.
 *
 * @param {string} name The Assessment to remove to the list of assessments.
 * @returns {void}
 */
Assessor.prototype.removeAssessment = function (name) {
  var toDelete = (0, _lodashEs.findIndex)(this._assessments, function (assessment) {
    return assessment.hasOwnProperty("identifier") && name === assessment.identifier;
  });

  if (-1 !== toDelete) {
    this._assessments.splice(toDelete, 1);
  }
};

/**
 * Returns an assessment by identifier
 *
 * @param {string} identifier The identifier of the assessment.
 * @returns {undefined|Object} The object if found, otherwise undefined.
 */
Assessor.prototype.getAssessment = function (identifier) {
  return (0, _lodashEs.find)(this._assessments, function (assessment) {
    return assessment.hasOwnProperty("identifier") && identifier === assessment.identifier;
  });
};

/**
 * Checks which of the available assessments are applicable and returns an array with applicable assessments.
 *
 * @returns {Array} The array with applicable assessments.
 */
Assessor.prototype.getApplicableAssessments = function () {
  var availableAssessments = this.getAvailableAssessments();
  return (0, _lodashEs.filter)(availableAssessments, function (availableAssessment) {
    return this.isApplicable(availableAssessment, this.getPaper());
  }.bind(this));
};

exports.default = Assessor;
//# sourceMappingURL=assessor.js.map
