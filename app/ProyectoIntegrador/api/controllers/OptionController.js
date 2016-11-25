/**
* OptionController
*
* @description :: Server-side logic for managing options
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

var Promise = require("bluebird");
module.exports = {

	register:function(option, question){
		var promiseOption=sails.models.option.create({justification:option.justification, text:option.text, isCorrect:option.isCorrect, idQuestion:question.id});
		return promiseOption;
	},
	formatMultipleChoiceOptionsAngularToServer:function(question){

	},
	formatFillOptionsAngularToServer:function(question){

	},
	formatTrueFalseOptionsAngularToServer:function(question){
		question.options=[];
		if(question.option=="true"){
			question.options.push({text:"verdadero", isCorrect:true, justification:question.justification});
			question.options.push({text:"falso", isCorrect:false, justification:""});
		}
		if(question.option=="false"){
			question.options.push({text:"falso", isCorrect:true, justification:question.justification});
			question.options.push({text:"verdadero", isCorrect:false, justification:""});
		}
		delete question.justificaion;
		delete question.option;
	}

};
