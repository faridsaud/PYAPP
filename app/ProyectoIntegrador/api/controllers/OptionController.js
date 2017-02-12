/**
* OptionController
* @module {Controller} Option
* @author Farid Saud Rolleri
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

	/**
	* @memberof module:Option
	* @function register
	* @param  {JSON} option one of the options of a question
	* @param  {string} option.justification justification
	* @param  {string} option.text text
	* @param  {boolean} option.isCorrect if it is the correct option
	* @param  {JSON} question question of the option
	* @param  {int} question.id id
	* @returns {promise} Promise of the create action
	* @description Register an option in a question
	*/
	register:function(option, question){
		var promiseOption=sails.models.option.create({justification:option.justification, text:option.text, isCorrect:option.isCorrect, idQuestion:question.id});
		return promiseOption;
	},


	/**
	* @memberof module:Option
	* @function update
	* @param  {JSON} option one of the options of a question
	* @param  {int} option.id id
	* @param  {string} option.justification justification
	* @param  {string} option.text text
	* @param  {boolean} option.isCorrect if it is the correct option
	* @param  {JSON} question question of the option
	* @param  {int} question.id id
	* @returns {promise} Promise of the update action
	* @description Update an option in a question
	*/
	update:function(option, question){
		var promiseOption=sails.models.option.update({id:option.id},{justification:option.justification, text:option.text, isCorrect:option.isCorrect, idQuestion:question.id});
		return promiseOption;
	},


	formatMultipleChoiceOptionsAngularToServer:function(question){

	},
	formatFillOptionsAngularToServer:function(question){

	},

	/**
	* @memberof module:Option
	* @function formatTrueFalseOptionsAngularToServer
	* @param  {JSON} question question with the option
	* @param  {JSON[]} question.options List of the options of the question
	* @description Format the options of a question from Angular format to Server format
	*/
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


	/**
	* @memberof module:Option
	* @function getOptionsByQuestion
	* @param  {JSON} question question
	* @param  {int} question.id Id
	* @description Get all the options of a question
	*/
	getOptionsByQuestion:function(question){
		question.options=[];
		var promise=sails.models.option.find({idQuestion:question.id})
		.then(function(options){
			for(var i=0;i<options.length;i++){
				question.options.push(options[i]);
			}
		})
		return promise;
	},

	/**
	* @memberof module:Option
	* @function separateOptionByAction
	* @param  {JSON[]} options Options to be separeted
	* @param  {JSON[]} optionsToBeCreated Array of options which will have the options to be created
	* @param  {JSON[]} optionsToBeUpdated Array of options which will have the options to be updated
	* @description Separate the options based on if they have to be created or updated
	*/
	separateOptionByAction:function(options, optionsToBeCreated, optionsToBeUpdated){
		var isFinished=false;
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

	/**
	* @memberof module:Option
	* @function setOldOptionsClone
	* @param  {JSON} oldQuestion Old question without options
	* @param  {int} oldQuestion.id Id
	* @returns {promise} Promise of the select action
	* @description Get the options of a question assigning them to the old question
	*/
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

	/**
	* @memberof module:Option
	* @function createNewOptionClone
	* @param  {JSON} newQuestion New question without options
	* @param  {int} newQuestion.id id
	* @param  {JSON} oldOption Option to be created with the new question
	* @param  {string} oldOption.justification justification
	* @param  {string} oldOption.text text
	* @param  {boolean} oldOption.isCorrect if it is the correct option
	* @returns {promise} Promise of the create action
	* @description Create an option of an old question in a new question
	*/
	createNewOptionClone:function(newQuestion, oldOption){
		var createOptionPromise=sails.models.option.create({idQuestion:newQuestion.id, justification:oldOption.justification, isCorrect:oldOption.isCorrect,text:oldOption.text})
		return createOptionPromise;
	},
};
