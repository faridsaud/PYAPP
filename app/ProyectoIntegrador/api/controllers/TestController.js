/**
* TestController
* @module {Controller} Test
* @author Farid Saud Rolleri
* @description :: Server-side logic for managing tests
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/
var Promise = require("bluebird");
module.exports = {



	/**
	* @memberof module:Test
	* @function register
	* @param  {JSON} req HTTP request object
	* @param  {JSON} req.body.test Test to be registered
	* @param  {string} req.body.test.title Title
	* @param  {string} req.body.test.description Description
	* @param  {int} req.body.test.intents Intents
	* @param  {string} req.body.test.createdBy Email of the teacher creating the test
	* @param  {string} req.body.test.status Status
	* @param  {datetime} req.body.test.startDateTime Starting date-time
	* @param  {datetime} req.body.test.finishDateTime Starting date-time
	* @param  {int} req.body.test.course Course in which the test will be created
	* @param  {JSON[]} req.body.multipleChoiceQuestions Multiple choice questions of the test
	* @param  {JSON[]} req.body.fillQuestions Fill questions of the test
	* @param  {JSON[]} req.body.trueFalseQuestions True false questions of the tests
	* @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
	* @description Register the test
	*/
	register: function (req, res) {
		if(!req.body.test){
			return res.json(400,{code:7,msg: 'Error creating the test, there is no title', msgES:"No existe titulo"});
		}
		if(req.body.test.title){
			var title=req.body.test.title;
		}else{
			return res.json(400,{code:1,msg: 'Error creating the test, there is no title', msgES:"No existe titulo"});
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
			return res.json(400,{code:2,msg: 'Error creating the test, there is no owner', msgES:"No existe propietario"});
		}
		if(req.body.test.status){
			var status=req.body.test.status;
		}else{
			var status=null;
		}
		if(req.body.test.startDateTime){
			var startDateTime=req.body.test.startDateTime;
		}else{
			return res.json(400,{code:3,msg: 'Error creating the test, there should be an start date-time', msgES:"No exise fecha y hora de inicio"});
		}
		if(req.body.test.finishDateTime){
			var finishDateTime=req.body.test.finishDateTime;
		}else{
			return res.json(400,{code:4, msg: 'Error creating the test, there should be an finish date-time', msgES:"No existe fecha y hora de finalización"});
		}
		if(req.body.test.course){
			var idCourse=req.body.test.course;
		}else{
			return res.json(400,{code:5,msg: 'Error creating the test, there should be a course', msgES:"No existe curso al cual pertenece la prueba"});
		}
		if(finishDateTime<=startDateTime){
			return res.json(400,{code:6,msg: 'Error creating the test, the finishDateTime cannot be earlier than the startDateTime', msgES:"La fecha y hora de finalización no puede ser antes que la fecha y hora de inicio"});

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
										console.log("Id test:"+newTest.id);
										newTest.multipleChoiceQuestions=multipleChoiceQuestions;
										newTest.trueFalseQuestions=trueFalseQuestions;
										newTest.fillQuestions=fillQuestions;
										return res.json(200,{test:newTest,msg: 'Test sucessfully created', msgES:"Prueba creada"});
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


	/**
	* @memberof module:Test
	* @function checkTestData
	* @param  {JSON} req HTTP request objec
	* @param  {JSON[]} req.body.multipleChoiceQuestions Multiple choice questions of the test
	* @param  {JSON[]} req.body.fillQuestions Fill questions of the test
	* @param  {JSON[]} req.body.trueFalseQuestions True false questions of the tests
	* @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
	* @description Checks the format of all the questions of the test
	*/
	checkTestData:function(req){
		/*Check True False questions*/
		if(!req.body.trueFalseQuestions){
			req.body.trueFalseQuestions=[];
		}
		if(!req.body.multipleChoiceQuestions){
			req.body.multipleChoiceQuestions=[];
		}
		if(!req.body.fillQuestions){
			req.body.fillQuestions=[];
		}
		for(var i=0;i<req.body.trueFalseQuestions.length;i++){
			if(req.body.trueFalseQuestions[i].text){
				if(req.body.trueFalseQuestions[i].text.length>=1){
					var patt = /^\w{1,}.{0,}$/;
					var res = patt.test(req.body.trueFalseQuestions[i].text);
					if(res==false){
						return {
							error:true,
							msg:"Wrong statement in question "+i+", cannot be empty",
							msgES:"Enunciado incorrecto en la pregunta "+i+", no puede estar vacío",
							question:i,
							type:"trueFalseQuestions"
						}
					}
				}else{
					return {
						error:true,
						msg:"Wrong statement in question "+i+", cannot be empty",
						msgES:"Enunciado incorrecto en la pregunta "+i+", no puede estar vacío",
						question:i,
						type:"trueFalseQuestions"
					}
				}
			}else{
				return {
					error:true,
					msg:"Wrong statement in question "+i+", cannot be empty",
					msgES:"Enunciado incorrecto en la pregunta "+i+", no puede estar vacío",
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
							msgES:"Enunciado incorrecto en la pregunta "+i+", no puede estar vacío",
							question:i,
							type:"multipleChoiceQuestions"
						}
					}
				}else{
					return {
						error:true,
						msg:"Wrong statement in question "+i+", cannot be empty",
						msgES:"Enunciado incorrecto en la pregunta "+i+", no puede estar vacío",
						question:i,
						type:"multipleChoiceQuestions"
					}
				}
			}else{
				return {
					error:true,
					msg:"Wrong statement in question "+i+", cannot be empty",
					msgES:"Enunciado incorrecto en la pregunta "+i+", no puede estar vacío",
					question:i,
					type:"multipleChoiceQuestions"
				}
			}
			var correctAnswers=0;
			/*check Options*/
			for(var j=0;j<req.body.multipleChoiceQuestions[i].options.length;j++){
				/*check Options*/
				if(req.body.multipleChoiceQuestions[i].options[j].text){
					if(req.body.multipleChoiceQuestions[i].options[j].text.length>=1){
						var patt = /^\w{1,}.{0,}$/;
						var res = patt.test(req.body.multipleChoiceQuestions[i].options[j].text);
						if(res==false){
							return {
								error:true,
								msg:"Wrong statement in question "+i+" option "+j+", cannot be empty",
								msgES:"Enunciado incorrecto en la pregunta "+i+", no puede estar vacío",
								question:i,
								type:"multipleChoiceQuestions"
							}
						}
					}else{
						return {
							error:true,
							msg:"Wrong statement in question "+i+" option "+j+", cannot be empty",
							msgES:"Enunciado incorrecto en la pregunta "+i+", no puede estar vacío",
							question:i,
							type:"multipleChoiceQuestions"
						}
					}
				}else{
					return {
						error:true,
						msg:"Wrong statement in question "+i+" option "+j+", cannot be empty",
						msgES:"Enunciado incorrecto en la pregunta "+i+", no puede estar vacío",
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
				if(req.body.multipleChoiceQuestions[i].options[j].isCorrect){
					correctAnswers++;
				}else{
					req.body.multipleChoiceQuestions[i].options[j].isCorrect=false;
				}
			}
			if(correctAnswers==0){
				return {
					error:true,
					msg:"There should be at least 1 correct answer in question "+i,
					msgES:"Debe haber al menos una respuesta correcta en la pregunta "+i,
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

	/**
	* @memberof module:Test
	* @function checkStatus
	* @param  {JSON[]} tests List of all the test
	* @returns  {JSON[]} List of all the test with their status updated
	* @description Update the status of the tests
	*/
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

	/**
	* @memberof module:Test
	* @function parseISOtoDateformat
	* @param  {JSON[]} tests List of all the tests
	* @returns  {JSON} HTTP response object
	* @description Parse the format of the dates of the tests from ISO to javascript Date
	*/
	parseISOtoDateformat:function(tests){
		for(var i=0;i<tests.length;i++){
			console.log(tests[i].startDateTime);
			tests[i].startDateTime=new Date(Date.parse(tests[i].startDateTime));
			console.log(tests[i].startDateTime);
			tests[i].finishDateTime=new Date(Date.parse(tests[i].finishDateTime));
		}
		return tests;
	},

	/**
	* @memberof module:Test
	* @function getTestsByCourseByTeacher
	* @param  {JSON} req HTTP request object
	* @param  {JSON} req.body.user User retrieving his tests
	* @param  {string} req.body.user.email Email of the user
	* @param  {JSON} req.body.course Course of which the tests will be retrieved
	* @param  {int} req.body.course.id Id
	* @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
	* @description Get all the tests of the course of the teacher
	*/
	getTestsByCourseByTeacher:function(req, res){
		if(!req.body.user){
			return res.json(400,{code:1,msg: 'Error getting the tests, there is not user\'s data'});

		}
		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			return res.json(400,{code:2,msg: 'Error getting the tests, there is not email'});
		}
		if(!req.body.course){
			return res.json(400,{code:3,msg: 'Error getting the tests, there is not course\'s data'});
		}
		if(req.body.course.id){
			var idCourse=req.body.course.id;
		}else{
			return res.json(400,{code:4,msg: 'Error getting the tests, there is not course\'s id'});

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
					return res.json(403,{msg:"The user is not the owner of the course"});
				}
			}
		});
	},

	/**
	* @memberof module:Test
	* @function getTestsByCourseByStudent
	* @param  {JSON} req HTTP request object
	* @param  {JSON} req.body.user User retrieving his tests
	* @param  {string} req.body.user.email Email of the user
	* @param  {JSON} req.body.course Course of which the tests will be retrieved
	* @param  {int} req.body.course.id Id
	* @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
	* @description Get all the tests of the course of the student
	*/
	getTestsByCourseByStudent:function(req, res){
		if(!req.body.user){
			return res.json(400,{code:1,msg: 'Error getting the tests, there is not user\'s data'});

		}
		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			return res.json(400,{code:2,msg: 'Error getting the tests, there is not email'});
		}
		if(!req.body.course){
			return res.json(400,{code:3,msg: 'Error getting the tests, there is not course\'s data'});
		}
		if(req.body.course.id){
			var idCourse=req.body.course.id;
		}else{
			return res.json(400,{code:4,msg: 'Error getting the tests, there is not course\'s id'});

		}
		sails.models.usrcou.findOne({email:email, status:'s', idCourse:idCourse}).exec(function(err, result){
			if(err){
				console.log(err);
				return res.json(500,{msg:"Error"});
			}else{
				if(result){
					var status='s';
					sails.models.test.query('SELECT T.TITLE AS title, T.STARTDATETIME AS startDateTime, T.FINISHDATETIME AS finishDateTime, T.IDTEST AS id, T.STATUS AS status, UT.INTENTLEFT as intentsLeft, T.INTENTS as intents FROM TEST T, USR_TES UT WHERE UT.EMAIL=? AND T.IDCOURSE=? AND UT.IDTEST=T.IDTEST AND T.CREATEDBYTEST!=UT.EMAIL',[email,idCourse], function(error, records) {
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
					return res.json(403,{msg:"The user is not a student of the course"});
				}
			}
		});
	},

	/**
	* @memberof module:Test
	* @function getTestsCreatedByUser
	* @param  {JSON} req HTTP request object
	* @param  {JSON} req.body.user User retrieving his tests
	* @param  {string} req.body.user.email Email of the user
	* @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
	* @description Get all the tests that the user have created
	*/
	getTestsCreatedByUser:function(req, res){
		if(!req.body.user){
			return res.json(400,{code:1,msg: 'Error getting the tests, no user data send'});
		}
		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			return res.json(400,{code:2,msg: 'Error getting the tests, no user email send'});
		}
		sails.models.test.find({createdBy:email}).exec(function (error, records){
			if(error){
				return res.json(500,{msg: 'Error getting the tests'});
			}else{
				var tests=sails.controllers.test.checkStatus(records);
				return res.json(200,{msg: 'OK',tests:tests});
			}
		})
	},


	/**
	* @memberof module:Test
	* @function getTestsByStudent
	* @param  {JSON} req HTTP request object
	* @param  {JSON} req.body.user User retrieving his tests
	* @param  {string} req.body.user.email Email of the user
	* @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
	* @description Get all the tests of which the student has access to
	*/
	getTestsByStudent:function(req, res){
		if(!req.body.user){
			return res.json(400,{code:1,msg:"Error getting the tests, there is not user\'s data send"});
		}
		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			return res.json(400,{code:2,msg:"Error getting the tests, there is not user\'s email send"});
		}
		sails.models.test.query('SELECT T.TITLE AS title, T.STARTDATETIME AS startDateTime, T.FINISHDATETIME AS finishDateTime, T.IDTEST AS id, T.STATUS AS status, UT.INTENTLEFT as intentsLeft,UT.SCORE as score, T.INTENTS as intents FROM TEST T, USR_TES UT WHERE UT.EMAIL=? AND UT.IDTEST=T.IDTEST AND T.CREATEDBYTEST!=UT.EMAIL',[email], function(err, results) {
			if (err){
				console.log(err);
				return res.json(512,{msg:"Error"});
			}else{
				var tests=sails.controllers.test.checkStatus(results);
				return res.json(200,{msg:"OK", tests:tests});
			}
		});
	},


	/**
	* @memberof module:Test
	* @function deleteTest
	* @param  {JSON} req HTTP request object
	* @param  {JSON} req.body.user User deleting the test
	* @param  {string} req.body.user.email Email
	* @param  {JSON} req.body.test Test that will be deleted
	* @param  {int} req.body.test.id Id
	* @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
	* @description Delete the test
	*/
	deleteTest:function(req,res){
		if(!req.body.user){
			return res.json(400,{code:1,msg:"Error deleting the test. No user\'s data send", msgES:"Datos del usuario no envíados"});
		}
		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			return res.json(400,{code:2,msg:"Error deleting the test. No user\'s email send", msgES:"Email del usuario no envíado"});
		}
		if(!req.body.test){
			return res.json(400,{code:3,msg:"Error deleting the test. No test\'s data send", msgES:"Datos de la prueba no envíados"});
		}
		if(req.body.test.id){
			var testId=req.body.test.id;
		}else{
			return res.json(400,{code:4,msg:"Error deleting the test. No test\'s id send", msgES:"Id de la prueba no envíado"});
		}
		sails.models.usrtes.findOne({idTest:testId ,email:email, status:'t'}).exec(function(error, finded){
			if(error){
				return res.json(500,{msg:"Error deleting the test", msgES:"Error borrando la prueba"});
			}else{
				if(finded){
					sails.models.test.destroy({id:testId}).exec(function(error){
						if(error){
							return res.json(500,{msg:"Error deleting the test"});
						}else{
							return res.json(200,{msg:"Test deleted", msgES:"Prueba borrada"});
						}
					})
				}else{
					return res.json(403,{msg:"The user is not the owner of the test or there is no test with that ids", msgES:"El usuario no es el propietario de la prueba o no existen pruebas con ese Id"});
				}
			}
		});
	},

	/**
	* @memberof module:Test
	* @function getTestById
	* @param  {JSON} req HTTP request object
	* @param  {JSON} req.body.user User retrieving his test
	* @param  {string} req.body.user.email Email
	* @param  {JSON} req.body.test Test that will be retrieved
	* @param  {int} req.body.test.id Id
	* @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
	* @description Get all the information of the test
	*/

	getTestById:function(req,res){

		if(!req.body.user){
			return res.json(400,{code:1,msg:"No user\'s data send"});
		}
		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			return res.json(400,{code:2,msg:"No user\'s email send"});
		}
		if(!req.body.test){
			return res.json(400,{code:3,msg:"No test\'s data send"});
		}
		if(req.body.test.id){
			var testId=req.body.test.id;
		}else{
			return res.json(400,{code:4,msg:"No test\'s id send"});
		}
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
					return res.json(403,{msg:"The user is not the owner of the test or there is no test with that ids"});
				}
			}
		})

	},


	/**
	* @memberof module:Test
	* @function getTestWOQuestionsById
	* @param  {JSON} req HTTP request object
	* @param  {JSON} req.body.user User retrieving his test
	* @param  {string} req.body.user.email Email
	* @param  {JSON} req.body.test Test that will be retrieved
	* @param  {int} req.body.test.id Id
	* @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
	* @description Get all the information of the test except it questions
	*/

	getTestWOQuestionsById:function(req,res){

		if(!req.body.user){
			return res.json(400,{code:1,msg:"No user\'s data send"});
		}
		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			return res.json(400,{code:2,msg:"No user\'s email send"});
		}
		if(!req.body.test){
			return res.json(400,{code:3,msg:"No test\'s data send"});
		}
		if(req.body.test.id){
			var testId=req.body.test.id;
		}else{
			return res.json(400,{code:4,msg:"No test\'s id send"});
		}

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
					return res.json(403,{msg:"The user is not the owner of the test or there is no test with that ids"});
				}
			}
		})

	},


	/**
	* @memberof module:Test
	* @function getStudentsByTest
	* @param  {JSON} req HTTP request object
	* @param  {JSON} req.body.user User retrieving the students
	* @param  {string} req.body.user.email Email
	* @param  {JSON} req.body.test Test on which the students are registered
	* @param  {int} req.body.test.id Id
	* @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
	* @description Get all students that are registered in the test
	*/
	getStudentsByTest:function(req,res){
		if(!req.body.user){
			return res.json(400,{code:1,msg:"No user\'s data send"});
		}
		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			return res.json(400,{code:2,msg:"No user\'s email send"});
		}
		if(!req.body.test){
			return res.json(400,{code:3,msg:"No test\'s data send"});
		}
		if(req.body.test.id){
			var testId=req.body.test.id;
		}else{
			return res.json(400,{code:4,msg:"No test\'s id send"});
		}
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
					return res.json(500,{msg:"Error getting the students"});
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

	/**
	* @memberof module:Test
	* @function getTestByIdForStudent
	* @param  {JSON} req HTTP request object
	* @param  {JSON} req.body.user User retrieving the test
	* @param  {string} req.body.user.email Email
	* @param  {JSON} req.body.test Test that will be retrieved
	* @param  {int} req.body.test.id Id
	* @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
	* @description Get the information of the test that the student has access to
	*/
	getTestByIdForStudent:function(req,res){

		if(!req.body.user){
			return res.json(400,{code:1,msg:"No user\'s data send"});
		}
		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			return res.json(400,{code:2,msg:"No user\'s email send"});
		}
		if(!req.body.test){
			return res.json(400,{code:3,msg:"No test\'s data send"});
		}
		if(req.body.test.id){
			var testId=req.body.test.id;
		}else{
			return res.json(400,{code:4,msg:"No test\'s id send"});
		}
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
									Promise.all(optionsPromises).then(function(){
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
					return res.json(403,{msg:"The user is not authorized to take the test"});
				}
			}
		})

	},

	/**
	* @memberof module:Test
	* @function edit
	* @param  {JSON} req HTTP request object
	* @param  {JSON} req.body.test Test to be updated
	* @param  {string} req.body.test.id Id
	* @param  {string} req.body.test.title Title
	* @param  {string} req.body.test.description Description
	* @param  {int} req.body.test.intents Intents
	* @param  {string} req.body.test.createdBy Email of the teacher updating the test
	* @param  {string} req.body.test.status Status
	* @param  {datetime} req.body.test.startDateTime Starting date-time
	* @param  {datetime} req.body.test.finishDateTime Starting date-time
	* @param  {int} req.body.test.course Course in which the test will be updated
	* @param  {JSON[]} req.body.multipleChoiceQuestions Multiple choice questions of the test
	* @param  {JSON[]} req.body.fillQuestions Fill questions of the test
	* @param  {JSON[]} req.body.trueFalseQuestions True false questions of the tests
	* @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
	* @description Edit the test
	*/
	edit: function (req, res) {
		if(req.body.test){
			var newTest=req.body.test;
		}else{
			return res.json(400,{code:1,msg: 'Error updating the test, there is no test data', msgES:"Datos de la prueba no envíados"});

		}

		if(req.body.test.id){
			var idTest=req.body.test.id;
		}else{
			return res.json(400,{code:2,msg: 'Error updating the test, there is no test id', msgES:"Id de la prueba no envíado"});
		}

		if(req.body.test.intents){
			var intents=req.body.test.intents;
		}else{
			intents=1;
		}
		if(req.body.test.title){
			var title=req.body.test.title;
		}else{
			return res.json(400,{code:3,msg: 'Error creating the test, there is no title', msgES:"Título de la prueba no envíado"});
		}
		if(req.body.test.description){
			var description=req.body.test.description;
		}else{
			var description=null;
		}
		if(req.body.test.createdBy){
			var createdBy=req.body.test.createdBy;
		}else{
			return res.json(400,{code:4,msg: 'Error creating the test, there is no owner', msgES:"Propietario de la prueba no existe"});
		}
		if(req.body.test.status){
			var status=req.body.test.status;
		}else{
			var status=null;
		}
		if(req.body.test.startDateTime){
			var startDateTime=req.body.test.startDateTime;
		}else{
			return res.json(400,{code:5,msg: 'Error creating the test, there should be an start date-time', msgES:"Fecha y hora de inicio no envíados"});
		}
		if(req.body.test.finishDateTime){
			var finishDateTime=req.body.test.finishDateTime;
		}else{
			return res.json(400,{code:6,msg: 'Error creating the test, there should be an finish date-time', msgES:"Fecha y hora de finalización no envíados"});
		}
		if(req.body.test.course){
			var idCourse=req.body.test.course;
		}else{
			return res.json(400,{code:7,msg: 'Error creating the test, there should be a course', msgES:"Curso de la prueba no envíado"});
		}

		if(finishDateTime<=startDateTime){
			return res.json(400,{code:8,msg: 'Error creating the test, the finishDateTime cannot be earlier than the startDateTime', msgES:"La fecha y hora de finalización no puede ser antes de la fecha y hora de inicio"});

		}
		//return res.json(201,{msg: 'Test created'});
		var errorCheckingTest=sails.controllers.test.checkTestData(req);
		if(errorCheckingTest.error==true){
			return res.json(400, {msg:"Error creating the test, wrong test format send", msgES:"Formato de la prueba incorrecto"});
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
					return res.json(500, {msg:"Error updating the test"});
				}
			})
		})
		.catch(function(error){
			return res.json(500, {msg:"Error updating the test, wrong test format send", msgES:"Formato de la prueba incorrecto"});
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
				return res.json(200, {msg:"Test successfully updated", msgES:"Prueba actualizada"});
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

	/**
	* @memberof module:Test
	* @function registerTakenTest
	* @param  {JSON} req HTTP request object
	* @param  {JSON} req.body.test Taken test to be register
	* @param  {string} req.body.test.id Id
	* @param  {JSON[]} req.body.test.questions Question with the options selected
	* @param  {JSON} req.body.user User taking the test
	* @param  {string} req.body.user.email Email
	* @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
	* @description Register the taken test by the student
	*/
	registerTakenTest:function(req,res){

		if(req.body.test){
			var test=req.body.test;
			if(!test.id){
				return res.json(400,{code:2,msg: 'Error registering the taken test data, there is no test id'});
			}
		}else{
			return res.json(400,{code:1,msg: 'Error registering the taken test data, there is no test data'});
		}

		if(req.body.user){
			var user=req.body.user;
			if(!user.email){
				return res.json(400,{code:4,msg: 'Error registering the taken test data, there is no user email'});
			}
		}else{
			return res.json(400,{code:3,msg: 'Error registering the taken test data, there is no user data'});
		}

		if(!test.questions){
			return res.json(400,{code:5,msg: 'Error registering the taken test data, there is no question data'});
		}else{
			var allPromises=[];
			console.log("linea 1097");
			var totalWeighing=0;
			var parcialScore=0;
			for(var i=0;i<test.questions.length;i++){
				if(!test.questions[i].weighing){
					var weighing=1;
				}else{
					var weighing=test.questions[i].weighing;
				}
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
				if(finded.intentLeft==0){
					return res.json(400,{code:6,msg: 'Error registering the taken test data, you exceed the intents for the test'});
				}
				/*If the new score is higher than the older one or if this is the first try*/
				if(finded.score<=score ){
					var innerPromises=[];
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
									.then(function(){
										return "ok";
									})
									.catch(function(error){
										return error;
									})
									innerPromises.push(insertPromise);
								}
							}
						}
						var innerPromise=Promise.all(innerPromises)
						.then(function(){
							return "ok";
						})
						.catch(function(error){
							return error;
						})
						return innerPromise;
					})
					.catch(function(error){
						return error;
					})
					allPromises.push(promise);

					/*Update the student-test record*/
					console.log("Score:"+score);
					var updateTestPromise=sails.models.usrtes.update({email:user.email, idTest:test.id, status:"s"},{score:score,intentLeft:finded.intentLeft-1})
					.then(function(){
						/*Find all the records of the students-test to calculate the new average score of the test*/
						var innerPromise=sails.models.usrtes.find({idTest:test.id, status:"s", score:{not:null}})
						.then(function(finded){
							var averageScore=0;
							for(var i=0;i<finded.length;i++){
								averageScore=averageScore+finded[i].score;
							}
							averageScore=averageScore/finded.length;
							var innerPromise2=sails.models.test.update({id:test.id},{averageScore:averageScore});
							return innerPromise2;
						})
						.catch(function(error){
							console.log(error);
							return error;
						})
						return innerPromise;
					})
					.catch(function(error){
						console.log(error);
						return error;
					})
					allPromises.push(updateTestPromise);
				}else{
					/*Score lower than before*/
					console.log("nota inferior")
					var promise=sails.models.usrtes.update({email:user.email, idTest:test.id, status:"s"},{intentLeft:finded.intentLeft-1});
					allPromises.push(promise);
				}
				Promise.all(allPromises)
				.then(function(){
					return res.json(200,{msg: 'OK', score:score});
				})
				.catch(function(error){
					console.log(error);
					return res.json(500,{msg:'Error registering the taken test data'});
				})
			})
			.catch(function(error){
				console.log(error);
				return res.json(500,{msg:'Error registering the taken test data'});
			})

		}



	},

	/**
	* @memberof module:Test
	* @function createCloneTest
	* @param  {JSON[]} mappedTests List of the tests mapped (oldTest, newTest)
	* @param  {JSON} oldTest Test that will be used to create the new one
	* @param  {int} courseId Id of the course
	* @returns  {promise} promise of the create action
	* @description Created a test with the information of an old one
	*/
	createCloneTest:function(mappedTests, oldTest, courseId){
		var createTestPromise=sails.models.test.create({idCourse:courseId, title:oldTest.title, description:oldTest.description, createdBy:oldTest.createdBy, status:oldTest.status, startDateTime:oldTest.startDateTime, finishDateTime:oldTest.finishDateTime, averageScore:0,intents:oldTest.intents})
		.then(function(testCreated){
			mappedTests.push({oldTest:oldTest, newTest:testCreated});
		})
		return createTestPromise;
	},


};
