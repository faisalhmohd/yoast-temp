"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (paper, researcher) {
  var topicForms = researcher.getResearch("morphology");
  var slug = paper.getUrl().replace(/[-_]/ig, " ");

  var keyphraseInSlug = (0, _findKeywordFormsInString.findTopicFormsInString)(topicForms, slug, false, paper.getLocale());

  return {
    keyphraseLength: topicForms.keyphraseForms.length,
    percentWordMatches: keyphraseInSlug.percentWordMatches
  };
};

var _findKeywordFormsInString = require("./findKeywordFormsInString.js");
//# sourceMappingURL=keywordCountInUrl.js.map
