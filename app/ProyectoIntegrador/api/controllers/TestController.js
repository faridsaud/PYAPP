/**
* TestController
*
* @description :: Server-side logic for managing tests
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

var Promise = require("bluebird");
module.exports = {



	/**
	* `TestController.insertar()`
	*/
	register: function (req, res) {
		if(req.body.test.title){
			var title=req.body.test.title;
		}else{
			return res.json(400,{msg: 'Error creating the test, there is no title'});
		}
		if(req.body.test.description){
			var description=req.body.test.description;
		}else{
			var description=null;
		}
		if(req.body.test.intents){
			var intents=req.body.test.intents;
		}else{
			var intents=1;
		}
		if(req.body.test.createdBy){
			var createdBy=req.body.test.createdBy;
		}else{
			return res.json(400,{msg: 'Error creating the test, there is no owner'});
		}
		if(req.body.test.status){
			var status=req.body.test.status;
		}else{
			var status=null;
		}
		if(req.body.test.startDateTime){
			var startDateTime=req.body.test.startDateTime;
		}else{
			return res.json(400,{msg: 'Error creating the test, there should be an start date-time'});
		}
		if(req.body.test.finishDateTime){
			var finishDateTime=req.body.test.finishDateTime;
		}else{
			return res.json(400,{msg: 'Error creating the test, there should be an finish date-time'});
		}
		if(req.body.test.course){
			var idCourse=req.body.test.course;
		}else{
			return res.json(400,{msg: 'Error creating the test, there should be a course'});
		}
		sails.models.test.create({
			title:title,
			description:description,
			createdBy:createdBy,
			status:"c",
			startDateTime:startDateTime,
			finishDateTime:finishDateTime,
			averageScore:0.0,
			idCourse:idCourse,
			intents:intents
		}).exec(function (error, newTest){
			if(error){
				console.log(error);
				return res.json(512, {msg:"Error creating the test"});
			}else{
				sails.models.usrtes.query('INSERT INTO USR_TES (EMAIL, IDTEST, STATUSUSRTES) VALUES (?,?,?)',[createdBy, newTest.id, 't' ], function(err, results) {
					if (err){
						console.log(err);
						return res.json(512, {msg:"Error creating the test"});
					}else{
						sails.models.usrtes.query("INSERT INTO USR_TES (EMAIL, IDTEST, STATUSUSRTES, INTENTLEFT) SELECT U.EMAIL, ?, 's',? FROM USER U, USR_COU UC WHERE U.EMAIL=UC.EMAIL AND UC.IDCOURSE=? AND U.EMAIL!=?",[newTest.id,intents, idCourse, createdBy], function(error, callback){
							if(error){
								console.log(error);
								return res.json(512,{msg: 'Error creating the test'});
							}else{

								//return res.json(201,{msg: 'Test created'});
								var errorCheckingTest=sails.controllers.test.checkTestData(req);
								if(errorCheckingTest.error==true){
									console.log(errorCheckingTest.msg);
									return res.json(400, {msg:"Error creating the test, wrong test format send"});
								}
								/*Get questions*/
								var multipleChoiceQuestions=req.body.multipleChoiceQuestions;
								var fillQuestions=req.body.fillQuestions;
								var trueFalseQuestions=req.body.trueFalseQuestions;
								/*Format questions*/
								sails.controllers.question.formatMultipleChoiceQuestionsAngularToServer(multipleChoiceQuestions);
								sails.controllers.question.formatFillQuestionsAngularToServer(fillQuestions);
								sails.controllers.question.formatTrueFalseQuestionsAngularToServer(trueFalseQuestions);
								var questionsPromises=[];
								var optionsPromises=[];
								console.log(multipleChoiceQuestions[0]);

								/*register multiple choice questions and options*/
								for (var i=0;i<multipleChoiceQuestions.length;i++){
									var questionPromise=sails.controllers.question.register(multipleChoiceQuestions[i],newTest)
									.then(function(questionCreated){
										for(var k=0;k<multipleChoiceQuestions.length;k++){
											if(multipleChoiceQuestions[k].text==questionCreated.text){
												console.log("Se hizo match");
												multipleChoiceQuestions[k].id=questionCreated.id;
											}
										}
									})
									.catch(function(error){
										console.log(error);
										return res.json(512,{msg: 'Error creating the test'});
									})
									questionsPromises.push(questionPromise);
								}

								/*register fill questions*/
								for (var i=0;i<fillQuestions.length;i++){
									var questionPromise=sails.controllers.question.register(fillQuestions[i],newTest)
									.then(function(questionCreated){
										for(var k=0;k<fillQuestions.length;k++){
											if(fillQuestions[k].text==questionCreated.text){
												fillQuestions[k].id=questionCreated.id;
											}
										}
									})
									.catch(function(error){
										console.log(error);
										return res.json(512,{msg: 'Error creating the test'});
									})
									questionsPromises.push(questionPromise);
								}

								/*register true false questions*/
								for (var i=0;i<trueFalseQuestions.length;i++){
									var questionPromise=sails.controllers.question.register(trueFalseQuestions[i],newTest)
									.then(function(questionCreated){
										for(var k=0;k<trueFalseQuestions.length;k++){
											if(trueFalseQuestions[k].text==questionCreated.text){
												trueFalseQuestions[k].id=questionCreated.id;
											}
										}
									})
									.catch(function(error){
										console.log(error);
										return res.json(512,{msg: 'Error creating the test'});
									})
									questionsPromises.push(questionPromise);
								}

								/*Check promises*/
								Promise.all(questionsPromises)
								.then(function(){
									for(var i=0;i<multipleChoiceQuestions.length;i++){
										for(var j=0;j<multipleChoiceQuestions[i].options.length;j++){
											var optionPromise=sails.controllers.option.register(multipleChoiceQuestions[i].options[j],multipleChoiceQuestions[i]);
											//console.log("imprimiendo");
											//console.log(multipleChoiceQuestions[i]);
											optionsPromises.push(optionPromise);
										}
									}
									for(var i=0;i<trueFalseQuestions.length;i++){
										for(var j=0;j<trueFalseQuestions[i].options.length;j++){
											var optionPromise=sails.controllers.option.register(trueFalseQuestions[i].options[j],trueFalseQuestions[i]);
											optionsPromises.push(optionPromise);
										}
									}
									for(var i=0;i<fillQuestions.length;i++){
										for(var j=0;j<fillQuestions[i].options.length;j++){
											var optionPromise=sails.controllers.option.register(fillQuestions[i].options[j],fillQuestions[i]);
											optionsPromises.push(optionPromise);
										}
									}
									Promise.all(optionsPromises)
									.then(function(){
										return res.json(200,{msg: 'Test sucessfully created'});
									})
									.catch(function(error){
										console.log(error);
										return res.json(512,{msg: 'Error creating the test'});
									})
								})
								.catch(function(error){
									console.log(error);
									return res.json(512,{msg: 'Error creating the test'});
								});
							}
						});
					}
				});
			}
		})
	},

	checkTestData:function(req){
		/*Check True False questions*/
		for(var i=0;i<req.body.trueFalseQuestions.length;i++){
			console.log("imprimiendo preguntas trufalse")
			console.log(req.body.trueFalseQuestions);
			console.log(req.body.trueFalseQuestions[i]);
			if(req.body.trueFalseQuestions[i].text){
				if(req.body.trueFalseQuestions[i].text.length>=1){
					console.log(req.body.trueFalseQuestions[i].text);
					var patt = /^\w{1,}.{0,}$/;
					var res = patt.test(req.body.trueFalseQuestions[i].text);
					console.log(res);
					if(res==false){
						return {
							error:true,
							msg:"Wrong statement in question "+i+", cannot be empty",
							question:i,
							type:"trueFalseQuestions"
						}
					}
				}else{
					return {
						error:true,
						msg:"Wrong statement in question "+i+", cannot be empty",
						question:i,
						type:"trueFalseQuestions"
					}
				}
			}else{
				return {
					error:true,
					msg:"Wrong statement in question "+i+", cannot be empty",
					question:i,
					type:"trueFalseQuestions"
				}
			}
			if(req.body.trueFalseQuestions[i].weighing){
				var patt = /^\d{1,1}$/;
				var res = patt.test(req.body.trueFalseQuestions[i].weighing);
				if(res==false){
					req.body.trueFalseQuestions[i].weighing=1;
				}
			}else{
				req.body.trueFalseQuestions[i].weighing=1;
			}
			if(req.body.trueFalseQuestions[i].justification){
				if(req.body.trueFalseQuestions[i].justification.length>=1){
					console.log(req.body.trueFalseQuestions[i].justification);
					var patt = /^\w{1,}.{0,}$/;
					var res = patt.test(req.body.trueFalseQuestions[i].justification);
					console.log(res);
					if(res==false){
						req.body.trueFalseQuestions[i].justification="";
					}
				}else{
					req.body.trueFalseQuestions[i].justification=""
				}
			}else{
				req.body.trueFalseQuestions[i].justification="";
			}
		}
		/*Check Multiple Choice Questions*/

		for(var i=0;i<req.body.multipleChoiceQuestions.length;i++){
			/*check weighing*/
			if(req.body.multipleChoiceQuestions[i].weighing){
				var patt = /^\d{1,1}$/;
				var res = patt.test(req.body.multipleChoiceQuestions[i].weighing);
				if(res==false){
					req.body.multipleChoiceQuestions[i].weighing=1;
				}
			}else{
				req.body.multipleChoiceQuestions[i].weighing=1;
			}
			/*Check statement*/
			if(req.body.multipleChoiceQuestions[i].text){
				if(req.body.multipleChoiceQuestions[i].text.length>=1){
					console.log(req.body.multipleChoiceQuestions[i].text);
					var patt = /^\w{1,}.{0,}$/;
					var res = patt.test(req.body.multipleChoiceQuestions[i].text);
					console.log(res);
					if(res==false){
						return {
							error:true,
							msg:"Wrong statement in question "+i+", cannot be empty",
							question:i,
							type:"multipleChoiceQuestions"
						}
					}
				}else{
					return {
						error:true,
						msg:"Wrong statement in question "+i+", cannot be empty",
						question:i,
						type:"multipleChoiceQuestions"
					}
				}
			}else{
				return {
					error:true,
					msg:"Wrong statement in question "+i+", cannot be empty",
					question:i,
					type:"multipleChoiceQuestions"
				}
			}
			console.log("antes de correctAnswers");
			var correctAnswers=0;
			console.log(req.body.multipleChoiceQuestions[i].options);
			/*check Options*/
			for(var j=0;j<req.body.multipleChoiceQuestions[i].options.length;j++){
				/*check Options*/
				console.log("chequeando opciones");
				if(req.body.multipleChoiceQuestions[i].options[j].text){
					if(req.body.multipleChoiceQuestions[i].options[j].text.length>=1){
						var patt = /^\w{1,}.{0,}$/;
						var res = patt.test(req.body.multipleChoiceQuestions[i].options[j].text);
						if(res==false){
							return {
								error:true,
								msg:"Wrong statement in question "+i+" option "+j+", cannot be empty",
								question:i,
								type:"multipleChoiceQuestions"
							}
						}
					}else{
						return {
							error:true,
							msg:"Wrong statement in question "+i+" option "+j+", cannot be empty",
							question:i,
							type:"multipleChoiceQuestions"
						}
					}
				}else{
					return {
						error:true,
						msg:"Wrong statement in question "+i+" option "+j+", cannot be empty",
						question:i,
						type:"multipleChoiceQuestions"
					}
				}
				/*check justification*/
				if(req.body.multipleChoiceQuestions[i].options[j].justification){
					if(req.body.multipleChoiceQuestions[i].options[j].justification.length>=1){
						var patt = /^\w{1,}.{0,}$/;
						var res = patt.test(req.body.multipleChoiceQuestions[i].options[j].justification);
						if(res==false){
							req.body.multipleChoiceQuestions[i].options[j].justification="";
						}
					}else{
						req.body.multipleChoiceQuestions[i].options[j].justification="";
					}
				}else{
					req.body.multipleChoiceQuestions[i].options[j].justification="";

				}
				/*check correctAnswers*/
				console.log(req.body.multipleChoiceQuestions[i].options[j].isCorrect);
				if(req.body.multipleChoiceQuestions[i].options[j].isCorrect){
					console.log("tratando");
					correctAnswers++;
				}else{
					req.body.multipleChoiceQuestions[i].options[j].isCorrect=false;
				}
			}
			console.log("estamos aqui");
			console.log(correctAnswers);
			if(correctAnswers==0){
				return {
					error:true,
					msg:"There should be at least 1 correct answer in question "+i,
					question:i,
					type:"multipleChoiceQuestions"
				}
			}
		}
		/*Check Fill Questions*/
		for(var i=0;i<req.body.fillQuestions.length;i++){
			if(req.body.fillQuestions[i].weighing){
				var patt = /^\d{1,1}$/
				var res = patt.test(req.body.fillQuestions[i].weighing);
				if(res==false){
					req.body.fillQuestions[i].weighing=1;
				}
			}else{
				req.body.fillQuestions[i].weighing=1;
			}
			for(var j=0;j<req.body.fillQuestions[i].statements.length;j++){
				console.log(req.body.fillQuestions[i].statements[j].text);
				if(req.body.fillQuestions[i].statements[j].text){
					if(req.body.fillQuestions[i].statements[j].text.length>=1){
						var patt = /^\w{1,}.{0,}$/;
						var res = patt.test(req.body.fillQuestions[i].statements[j].text);
						console.log(req.body.fillQuestions[i].statements[j].text);
						if(res==false){
							return {
								error:true,
								msg:"Wrong statement in question "+i+" statement "+j+", cannot be empty",
								question:i,
								type:"fillQuestions"
							}
						}
					}else{
						return {
							error:true,
							msg:"Wrong statement in question "+i+" statement "+j+", cannot be empty",
							question:i,
							type:"fillQuestions"
						}

					}
				}else{

					return {
						error:true,
						msg:"Wrong statement in question "+i+" statement "+j+", cannot be empty",
						question:i,
						type:"fillQuestions"
					}
				}
			}
			var correctAnswers=0;
			for(var j=0;j<req.body.fillQuestions[i].options.length;j++){
				/*check Options*/
				console.log("chequeando opciones");
				if(req.body.fillQuestions[i].options[j].text){
					if(req.body.fillQuestions[i].options[j].text.length>=1){
						var patt = /^\w{1,}.{0,}$/;
						var res = patt.test(req.body.fillQuestions[i].options[j].text);
						if(res==false){
							return {
								error:true,
								msg:"Wrong statement in question "+i+" option "+j+", cannot be empty",
								question:i,
								type:"fillQuestions"
							}
						}
					}else{
						return {
							error:true,
							msg:"Wrong statement in question "+i+" option "+j+", cannot be empty",
							question:i,
							type:"fillQuestions"
						}
					}
				}else{
					return {
						error:true,
						msg:"Wrong statement in question "+i+" option "+j+", cannot be empty",
						question:i,
						type:"fillQuestions"
					}
				}
				/*check justification*/
				if(req.body.fillQuestions[i].options[j].justification){
					if(req.body.fillQuestions[i].options[j].justification.length>=1){
						var patt = /^\w{1,}.{0,}$/;
						var res = patt.test(req.body.fillQuestions[i].options[j].justification);
						if(res==false){
							req.body.fillQuestions[i].options[j].justification="";
						}
					}else{
						req.body.fillQuestions[i].options[j].justification="";
					}
				}else{
					req.body.fillQuestions[i].options[j].justification="";

				}
				/*check correctAnswers*/
				console.log(req.body.fillQuestions[i].options[j].isCorrect);
				if(req.body.fillQuestions[i].options[j].isCorrect){
					console.log("tratando");
					correctAnswers++;
				}else{
					req.body.fillQuestions[i].options[j].isCorrect=false;
				}
			}
			if(correctAnswers==0){
				if(correctAnswers==0){
					return {
						error:true,
						msg:"There should be at least 1 correct answer in question "+i,
						question:i,
						type:"fillQuestions"
					}
				}
			}
		}
		return {
			error:false,
			msg: "No error found"
		}

	},

	checkStatus:function(tests){
		var actualDate = new Date();
		tests=sails.controllers.test.parseISOtoDateformat(tests);
		for(var i=0;i<tests.length;i++){
			if(tests[i].finishDateTime<actualDate){
				sails.models.test.update({id:tests[i].id},{status:"f"}).exec(function(error, updated){
					if(error){
						console.log(error);
					}
				});
				tests[i].status="f"
			}
			if((tests[i].finishDateTime>actualDate)&&(tests[i].startDateTime<actualDate)){
				sails.models.test.update({id:tests[i].id},{status:"e"}).exec(function(error, updated){
					if(error){
						console.log(error);
					}
				});
				tests[i].status="e"
			}
		}
		return tests;
	},

	parseISOtoDateformat:function(tests){
		for(var i=0;i<tests.length;i++){
			console.log(tests[i].startDateTime);
			tests[i].startDateTime=new Date(Date.parse(tests[i].startDateTime));
			console.log(tests[i].startDateTime);
			tests[i].finishDateTime=new Date(Date.parse(tests[i].finishDateTime));
		}
		return tests;
	},

	getTestsByCourseByTeacher:function(req, res){
		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			var email=null;
		}
		if(req.body.course.id){
			var idCourse=req.body.course.id;
		}else{
			var idCourse=null;
		}

		sails.models.usrcou.findOne({email:email, status:'t', idCourse:idCourse}).exec(function(err, result){
			if(err){
				console.log(err);
				return res.json(500,{msg:"Error"});
			}else{
				if(result){
					var status='s';
					sails.models.test.find({idCourse:idCourse}).exec(function (error, records){
						if(error){
							return res.json(400,{
								msg: 'Bad request'
							});
						}else{
							var tests=sails.controllers.test.checkStatus(records);
							return res.json(200,{
								msg: 'OK',
								tests:tests
							});
						}
					})

				}else{
					return res.json(400,{msg:"The user is not the owner of the course"});
				}
			}
		});
	},

	getTestsByCourseByStudent:function(req, res){
		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			var email=null;
		}
		if(req.body.course.id){
			var idCourse=req.body.course.id;
		}else{
			var idCourse=null;
		}

		sails.models.usrcou.findOne({email:email, status:'s', idCourse:idCourse}).exec(function(err, result){
			if(err){
				console.log(err);
				return res.json(500,{msg:"Error"});
			}else{
				if(result){
					var status='s';
					sails.models.test.find({idCourse:idCourse}).exec(function (error, records){
						if(error){
							return res.json(400,{
								msg: 'Bad request'
							});
						}else{
							var tests=sails.controllers.test.checkStatus(records);
							return res.json(200,{
								msg: 'OK',
								tests:tests
							});
						}
					})

				}else{
					return res.json(400,{msg:"The user is not a student of the course"});
				}
			}
		});
	},
	getTestsCreatedByUser:function(req, res){
		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			var email=null;
		}
		sails.models.test.find({createdBy:email}).exec(function (error, records){
			if(error){
				return res.json(400,{
					msg: 'Bad request'
				});
			}else{
				var tests=sails.controllers.test.checkStatus(records);
				return res.json(200,{
					msg: 'OK',
					tests:tests
				});
			}
		})
	},

	getTestsByStudent:function(req, res){
		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			var email=null;
		}
		sails.models.test.query('SELECT T.TITLE AS title, T.STARTDATETIME AS startDateTime, T.FINISHDATETIME AS finishDateTime, T.IDTEST AS id, T.STATUS AS status FROM TEST T, USR_TES UT WHERE UT.EMAIL=? AND UT.IDTEST=T.IDTEST AND T.CREATEDBYTEST!=UT.EMAIL',[email], function(err, results) {
			if (err){
				console.log(err);
				return res.json(512,{msg:"Error"});
			}else{
				var tests=sails.controllers.test.checkStatus(results);
				return res.json(200,{msg:"OK", tests:tests});
			}
		});
	},

	deleteTest:function(req,res){
		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			return res.json(400,{msg:"No email send"});
		}
		if(req.body.test.id){
			var testId=req.body.test.id;
		}else{
			return res.json(400,{msg:"No test send"});
		}
		sails.models.usrtes.findOne({idTest:testId ,email:email, status:'t'}).exec(function(error, finded){
			if(error){
				return res.json(500,{msg:"Error deleting the test"});
			}else{
				if(finded){
					sails.models.test.destroy({id:testId}).exec(function(error){
						if(error){
							return res.json(500,{msg:"Error deleting the test"});
						}else{
							return res.json(200,{msg:"Test deleted"});
						}
					})
				}else{
					return res.json(400,{msg:"The user is not the owner of the test or there is no test with that ids"});
				}
			}
		});
	},

	getTestById:function(req,res){


		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			return res.json(400,{msg:"No email send"});
		}
		if(req.body.test.id){
			var testId=req.body.test.id;
		}else{
			return res.json(400,{msg:"No test send"});
		}
		console.log(email);
		console.log(testId);
		sails.models.test.findOne({id:testId, createdBy:email}).exec(function(error, finded){
			if(error){
				return res.json(500,{msg:"Error"});
			}else{
				if(finded){
					test={};
					test.title=finded.title;
					test.description=finded.description;
					test.course=finded.idCourse;
					test.intents=finded.intents;
					test.startDateTime=finded.startDateTime;
					test.finishDateTime=finded.finishDateTime;
					test.multipleChoiceQuestions=[];
					test.fillQuestions=[];
					test.trueFalseQuestions=[];
					test.questions=[];
					var optionsPromises=[];
					var questionsPromise=sails.controllers.question.getQuestionsByTest(testId)
					.then(function(questions){
						console.log("Se obtuvieron las preguntas");
						test.questions=questions;
						for(var i=0;i<test.questions.length;i++){
							optionsPromises.push(sails.controllers.option.getOptionsByQuestion(test.questions[i]));
						}
						console.log("Esperando los datos")
						Promise.all(optionsPromises).then(function(){
							console.log("se obtuvieron los datos completos");
							//console.log(test.questions);
							sails.controllers.question.separateQuestionsByType(test);
							return res.json(200,{test:test, msg:"OK"});
						})
						.catch(function(error){
							console.log(error);
							return res.json(500,{msg:"Error retrieving the questions"});

						})
					})
					.catch(function(error){
						return res.json(500,{msg:"Error retrieving the questions"});
					})
					//get questions

				}else{
					return res.json(400,{msg:"The user is not the owner of the test or there is no test with that ids"});
				}
			}
		})

	},

	/*Without Questions*/
	getTestWOQuestionsById:function(req,res){


		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			return res.json(400,{msg:"No email send"});
		}
		if(req.body.test.id){
			var testId=req.body.test.id;
		}else{
			return res.json(400,{msg:"No test send"});
		}
		console.log(email);
		console.log(testId);
		sails.models.test.findOne({id:testId, createdBy:email}).exec(function(error, finded){
			if(error){
				return res.json(500,{msg:"Error"});
			}else{
				if(finded){
					test={};
					test.title=finded.title;
					test.description=finded.description;
					test.course=finded.idCourse;
					test.intents=finded.intents;
					test.startDateTime=finded.startDateTime;
					test.finishDateTime=finded.finishDateTime;
					return res.json(200,{test:test, msg:"OK"});
				}else{
					return res.json(400,{msg:"The user is not the owner of the test or there is no test with that ids"});
				}
			}
		})

	},

	getStudentsByTest:function(req,res){


		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			return res.json(400,{msg:"No email send"});
		}
		if(req.body.test.id){
			var testId=req.body.test.id;
		}else{
			return res.json(400,{msg:"No test send"});
		}
		console.log(email);
		console.log(testId);
		sails.models.usrtes.find({email:email, idTest:testId, status:'t'})
		.then(function(recordsFinded){
			if(recordsFinded.length==0){
				return res.json(403,{msg:"The user is not the owner of the test"});
			}
			sails.models.usrtes.find({idTest:testId, status:'s'})
			.then(function(recordsFinded){
				var allPromises=[];
				var students=[];
				for(var i=0;i<recordsFinded.length;i++){
					var promise=sails.controllers.user.getStudentDataWithScore(recordsFinded[i].email, recordsFinded[i].score, students)
					.then(function(student){
						console.log("Usuario luego de la promesa");
						console.log(student);
						students.push(student);
					})
					allPromises.push(promise);
				}
				console.log(students);
				Promise.all(allPromises)
				.then(function(){
					return res.json(200,{msg:"List of user get successfully", students:students});
				})
				.catch(function(error){
					return res.json(500,{msg:"The user is not the owner of the test"});
				})



			})
			.catch(function(error){
				console.log(error);
				return res.json(500,{msg:"Error getting the students of the tests"});
			})
		})
		.catch(function(error){
			console.log(error);
			return res.json(500,{msg:"Error getting the students of the tests"});
		})
	},


	getTestByIdForStudent:function(req,res){


		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			return res.json(400,{msg:"No email send"});
		}
		if(req.body.test.id){
			var testId=req.body.test.id;
		}else{
			return res.json(400,{msg:"No test send"});
		}

		console.log(email);
		console.log(testId);
		sails.models.usrtes.findOne({email:email, status:'s', idTest:testId}).exec(function(error, recordFinded){
			if(error){
				return res.json(500,{msg:"Error retrieving the test"});
			}else{
				if(recordFinded){
					sails.models.test.findOne({id:testId}).exec(function(error, finded){
						if(error){
							return res.json(500,{msg:"Error retrieving the test"});
						}else{
							if(finded){
								test={};
								test.title=finded.title;
								test.description=finded.description;
								test.course=finded.idCourse;
								test.startDateTime=finded.startDateTime;
								test.finishDateTime=finded.finishDateTime;
								test.multipleChoiceQuestions=[];
								test.fillQuestions=[];
								test.trueFalseQuestions=[];
								test.questions=[];
								var optionsPromises=[];
								var questionsPromise=sails.controllers.question.getQuestionsByTest(testId)
								.then(function(questions){
									console.log("Se obtuvieron las preguntas");
									test.questions=questions;
									for(var i=0;i<test.questions.length;i++){
										optionsPromises.push(sails.controllers.option.getOptionsByQuestion(test.questions[i]));
									}
									console.log("Esperando los datos")
									Promise.all(optionsPromises).then(function(){
										console.log("se obtuvieron los datos completos");
										//console.log(test.questions);
										//eliminar linea de abajo);
										return res.json(200,{test:test, msg:"OK"});
									})
									.catch(function(error){
										console.log(error);
										return res.json(500,{msg:"Error retrieving the questions"});

									})
								})
								.catch(function(error){
									return res.json(500,{msg:"Error retrieving the questions"});
								})
								//get questions

							}else{
								return res.json(400,{msg:"The user is not the owner of the test or there is no test with that ids"});
							}
						}
					})


				}else{
					return res.json(400,{msg:"The user is not authorized to take the test"});
				}
			}
		})

	},
	edit: function (req, res) {
		if(req.body.test){
			var newTest=req.body.test;
		}else{
			return res.json(400,{msg: 'Error updating the test, there is no test data'});

		}

		if(req.body.test.id){
			var idTest=req.body.test.id;
		}else{
			return res.json(400,{msg: 'Error updating the test, there is no test id'});
		}

		if(req.body.test.intents){
			var intents=req.body.test.intents;
		}else{
			intents=1;
		}
		if(req.body.test.title){
			var title=req.body.test.title;
		}else{
			return res.json(400,{msg: 'Error creating the test, there is no title'});
		}
		if(req.body.test.description){
			var description=req.body.test.description;
		}else{
			var description=null;
		}
		if(req.body.test.createdBy){
			var createdBy=req.body.test.createdBy;
		}else{
			return res.json(400,{msg: 'Error creating the test, there is no owner'});
		}
		if(req.body.test.status){
			var status=req.body.test.status;
		}else{
			var status=null;
		}
		if(req.body.test.startDateTime){
			var startDateTime=req.body.test.startDateTime;
		}else{
			return res.json(400,{msg: 'Error creating the test, there should be an start date-time'});
		}
		if(req.body.test.finishDateTime){
			var finishDateTime=req.body.test.finishDateTime;
		}else{
			return res.json(400,{msg: 'Error creating the test, there should be an finish date-time'});
		}
		if(req.body.test.course){
			var idCourse=req.body.test.course;
		}else{
			return res.json(400,{msg: 'Error creating the test, there should be a course'});
		}
		//return res.json(201,{msg: 'Test created'});
		var errorCheckingTest=sails.controllers.test.checkTestData(req);
		if(errorCheckingTest.error==true){
			console.log(errorCheckingTest.msg);
			return res.json(400, {msg:"Error creating the test, wrong test format send"});
		}
		/*Update test data*/
		sails.models.test.update({id:idTest},{
			title:title,
			description:description,
			startDateTime:startDateTime,
			finishDateTime:finishDateTime,
			intents:intents
		})
		.then(function(){
			/*Update intents left of all students*/
			sails.models.usrtes.query('UPDATE USR_TES SET INTENTLEFT=? WHERE STATUSUSRTES="s" AND IDTEST=? ', [intents, idTest], function(error, results){
				if(error){
					console.log("error aqui lol");
					console.log(error);
					return res.json(500, {msg:"Error updating the test"});
				}
			})
		})
		.catch(function(error){
			console.log("Error aca");
			console.log(error);
			return res.json(500, {msg:"Error updating the test, wrong test format send"});
		})

		/*Get questions*/
		var multipleChoiceQuestions=req.body.multipleChoiceQuestions;
		var fillQuestions=req.body.fillQuestions;
		var trueFalseQuestions=req.body.trueFalseQuestions;
		/*Format questions*/
		sails.controllers.question.formatMultipleChoiceQuestionsAngularToServer(multipleChoiceQuestions);
		sails.controllers.question.formatFillQuestionsAngularToServer(fillQuestions);
		sails.controllers.question.formatTrueFalseQuestionsAngularToServer(trueFalseQuestions);
		var questionsPromises=[];
		var optionsPromises=[];
		console.log(multipleChoiceQuestions[0]);
		/*Separte questions in questions to be created and questions to be updated*/
		var multipleChoiceQuestionsToBeCreated=[];
		var multipleChoiceQuestionsToBeUpdated=[];
		var fillQuestionsToBeCreated=[];
		var fillQuestionsToBeUpdated=[];
		var trueFalseQuestionsToBeCreated=[];
		var trueFalseQuestionsToBeUpdated=[];
		sails.controllers.question.separateQuestionByAction(multipleChoiceQuestions,multipleChoiceQuestionsToBeCreated,multipleChoiceQuestionsToBeUpdated);
		sails.controllers.question.separateQuestionByAction(fillQuestions,fillQuestionsToBeCreated,fillQuestionsToBeUpdated);
		sails.controllers.question.separateQuestionByAction(trueFalseQuestions,trueFalseQuestionsToBeCreated,trueFalseQuestionsToBeUpdated);
		console.log("Multiple choice questions to be created")
		console.log(multipleChoiceQuestionsToBeCreated);
		console.log("Multiple choice questions to be updated")
		console.log(multipleChoiceQuestionsToBeUpdated);
		console.log("TF questions to be created")
		console.log(trueFalseQuestionsToBeCreated);
		console.log("TF questions to be updated")
		console.log(trueFalseQuestionsToBeUpdated);
		console.log("fill questions to be created")
		console.log(fillQuestionsToBeCreated);
		console.log("fill questions to be updated")
		console.log(fillQuestionsToBeUpdated);

		/*Register mc questions*/
		for (var i=0;i<multipleChoiceQuestionsToBeCreated.length;i++){
			var questionPromise=sails.controllers.question.register(multipleChoiceQuestionsToBeCreated[i],newTest)
			.then(function(questionCreated){
				for(var k=0;k<multipleChoiceQuestionsToBeCreated.length;k++){
					if(multipleChoiceQuestionsToBeCreated[k].text==questionCreated.text){
						console.log("Se hizo match");
						multipleChoiceQuestionsToBeCreated[k].id=questionCreated.id;
					}
				}
			})
			.catch(function(error){
				console.log(error);
				return res.json(512,{msg: 'Error creating the test'});
			})
			questionsPromises.push(questionPromise);
		}

		/*Register fill questions*/
		for (var i=0;i<fillQuestionsToBeCreated.length;i++){
			var questionPromise=sails.controllers.question.register(fillQuestionsToBeCreated[i],newTest)
			.then(function(questionCreated){
				for(var k=0;k<fillQuestionsToBeCreated.length;k++){
					if(fillQuestionsToBeCreated[k].text==questionCreated.text){
						fillQuestionsToBeCreated[k].id=questionCreated.id;
					}
				}
			})
			.catch(function(error){
				console.log(error);
				return res.json(512,{msg: 'Error creating the test'});
			})
			questionsPromises.push(questionPromise);
		}

		/*Register true false questions*/
		for (var i=0;i<trueFalseQuestionsToBeCreated.length;i++){
			var questionPromise=sails.controllers.question.register(trueFalseQuestionsToBeCreated[i],newTest)
			.then(function(questionCreated){
				for(var k=0;k<trueFalseQuestionsToBeCreated.length;k++){
					if(trueFalseQuestionsToBeCreated[k].text==questionCreated.text){
						trueFalseQuestionsToBeCreated[k].id=questionCreated.id;
					}
				}
			})
			.catch(function(error){
				console.log(error);
				return res.json(512,{msg: 'Error creating the test'});
			})
			questionsPromises.push(questionPromise);
		}

		/*Update multiple choice questions*/
		for (var i=0;i<multipleChoiceQuestionsToBeUpdated.length;i++){
			var questionPromise=sails.controllers.question.update(multipleChoiceQuestionsToBeUpdated[i],newTest);
			questionsPromises.push(questionPromise);
		}

		/*Update true false questions*/
		for (var i=0;i<trueFalseQuestionsToBeUpdated.length;i++){
			var questionPromise=sails.controllers.question.update(trueFalseQuestionsToBeUpdated[i],newTest);
			questionsPromises.push(questionPromise);
		}

		/*Update fill questions*/
		for (var i=0;i<fillQuestionsToBeUpdated.length;i++){
			var questionPromise=sails.controllers.question.update(fillQuestionsToBeUpdated[i],newTest);
			questionsPromises.push(questionPromise);
		}

		Promise.all(questionsPromises)
		.then(function(){
			/*Register options*/
			for(var i=0;i<multipleChoiceQuestionsToBeCreated.length;i++){
				for(var j=0;j<multipleChoiceQuestionsToBeCreated[i].options.length;j++){
					var optionPromise=sails.controllers.option.register(multipleChoiceQuestionsToBeCreated[i].options[j],multipleChoiceQuestionsToBeCreated[i]);
					optionsPromises.push(optionPromise);
				}
			}
			for(var i=0;i<trueFalseQuestionsToBeCreated.length;i++){
				for(var j=0;j<trueFalseQuestionsToBeCreated[i].options.length;j++){
					var optionPromise=sails.controllers.option.register(trueFalseQuestionsToBeCreated[i].options[j],trueFalseQuestionsToBeCreated[i]);
					optionsPromises.push(optionPromise);
				}
			}
			for(var i=0;i<fillQuestionsToBeCreated.length;i++){
				for(var j=0;j<fillQuestionsToBeCreated[i].options.length;j++){
					var optionPromise=sails.controllers.option.register(fillQuestionsToBeCreated[i].options[j],fillQuestionsToBeCreated[i]);
					optionsPromises.push(optionPromise);
				}
			}
			/*Update options*/
			sails.controllers.question.separateAllOptionsOfQuestionsByAction(multipleChoiceQuestionsToBeUpdated);
			sails.controllers.question.separateAllOptionsOfQuestionsByAction(fillQuestionsToBeUpdated);
			sails.controllers.question.separateAllOptionsOfQuestionsByAction(trueFalseQuestionsToBeUpdated);

			/*Update multiple choice options*/
			for(var i=0;i<multipleChoiceQuestionsToBeUpdated.length;i++){
				for(var j=0;j<multipleChoiceQuestionsToBeUpdated[i].optionsToBeUpdated.length;j++){
					var optionPromise=sails.controllers.option.update(multipleChoiceQuestionsToBeUpdated[i].optionsToBeUpdated[j],multipleChoiceQuestionsToBeUpdated[i]);
					optionsPromises.push(optionPromise);
				}
				for(var j=0;j<multipleChoiceQuestionsToBeUpdated[i].optionsToBeCreated.length;j++){
					var optionPromise=sails.controllers.option.register(multipleChoiceQuestionsToBeUpdated[i].optionsToBeCreated[j],multipleChoiceQuestionsToBeUpdated[i]);
					optionsPromises.push(optionPromise);
				}
			}
			/*Update fill options*/
			for(var i=0;i<fillQuestionsToBeUpdated.length;i++){
				for(var j=0;j<fillQuestionsToBeUpdated[i].optionsToBeUpdated.length;j++){
					var optionPromise=sails.controllers.option.update(fillQuestionsToBeUpdated[i].optionsToBeUpdated[j],fillQuestionsToBeUpdated[i]);
					optionsPromises.push(optionPromise);
				}
				for(var j=0;j<fillQuestionsToBeUpdated[i].optionsToBeCreated.length;j++){
					var optionPromise=sails.controllers.option.register(fillQuestionsToBeUpdated[i].optionsToBeCreated[j],fillQuestionsToBeUpdated[i]);
					optionsPromises.push(optionPromise);
				}
			}
			/*Update trueFalse options*/
			for(var i=0;i<trueFalseQuestionsToBeUpdated.length;i++){
				for(var j=0;j<trueFalseQuestionsToBeUpdated[i].optionsToBeUpdated.length;j++){
					console.log("Linea 933");
					console.log(trueFalseQuestionsToBeUpdated[i].optionsToBeUpdated);
					var optionPromise=sails.controllers.option.update(trueFalseQuestionsToBeUpdated[i].optionsToBeUpdated[j],trueFalseQuestionsToBeUpdated[i]);
					optionsPromises.push(optionPromise);
				}
			}
			Promise.all(optionsPromises)
			.then(function(){
				return res.json(200, {msg:"Test successfully updated"});
			})
			.catch(function(error){
				console.log(error);
				return res.json(500, {msg:"Error updating the test"});
			})
		})
		.catch(function(error){
			console.log(error);
			return res.json(500, {msg:"Error updating the test"});
		})

	},

	registerTakenTest:function(req,res){

		if(req.body.test){
			var test=req.body.test;
			if(!test.id){
				return res.json(400,{msg: 'Error registering the taken test data, there is no test id'});
			}
		}else{
			return res.json(400,{msg: 'Error registering the taken test data, there is no test data'});
		}

		if(req.body.user){
			var user=req.body.user;
			if(!user.email){
				return res.json(400,{msg: 'Error registering the taken test data, there is no user email'});
			}
		}else{
			return res.json(400,{msg: 'Error registering the taken test data, there is no user data'});
		}

		if(!test.questions){
			return res.json(400,{msg: 'Error registering the taken test data, there is no question data'});
		}else{
			var allPromises=[];
			console.log("linea 1097");
			var totalWeighing=0;
			var parcialScore=0;
			for(var i=0;i<test.questions.length;i++){
				var weighing=test.questions[i].weighing;
				totalWeighing=weighing+totalWeighing;

				for(var j=0;j<test.questions[i].options.length;j++){
					if((test.questions[i].options[j].isCorrect==true)&&(test.questions[i].options[j].isSelected==true)){
						parcialScore=parcialScore+weighing;
						console.log("parcial score:"+parcialScore);
					}
				}
			}
			var score=parcialScore/totalWeighing;
			console.log("score:"+score)
			/*Find the student-test record*/
			sails.models.usrtes.findOne({email:user.email, idTest:test.id, status:"s"})
			.then(function(finded){
				console.log("linea 1112")
				console.log(finded);
				if(finded.intentLeft==0){
					return res.json(400,{msg: 'Error registering the taken test data, you exceed the intents for the test'});
				}
				/*If the new score is higher than the older one or if this is the first try*/
				if(finded.score==null || finded.score<score){
					console.log("Score of finded"+finded.score);
					if(finded.score!=null){
						var olderScore=finded.score;
						console.log("Older score"+olderScore);
					}
					if(finded.score<score){
						var queryPromise=Promise.promisify(sails.models.usropt.query);
						var promise=queryPromise('DELETE FROM USR_OPT WHERE IDOPTION IN (SELECT IDOPTION FROM (SELECT UO.IDOPTION FROM USR_OPT UO, OPTIO O, QUESTION Q, TEST T WHERE UO.IDOPTION=O.IDOPTION AND O.IDQUESTION=Q.IDQUESTION AND Q.IDTEST=T.IDTEST AND T.IDTEST=? ) AS TEMPORALUSR_OPT) AND EMAIL=?', [test.id, user.email])
						.then(function(){
							for(var i=0;i<test.questions.length;i++){
								for(var j=0;j<test.questions[i].options.length;j++){
									if(test.questions[i].options[j].isSelected==true){
										var insertPromise=sails.models.usropt.create({email:user.email, idOption:test.questions[i].options[j].id}).then(function(created){
											console.log("Record created:");
											console.log(created);
										})
										allPromises.push(insertPromise);
									}
								}
							}
						})
						.catch(function(error){
							console.log(error);
						})
						allPromises.push(promise);

					}
					if(finded.score==null){
						for(var i=0;i<test.questions.length;i++){
							for(var j=0;j<test.questions[i].options.length;j++){
								if(test.questions[i].options[j].isSelected==true){
									var insertPromise=sails.models.usropt.create({email:user.email, idOption:test.questions[i].options[j].id}).then(function(created){
										console.log("Record created:");
										console.log(created);
									})
									allPromises.push(insertPromise);
								}
							}
						}
					}
					/*Update the student-test record*/
					var updateTestPromise=sails.models.usrtes.update({email:user.email, idTest:test.id, status:"s"},{score:score,intentLeft:finded.intentLeft-1})
					.then(function(){
						console.log("linea 1120")
						/*Find all the records of the students-test to calculate the new average score of the test*/
						sails.models.usrtes.find({idTest:test.id, status:"s", score:{not:null}})
						.then(function(finded){
							console.log("linea 1122");
							/*Its already counting the new record added*/
							var testTaken=finded.length;
							/*Find the test*/
							sails.models.test.findOne({id:test.id})
							.then(function(finded){
								console.log("linea 1124")
								/*TODO if new test average+1 if not average-1+1*/
								if(olderScore!=null){
									var averageScore=((finded.averageScore*testTaken)+score-olderScore)/(testTaken);
									sails.models.test.update({id:test.id},{averageScore:averageScore})
									.then(function(updated){
										console.log("Records updated"+updated[0]);
									})
									.catch(function(error){
										console.log(error);
										return res.json(500,{msg: 'Error registering the taken test data'});
									})
								}else{
									/*The new record added shouldnt be counted*/
									testTaken=testTaken-1;
									var averageScore=((finded.averageScore*testTaken)+score)/(testTaken+1);
									sails.models.test.update({id:test.id},{averageScore:averageScore})
									.then(function(updated){
										console.log("Records updated"+updated[0]);
									})
									.catch(function(error){
										console.log(error);
										return res.json(500,{msg: 'Error registering the taken test data'});
									})
								}
							})
							.catch(function(error){
								console.log(error);
								return res.json(500,{msg: 'Error registering the taken test data'});
							})
						})
						.catch(function(error){
							console.log(error);
							return res.json(500,{msg: 'Error registering the taken test data'});
						})
					})
					.catch(function(error){
						console.log(error);
						return res.json(500,{msg: 'Error registering the taken test data'});
					})
					allPromises.push(updateTestPromise);
				}else{
					/*Score lower than before*/
					console.log("nota inferior")
					sails.models.usrtes.update({email:user.email, idTest:test.id, status:"s"},{intentLeft:finded.intentLeft-1})
					.catch(function(error){
						return res.json(500,{msg:'Error registering the taken test data'});
					})
				}
			});
			Promise.all(allPromises)
			.then(function(){
				return res.json(200,{msg: 'OK', score:score});
			})
			.catch(function(error){
				console.log(error);
				return res.json(500,{msg:'Error registering the taken test data'});
			})


		}



	},

	cloneQuestion:function(req,res){
		if(req.body.user){
			var user=req.body.user;
			if(!user.email){
				return res.json(400,{msg: 'Error cloning the question, there is no user email send'});
			}
		}else{
			return res.json(400,{msg: 'Error cloning the question, there is no user data send'});
		}

		if(req.body.test){
			var test=req.body.test;
			if(!test.id){
				return res.json(400,{msg: 'Error cloning the question, there is no test id send'});
			}
		}else{
			return res.json(400,{msg: 'Error cloning the question, there is no test data send'});
		}

		if(req.body.question){
			var question=req.body.question;
		}else{
			return res.json(400,{msg: 'Error cloning the question, there is no question data send'});
		}
		/*Checking if the user is the owner of the test*/
		sails.models.usrtes.findOne({email:user.email, idTest:test.id, status:'t'}).exec(function(error, finded){
			if(error){
				return res.json(500,{msg: 'Error cloning the question'});
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
							return res.json(200,{msg: 'Question cloned successfully'});
						})
						.catch(function(error){
							return res.json(500,{msg: 'Error cloning the question'});
						})
					})
					.catch(function(error){
						return res.json(500,{msg: 'Error cloning the question'});
					})

				}else{
					return res.json(400,{msg: 'Error cloning the question, the user is not the owner of the test'});
				}
			}
		});


	},

	createCloneTest:function(mappedTests, oldTest, courseId){
		var createTestPromise=sails.models.test.create({idCourse:courseId, title:oldTest.title, description:oldTest.description, createdBy:oldTest.createdBy, status:oldTest.status, startDateTime:oldTest.startDateTime, finishDateTime:oldTest.finishDateTime, averageScore:0,intents:oldTest.intents})
		.then(function(testCreated){
			mappedTests.push({oldTest:oldTest, newTest:testCreated});
		})
		return createTestPromise;
	},


};
