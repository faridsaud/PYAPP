/**
* TestController
*
* @description :: Server-side logic for managing tests
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

module.exports = {



	/**
	* `TestController.insertar()`
	*/
	register: function (req, res) {
		if(req.body.test.title){
			var title=req.body.test.title;
		}else{
			var title=null;
		}
		if(req.body.test.description){
			var description=req.body.test.description;
		}else{
			var description=null;
		}
		if(req.body.test.createdBy){
			var createdBy=req.body.test.createdBy;
		}else{
			var createdBy=null;
		}
		if(req.body.test.status){
			var status=req.body.test.status;
		}else{
			var status=null;
		}
		if(req.body.test.startDateTime){
			var startDateTime=req.body.test.startDateTime;
		}else{
			var startDateTime=null;
		}
		if(req.body.test.finishDateTime){
			var finishDateTime=req.body.test.finishDateTime;
		}else{
			var finishDateTime=null;
		}
		if(req.body.test.course){
			var idCourse=req.body.test.course;
		}else{
			var idCourse=null;
		}
		sails.models.test.create({
			title:title,
			description:description,
			createdBy:createdBy,
			status:"c",
			startDateTime:startDateTime,
			finishDateTime:finishDateTime,
			averageScore:0.0,
			idCourse:idCourse
		}).exec(function (error, newTest){
			if(error){
				console.log(error);
				return res.json(512, {msg:"Error creating the test"});
			}else{
				sails.models.usrtes.query(
					'INSERT INTO USR_TES (EMAIL, IDTEST, STATUSUSRTES) VALUES (?,?,?)',
					[createdBy, newTest.id, 't' ]
					, function(err, results) {
						if (err){
							console.log(err);
							return res.json(512, {msg:"Error creating the test"});
						}else{
							sails.models.usrtes.query("INSERT INTO USR_TES (EMAIL, IDTEST, STATUSUSRTES) SELECT U.EMAIL, ?, 's' FROM USER U, USR_COU UC WHERE U.EMAIL=UC.EMAIL AND UC.IDCOURSE=? AND U.EMAIL!=?",[newTest.id, idCourse, createdBy], function(error, callback){
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
					var patt = new RegExp("^\d{1,1}$");
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
					var patt = new RegExp("^\d{1,1}$");
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
					var patt = new RegExp("^\d{1,1}$");
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
			sails.models.test.query(
				'SELECT T.TITLE AS title, T.STARTDATETIME AS startDateTime, T.FINISHDATETIME AS finishDateTime, T.IDTEST AS id, T.STATUS AS status FROM TEST T, USR_TES UT WHERE UT.EMAIL=? AND UT.IDTEST=T.IDTEST AND T.CREATEDBYTEST!=UT.EMAIL',
				[email]
				, function(err, results) {
					if (err){
						console.log(err);
						return res.json(512,{msg:"Error"});
					}else{
						var tests=sails.controllers.test.checkStatus(results);
						return res.json(200,{msg:"OK", tests:tests});
					}
				});
			}


		};
