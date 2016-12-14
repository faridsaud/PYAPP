/**
* OptionController
*
* @description :: Server-side logic for managing options
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

var Promise = require("bluebird");

Promise.config({
	// Enable warnings
	warnings: false,
	// Enable long stack traces
	longStackTraces: true,
	// Enable cancellation
	cancellation: true,
	// Enable monitoring
	monitoring: true
});
module.exports = {

	register:function(option, question){
		var promiseOption=sails.models.option.create({justification:option.justification, text:option.text, isCorrect:option.isCorrect, idQuestion:question.id});
		return promiseOption;
	},

	update:function(option, question){
		var promiseOption=sails.models.option.update({id:option.id},{justification:option.justification, text:option.text, isCorrect:option.isCorrect, idQuestion:question.id});
		return promiseOption;
	},
	formatMultipleChoiceOptionsAngularToServer:function(question){

	},
	formatFillOptionsAngularToServer:function(question){

	},
	formatTrueFalseOptionsAngularToServer:function(question){
		if(question.options){
			var idTrueOption=0;
			var idFalseOption=0;
			for(var i=0;i<question.options.length;i++){
				if(question.options[i].text=="verdadero"){
					idTrueOption=question.options[i].id;
				}
				if(question.options[i].text=="falso"){
					idFalseOption=question.options[i].id;
				}
			}
			/*when the true false question is updated*/
			question.options=[];
			if(question.option=="true"){
				question.options.push({text:"verdadero", isCorrect:true, justification:question.justification,id:idTrueOption});
				question.options.push({text:"falso", isCorrect:false, justification:"", id:idFalseOption});
			}
			if(question.option=="false"){
				question.options.push({text:"falso", isCorrect:true, justification:question.justification, id:idFalseOption});
				question.options.push({text:"verdadero", isCorrect:false, justification:"", id:idTrueOption});
			}
			delete question.justificaion;
			delete question.option;
		}else{
			/*when the true false is created*/
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
	},

	getOptionsByQuestion:function(question){
		question.options=[];
		var promise=sails.models.option.find({idQuestion:question.id})
		.then(function(options){
			for(var i=0;i<options.length;i++){
				console.log("obteniendo opcion:" + options[i].id);
				question.options.push(options[i]);
			}
		})
		return promise;
	},
	separateOptionByAction:function(options, optionsToBeCreated, optionsToBeUpdated){
		var isFinished=false;
		console.log(options);
		console.log(optionsToBeCreated);
		console.log(optionsToBeUpdated);

		while(isFinished==false){
			if(options.length==0){
				break;
			}
			for(var i=0;i<options.length;i++){
				if(options[i].id){
					var questionToBeUpdated=options.splice(i,1);
					optionsToBeUpdated.push(questionToBeUpdated[0]);

					break;
				}else{
					var questionToBeCreated=options.splice(i,1);
					optionsToBeCreated.push(questionToBeCreated[0]);
					break;
				}
			}
		}

	},

	setOldOptionsClone:function(oldQuestion){
		oldQuestion.options=[];
		var optionQueryPromisified=Promise.promisify(sails.models.option.query);
		var selectOptionsPromise= optionQueryPromisified("SELECT IDOPTION AS id, IDQUESTION AS idQuestion, JUSTIFICATION AS justification, ISCORRECT AS isCorrect, TEXTOPTION AS text FROM OPTIO WHERE IDQUESTION=?",[oldQuestion.id])
		.then(function(oldOptions){
			for(var i=0;i<oldOptions.length;i++){
				oldQuestion.options.push(oldOptions[i]);
			}
		})
		return selectOptionsPromise;
	},

	createNewOptionClone:function(newQuestion, oldOption){
		var createOptionPromise=sails.models.option.create({idQuestion:newQuestion.id, justification:oldOption.justification, isCorrect:oldOption.isCorrect,text:oldOption.text})
		return createOptionPromise;
	},
};
