/**
* QuestionController
* @module {Controller} Question
* @author Farid Saud Rolleri
* @description :: Server-side logic for managing options
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

var Promise = require("bluebird");
module.exports = {

	/**
	* @memberof module:Question
	* @function register
	* @param  {JSON} question Question to be registered
	* @param {string} question.type Type that could be multipleCh, trueFalse, fill
	* @param {int} question.weighing Weghing
	* @param {string} question.text Text
	* @param {JSON} test Test on which the question will be registered
	* @param {int} test.id Id
	* @returns {promise} Promise of the create action
	* @description Register a question in a test
	*/
	register:function(question, test){
		var promiseQuestion=sails.models.question.create({type:question.type, weighing:question.weighing, text:question.text, idTest:test.id});
		return promiseQuestion;
	},


	/**
	* @memberof module:Question
	* @function update
	* @param  {JSON} question Question to be registered
	* @param {string} question.id Id
	* @param {string} question.type Type that could be multipleCh, trueFalse, fill
	* @param {int} question.weighing Weghing
	* @param {string} question.text Text
	* @param {JSON} test Test on which the question will be registered
	* @param {int} test.id Id
	* @returns {promise} Promise of the update action
	* @description Update a question of a test
	*/
	update:function(question, test){
		var promiseQuestion=sails.models.question.update({id:question.id},{type:question.type, weighing:question.weighing, text:question.text, idTest:test.id});
		return promiseQuestion;
	},

	/**
	* @memberof module:Question
	* @function formatMultipleChoiceQuestionsAngularToServer
	* @param  {JSON[]} questions Question to be registered
	* @description Format the multiple choice questions of the test, from angular format to server format
	*/
	formatMultipleChoiceQuestionsAngularToServer:function(questions){
		for (var i=0;i<questions.length;i++){
			questions[i].type="multipleCh";
			sails.controllers.option.formatMultipleChoiceOptionsAngularToServer(questions[i]);
		}
	},


	/**
	* @memberof module:Question
	* @function formatFillQuestionsAngularToServer
	* @param  {JSON[]} questions Question to be registered
	* @description Format the fill questions of the test, from angular format to server format
	*/
	formatFillQuestionsAngularToServer:function(questions){
		for (var i=0;i<questions.length;i++){
			questions[i].type="fill";
			for(var j=0;j<questions[i].statements.length;j++){
				if(j==0){
					questions[i].text=questions[i].statements[j].text;
				}else{
					questions[i].text=questions[i].text+". espacio en blanco. "+questions[i].statements[j].text;
				}
			}
			sails.controllers.option.formatFillOptionsAngularToServer(questions[i]);
			delete questions[i].statements;
		}
	},

	/**
	* @memberof module:Question
	* @function formatTrueFalseQuestionsAngularToServer
	* @param  {JSON[]} questions Question to be registered
	* @description Format the true/false questions of the test, from angular format to server format
	*/

	formatTrueFalseQuestionsAngularToServer:function(questions){
		for (var i=0;i<questions.length;i++){
			questions[i].type="trueFalse";
			sails.controllers.option.formatTrueFalseOptionsAngularToServer(questions[i]);
		}

	},

	/**
	* @memberof module:Question
	* @function getQuestionsByTest
	* @param  {int} idTest Id of the test
	* @returns {promise} promise of the select action
	* @description Get all the questions of the test
	*/
	getQuestionsByTest:function(idTest){
		var promise=sails.models.question.find({idTest:idTest});
		return promise;
	},

	/**
	* @memberof module:Question
	* @function separateQuestionsByType
	* @param  {JSON} test Test
	* @param  {JSON[]} test.questions Questions
	* @description Separete all the questions, in questions by type
	*/
	separateQuestionsByType:function(test){
		var questions=test.questions;
		delete test.questions;
		for(var i=0; i<questions.length;i++){
			if(questions[i].type=="multipleCh"){
				test.multipleChoiceQuestions.push(questions[i]);
			}
			if(questions[i].type=="fill"){
				test.fillQuestions.push(questions[i]);
			}
			if(questions[i].type=="trueFalse"){
				test.trueFalseQuestions.push(questions[i]);
			}
		}
	},

	/**
	* @memberof module:Question
	* @function separateQuestionByAction
	* @param  {JSON[]} questions All questions
	* @param  {JSON[]} questionsToBeCreated Emtpy array of questions to be created
	* @param {JSON[]} questionsToBeUpdated Emtpy array of questions to be update
	* @description Separete all the questions in questions to be created and questions to be updated
	*/
	separateQuestionByAction:function(questions, questionsToBeCreated, questionsToBeUpdated){
		var isFinished=false;
		while(isFinished==false){
			if(questions.length==0){
				break;
			}
			for(var i=0;i<questions.length;i++){
				if(questions[i].id){
					var questionToBeUpdated=questions.splice(i,1);
					questionsToBeUpdated.push(questionToBeUpdated[0]);

					break;
				}else{
					var questionToBeCreated=questions.splice(i,1);
					questionsToBeCreated.push(questionToBeCreated[0]);
					break;
				}
			}
		}

	},

	/**
	* @memberof module:Question
	* @function separateAllOptionsOfQuestionsByAction
	* @param  {JSON[]} questions All questions
	* @description Creates the empty arrays for each questions of options to be created and options to be update, and call separateOptionByAction @see {@link separateOptionByAction}
	*/
	separateAllOptionsOfQuestionsByAction:function(questions){
		for(var i=0;i<questions.length;i++){
			questions[i].optionsToBeCreated=[];
			questions[i].optionsToBeUpdated=[];
			sails.controllers.option.separateOptionByAction(questions[i].options, questions[i].optionsToBeCreated, questions[i].optionsToBeUpdated);
		}

	},

	/**
	* @memberof module:Question
	* @function delete
	* @param  {JSON} req HTTP request object
	* @param  {int} req.body.id Id of the question to be deleted
	* @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
	* @description Delete a question
	*/
	delete:function(req,res){
		if(req.body.id){
			var id=req.body.id;
		}else{
			return res.json(400, {code:1, msg:"No id send", msgES:"Id no envíado"});
		}
		sails.models.question.destroy({id:id})
		.then(function(){
			return res.json(200, {msg:"Question deleted successfully", msgES:"Pregunta eliminada"});
		})
		.catch(function(error){
			return res.json(500, {msg:"No id send", msgES:"Id no envíado"});
		})
	},


	createCloneQuestion:function(oldQuestion, mappedTests){
		var createQuestionPromise=sails.models.question.create({idTest:mappedTests[i].newTest.id, type:oldQuestions[j].type,text:oldQuestions[j].text, weighing:oldQuestions[j].weighing})

	},

	/**
	* @memberof module:Question
	* @function setOldQuestionsClone
	* @param  {JSON} oldTest Test from which the question will be cloned
	* @param  {int} oldTest.id Id
	* @returns  {promise} Promise of select action
	* @description Set all the questions that will be cloned
	*/
	setOldQuestionsClone:function(oldTest){
		oldTest.questions=[];
		var questionQueryPromisified=Promise.promisify(sails.models.question.query);
		var selectQuestionsPromise=questionQueryPromisified("SELECT Q.IDQUESTION AS id, Q.IDTEST AS idTest, Q.TYPEQUESTION AS type, Q.TEXTQUESTION AS text, Q.WEIGHT AS weighing FROM QUESTION Q WHERE Q.IDTEST=?",[oldTest.id])
		.then(function(oldQuestions){
			for(var i=0;i<oldQuestions.length;i++){
				oldTest.questions.push(oldQuestions[i]);
			}
		})
		return selectQuestionsPromise;
	},


	/**
	* @memberof module:Question
	* @function createNewQuestionClone
	* @param  {JSON} newTest Test that will be cloned
	* @param  {int} newTest.id id
	* @param  {JSON} oldQuestion Question used to create a new one
	* @param  {string} oldQuestion.type Type
	* @param  {string} oldQuestion.text Text
	* @param  {int} oldQuestion.weighing Weighing
	* @returns  {promise} Promise of the create action
	* @description Creation a new question in the test that will be cloned
	*/
	createNewQuestionClone:function(newTest, oldQuestion){
		var createQuestionPromise=sails.models.question.create({idTest:newTest.id, type:oldQuestion.type,text:oldQuestion.text, weighing:oldQuestion.weighing})
		.then(function(questionCreated){
			newTest.questions.push(questionCreated);
		})
		return createQuestionPromise;
	},


	/**
	* @memberof module:Course
	* @function cloneQuestion
	* @param  {JSON} req HTTP request object
	* @param  {JSON} req.body.user User clonning the question
	* @param  {string} req.body.user.email Email
	* @param  {JSON} req.body.test Test in which the question will be cloned
	* @param  {id} req.body.test.id Id
	* @param  {JSON} req.body.question Question to be clonned
  * @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
	* @description Clone a question
	*/
	cloneQuestion:function(req,res){
		if(req.body.user){
			var user=req.body.user;
			if(!user.email){
				return res.json(400,{code:2,msg: 'There is no user email send', msgES:"Email no envíado"});
			}
		}else{
			return res.json(400,{code:1,msg: 'There is no user data send', msgES:"Usuario no envíado"});
		}

		if(req.body.test){
			var test=req.body.test;
			if(!test.id){
				return res.json(400,{code:4,msg: 'There is no test id send', msgES:"Id de la prueba no envíado"});
			}
		}else{
			return res.json(400,{code:3,msg: 'There is no test data send', msgES:"Datos de la prueba no envíados"});
		}

		if(req.body.question){
			var question=req.body.question;
		}else{
			return res.json(400,{code:5,msg: 'There is no question data send', msgES:"Pregunta no envíada"});
		}
		/*Checking if the user is the owner of the test*/
		sails.models.usrtes.findOne({email:user.email, idTest:test.id, status:'t'}).exec(function(error, finded){
			if(error){
				return res.json(500,{msg: 'Error cloning the question', msgES:"Error clonando la pregunta"});
			}else{
				if(finded){
					if(question.type=="trueFalse"){
						var trueFalseQuestions=[];
						trueFalseQuestions.push(question);
						sails.controllers.question.formatTrueFalseQuestionsAngularToServer(trueFalseQuestions);
						var questionPromise=sails.controllers.question.register(trueFalseQuestions[0],test)
						var questions=trueFalseQuestions;
					}
					if(question.type=="fill"){
						var fillQuestions=[];
						fillQuestions.push(question);
						sails.controllers.question.formatFillQuestionsAngularToServer(fillQuestions);
						var questionPromise=sails.controllers.question.register(fillQuestions[0],test)
						var questions=fillQuestions;
					}
					if(question.type=="multipleCh"){
						var multipleChoiceQuestions=[];
						multipleChoiceQuestions.push(question);
						sails.controllers.question.formatMultipleChoiceQuestionsAngularToServer(multipleChoiceQuestions);
						var questionPromise=sails.controllers.question.register(multipleChoiceQuestions[0],test);
						var questions=multipleChoiceQuestions;
					}
					Promise.join(questionPromise, function(questionCreated){
						var optionsPromises=[];
						for(var j=0;j<questions[0].options.length;j++){
							var optionPromise=sails.controllers.option.register(questions[0].options[j],questionCreated);
							optionsPromises.push(optionPromise);
						}
						Promise.all(optionsPromises)
						.then(function(){
							return res.json(200,{msg: 'Question cloned successfully', msgES:"Pregunta clonada"});
						})
						.catch(function(error){
							return res.json(500,{msg: 'Error cloning the question', msgES:"Error clonando la pregunta"});
						})
					})
					.catch(function(error){
						return res.json(500,{msg: 'Error cloning the question', msgES:"Error clonando la pregunta"});
					})

				}else{
					return res.json(403,{msg: 'The user is not the owner of the test', msgES:"El usuario no es el propietario de la prueba"});
				}
			}
		});


	},

};
