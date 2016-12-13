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

	update:function(question, test){
		var promiseQuestion=sails.models.question.update({id:question.id},{type:question.type, weighing:question.weighing, text:question.text, idTest:test.id});
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
					questions[i].text=questions[i].text+". espacio en blanco."+questions[i].statements[j].text;
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

	/*Separate question in question to be created and question to be updated*/
	separateQuestionByAction:function(questions, questionsToBeCreated, questionsToBeUpdated){
		var isFinished=false;
		console.log(questions);
		console.log(questionsToBeCreated);
		console.log(questionsToBeUpdated);

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
	separateAllOptionsOfQuestionsByAction:function(questions){
		for(var i=0;i<questions.length;i++){
			questions[i].optionsToBeCreated=[];
			questions[i].optionsToBeUpdated=[];
			sails.controllers.option.separateOptionByAction(questions[i].options, questions[i].optionsToBeCreated, questions[i].optionsToBeUpdated);
		}

	},

	delete:function(req,res){
		if(req.body.id){
			var id=req.body.id;
		}else{
			return res.json(400, {msg:"Error deleting the question, no id send"});
		}
		sails.models.question.destroy({id:id})
		.then(function(){
			return res.json(200, {msg:"Question deleted successfully"});
		})
		.catch(function(error){
			return res.json(500, {msg:"Error deleting the question, no id send"});
		})
	},

	createCloneQuestion:function(oldQuestion, idTest, mappedTests){
		var createQuestionPromise=sails.models.question.create({idTest:mappedTests[i].newTest.id, type:oldQuestions[j].type,text:oldQuestions[j].text, weighing:oldQuestions[j].weighing})

	},

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

	createNewQuestionClone:function(newTest, oldQuestion){
			console.log("Se va a crear la pregunta");
			console.log(oldQuestion);
			var createQuestionPromise=sails.models.question.create({idTest:newTest.id, type:oldQuestion.type,text:oldQuestion.text, weighing:oldQuestion.weighing})
			.then(function(questionCreated){
				console.log("Question created");
				newTest.questions.push(questionCreated);
			})
			return createQuestionPromise;
	},
};
