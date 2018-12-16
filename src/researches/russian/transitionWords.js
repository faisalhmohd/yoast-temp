"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat(multipleWords)
	};
};

/** @module config/transitionWords */

var singleWords = ["безусловно", "бесспорно", "вероятно", "вестимо", "вдобавок", "видимо", "вишь", "во-вторых", "во-первых", "вообще-то", "впрочем", "дабы", "едва", "ежели", "если", "затем ", "зачем", "ибо", "итак", "кабы", "кажется", "кажись", "коли", "кстати", "лишь", "лучше", "наверно", "наверное", "например", "небось", "нежели", "несомненно", "но", "однако", "особенно", "оттого", "отчего", "поди", "пожалуй", "позволь", "позвольте", "покамест", "покуда", "поскольку", "потому", "притом", "причем", "только", "хотя", "чтоб", "чтобы", "чуть", "якобы"];

var multipleWords = ["а вдобавок", "а вот", "а именно", "а не то", "а не", "а потом", "а также", "без всякого сомнения", "без того чтобы не", "без того, чтобы не", "благодаря тому", "более того", "будто бы", "будь то", "буквально", "в итоге", "в конце концов", "в общей сложности", "в общем-то", "в общем", "в отношении того что", "в отношении того, что", "в принципе", "в противовес тому что", "в противовес тому, что", "в противоположность тому", "в результате", "в самом деле", "в свою очередь", "в связи с тем что", "в связи с тем", "в силу того что", "в силу того", "в силу чего", "в случа", "в сравнении с тем", "в сущности говоря", "в сущности", "в таком случае", "в то время как", "в то время, как", "в том случае", "в частности", "в-третьих", "ввиду того", "вернее говоря", "вероятнее всего", "видите ли", "видишь ли", "вместе с тем", "вместо того", "вне всякого сомнения", "вне сомнения", "во всяком случае", "воля ваша", "воля твоя", "вообще говоря", "вопреки тому", "вплоть до того", "вроде того как", "вроде того что", "вроде того", "вроде того", "вследствие того что", "вследствие чего", "грубо говоря", "да еще", "да и то", "дай бог память", "даром что", "для того чтобы", "для того, чтобы", "до тех пор пока", "до тех пор, пока", "до того как", "до того, как", "едва лишь", "едва только", "ежели бы", "если угодно", "жалко, что", "жаль, что", "за счет того что", "за счет того, что", "знамо дело", "и вот еще", "из-за того что", "из-за того, что", "иначе говоря", "исходя из того", "к вашему сведению", "к несчастью", "к огорчению", "к примеру сказать", "к примеру", "к прискорбию", "к радости", "к слову сказать", "к сожалению", "к стыду своему", "к стыду", "к счастью", "к твоему сведению", "к тому же", "к удивлению", "к ужасу", "к чести", "как будто", "как бы там ни было", "как бы то ни было", "как бы", "как вам известно", "как вдруг", "как видите", "как видишь", "как видно", "как водится", "как выяснилось", "как выясняется", "как говорилось", "как говорится", "как если бы", "как знать", "как известно", "как на заказ", "как назло", "как нарочно", "как ни говори", "как ни говорите", "как ни странно", "как оказалось", "как оказывается", "как полагается", "как положено", "как правило", "как принято говорить", "как принято", "как сказано", "как скоро", "как следствие", "как словно", "как только", "как хотите", "как это ни странно", "ко всему прочему", "коль скоро", "коль уж", "коротко говоря", "короче говоря", "кроме всего прочего", "кстати говоря", "кстати сказать", "лишь бы", "лишь только", "мало сказать", "мало того", "между нами говоря", "между прочим", "между тем как", "может статься", "можно подумать", "мягко выражаясь", "мягко говоря", "на беду", "на ваш взгляд", "на мой взгляд", "на несчастье", "на основании того что", "на основании того, что", "на первый взгляд", "на самом деле", "на случай", "на твой взгляд", "на худой конец", "надо полагать", "наряду с тем что", "наряду с тем", "насчет того что", "насчет того, что", "не в пример тому как", "не в пример тому, как", "не то чтобы", "невзирая на то", "независимо от того", "несмотря на то", "ничего не скажешь", "но вообще-то", "но кроме того", "однако же", "откровенно сказать", "относительно того что", "относительно того, что", "перед тем", "по вашему мнению", "по видимости", "по всей вероятности", "по всей видимости", "по данным", "по замыслу", "по идее", "по крайней мере", "по мере того как", "по мере того, как", "по мнению", "по моему мнению", "по обыкновению", "по обычаю", "по определению", "по поводу того", "по правде говоря", "по правде сказать", "по правде", "по преданию", "по причине того", "по прогнозам", "по сведениям", "по своему обыкновению", "по слухам", "по совести говоря", "по совести сказать", "по совести", "по сообщению", "по сообщениям", "по справедливости говоря", "по справедливости", "по сравнению", "по статистике", "по сути говоря", "по сути дела", "по сути", "по существу говоря", "по существу", "по счастью", "по твоему мнению", "по чести говоря", "по чести признаться", "по чести сказать", "по-вашему", "по-видимому", "по-ихнему", "по-моему", "по-нашему", "по-твоему", "под видом того что", "под видом того, что", "под предлогом", "подобно тому", "подумать только", "помимо всего прочего", "помимо всего", "помимо того", "помимо того", "помимо этого", "понятное дело", "попросту говоря", "попросту сказать", "после того", "потому как", "потому что", "правду говоря", "правду сказать", "правильнее говоря", "прежде всего", "прежде нежели", "прежде чем", "при всем том", "при условии что", "при условии, что", "против обыкновения", "проще говоря", "проще сказать", "прямо-таки как", "пускай бы", "равно как", "ради того чтобы", "разве что", "разумеется", "с вашего позволения", "с вашего разрешения", "с другой стороны", "с моей точки зрения", "с одной стороны", "с позволения сказать", "с твоего позволения", "с твоего разрешения", "с тем чтобы", "с тех пор как", "с той целью чтобы", "с точки зрения", "само собой разумеется", "сверх того что", "сверх того", "сказать по правде", "сказать по совести", "сказать по чести", "скорее всего", "смотря по тому", "со своей стороны", "собственно говоря", "совсем как", "стало быть", "стоит отметить", "строго говоря", "судя по всему", "судя по тому", "так или иначе", "так как", "так что", "так чтобы", "тем более что", "тем не менее", "тем паче что", "то бишь", "то есть", "тогда как", "только бы", "только лишь", "только чуть", "точнее говоря", "точнее сказать", "точно так же", "что и говорить", "что ни говори", "что ни говорите", "чуть лишь", "чуть только", "шутка ли сказать", "шутка ли", "шутка сказать", "это значит, что"];

/**
 * Returns lists with transition words to be used by the assessments.
 * @returns {Object} The object with transition word lists.
 */
//# sourceMappingURL=transitionWords.js.map
