/**
 * QuestionController
 *
 * @description :: Server-side logic for managing questions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require("bluebird");
module.exports = {

	register:function(question, test){
		var promiseQuestion=sails.models.question.create({type:question.type, weighing:question.weighing, text:question.text, idTest:test.id});
		return promiseQuestion;
	},
	formatMultipleChoiceQuestionsAngularToServer:function(questions){
		for (var i=0;i<questions.length;i++){
			questions[i].type="multipleChoice";
			sails.controllers.option.formatMultipleChoiceOptionsAngularToServer(questions[i]);
		}
	},

	formatFillQuestionsAngularToServer:function(questions){
		for (var i=0;i<questions.length;i++){
			questions[i].type="fill";
			for(var j=0;j<questions[i].statements.length;j++){
				if(j==0){
					questions[i].text=questions[i].statements[j].text;
				}else{
					questions[i].text="espacio en blanco"+questions[i].statements[j].text;
				}
			}
			sails.controllers.option.formatFillOptionsAngularToServer(questions[i]);
			delete questions[i].statements;
		}
	},

	formatTrueFalseQuestionsAngularToServer:function(questions){
		for (var i=0;i<questions.length;i++){
			questions[i].type="trueFalse";
			sails.controllers.option.formatTrueFalseOptionsAngularToServer(questions[i]);
		}

	},

	getQuestionsByTest:function(idTest){
		var promise=sails.models.question.find({idTest:idTest});
		return promise;
	},

};
