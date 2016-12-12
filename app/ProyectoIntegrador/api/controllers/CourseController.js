/**
* CourseController
*
* @description :: Server-side logic for managing courses
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/
var Promise = require("bluebird");
module.exports = {
	register:function(req, res){
		if(req.body.user.email){
			var email=req.body.user.email;
		}else{
			var email=null;
			return res.json(400, {msg:"No user's email send"});
		}
		if(req.body.user.role){
			var role=req.body.user.role;
			var correctRole=false;
			if(role=="teacher"){
				var status="t";
				correctRole=true;
			}
			if(correctRole==false){
				return res.json(400, {msg:"Invalid role"});
			}
		}else{
			var role=null;
			return res.json(400, {msg:"Invalid role"});
		}
		if(req.body.course.name){
			var name=req.body.course.name;
		}else{
			var name=null;
			return res.json(400, {msg:"No course's name send"});
		}

		if(req.body.course.description){
			var description=req.body.course.description;
		}else{
			var description=null;
		}

		sails.models.course.create({
			name:name,
			description:description,
			createdBy:email
		})
		.exec(function(error, newRecord){
			if(error){
				console.log(error);
				return res.json(512, {msg:"Error creating the course"});
			}else{
				sails.models.usrcou.query(
					'INSERT INTO USR_COU (EMAIL, IDCOURSE, STATUSUSRCOU) VALUES (?,?,?)',[email, newRecord.id, status], function(err, results) {
						if (err){
							console.log("Estamos aqui en ERR");
							return res.json(512,{msg:"Error creating the course"});
						}else{
							console.log("Estamos en 201");
							return res.json(201,{msg:"Course created"});
						}
					});
				}
			});


		},


		getCoursesCreatedByUser:function(req,res){
			if(req.body.user.email){
				var email=req.body.user.email;
				var status="c";
				sails.models.usrcou.query('SELECT C.NAMECOURSE, C.IDCOURSE FROM USR_COU U, COURSE C WHERE U.STATUSUSRCOU=? AND U.EMAIL=? AND C.IDCOURSE=U.IDCOURSE',[status, email], function(err, results) {
					if (err){
						console.log("Estamos aqui en ERR");
						return res.json(512,{msg:"error en la query"});
					}else{
						console.log("Estamos en 201");
						return res.json(201,{msg:"OK", courses:results});
					}
				});
			}else{
				return res.json(400,{msg:"Not email send"});
			}
		},

		getCoursesByTeacher:function(req,res){
			if(req.body.user.email){
				var email=req.body.user.email;
				var status="t";
				sails.models.usrcou.query('SELECT C.NAMECOURSE,C.DESCRIPTIONCOURSE, C.IDCOURSE FROM USR_COU U, COURSE C WHERE U.STATUSUSRCOU=? AND U.EMAIL=? AND C.IDCOURSE=U.IDCOURSE',[status, email], function(err, results) {
					if (err){
						console.log("Estamos aqui en ERR");
						return res.json(512,{msg:"error en la query"});
					}else{
						console.log("Estamos en 201");
						return res.json(201,{msg:"OK", courses:results});
					}
				});
			}else{
				return res.json(400,{msg:"Not email send"});
			}
		},
		getCoursesByStudent:function(req,res){
			if(req.body.user.email){
				var email=req.body.user.email;
				var status="s";
				sails.models.usrcou.query('SELECT C.NAMECOURSE,C.DESCRIPTIONCOURSE, C.IDCOURSE FROM USR_COU U, COURSE C WHERE U.STATUSUSRCOU=? AND U.EMAIL=? AND C.IDCOURSE=U.IDCOURSE',[status, email], function(err, results) {
					if (err){
						console.log("Estamos aqui en ERR");
						return res.json(512,{msg:"error en la query"});
					}else{
						console.log("Estamos en 201");
						return res.json(201,{msg:"OK", courses:results});
					}
				});
			}else{
				return res.json(400,{msg:"Not email send"});
			}

		},

		registerStudent:function(req,res){

			if(req.body.student.email){
				var studentEmail=req.body.student.email;
			}else{
				var studentEmail=null;
				return res.json(400,{msg:"There is not a student's email send"});
			}
			if(req.body.course.id){
				var idCourse=req.body.course.id;
			}else{
				var idCourse=null;
				return res.json(400,{msg:"There is not a course's id send"});
			}

			if(req.body.user.email){
				var userEmail=req.body.user.email;
			}else{
				var idCourse=null;
				return res.json(400,{msg:"There is not a user's email send"});
			}
			if(userEmail==studentEmail){
				return res.json(400,{msg:"The teacher cannot be an student of the same course"});
			}
			/*Compruebo si el profesor es el dueno del curso*/
			sails.models.usrcou.findOne({email:userEmail, status:'t', idCourse:idCourse}).exec(function(err, teacher){
				if(err){
					console.log(err);
					return res.json(500,{msg:"Error"});
				}else{
					if(teacher){
						/*Compruebo si existe un estudiante con el email a registrar*/
						sails.models.user.query("SELECT * FROM USR_ROL WHERE EMAIL=? AND NAME='student' ",[studentEmail], function (error, results){
							if(error){
								console.log(error);
								return res.json(500,{msg:"Error registering the student"});
							}else{
								if(results[0]){
									console.log(results[0]);
									/*Registro al estudiante en el curso*/
									sails.models.usrcou.create({email:studentEmail, idCourse:idCourse, status:'s'}).exec(function(err, recordCreated){
										if(err){
											console.log(err);
											return res.json(500,{msg:"Error registering the student"});
										}else{
											/*Asignacion de las pruebas del curso al cual acaba de ser registrado el estudiante*/
											sails.models.usrtes.query("INSERT INTO USR_TES (EMAIL, IDTEST, STATUSUSRTES) SELECT ?, T.IDTEST, 's' FROM TEST T WHERE T.IDCOURSE=? ",[studentEmail, idCourse], function(error, callback){
												if(error){
													console.log(error);
													return res.json(512,{msg: 'Error registering the student'});
												}else{
													return res.json(200,{msg:"Student registered"});
												}
											});
										}
									});
								}else{
									return res.json(400,{msg:"There is not an student with that email"});
								}
							}
						});
					}else{
						return res.json(400,{msg:"The user is not the owner of the course"});
					}
				}
			});
		},

		deleteCourse:function(req,res){
			if(req.body.user.email){
				var email=req.body.user.email;
			}else{
				return res.json(400,{msg:"No email send"});
			}
			if(req.body.course.id){
				var courseId=req.body.course.id;
			}else{
				return res.json(400,{msg:"No course send"});
			}
			sails.models.usrcou.findOne({email:email, status:'t', idCourse:courseId}).exec(function(err, teacher){
				if(err){
					return res.json(500,{msg:"Error deleting the course"});
				}else{
					if(teacher){
						sails.models.course.destroy({id:courseId}).exec(function(err){
							if(err){
								return res.json(500,{msg:"Error deleting the course"});
							}else{
								return res.json(200,{msg:"Course deleted"});
							}
						});
					}else{
						return res.json(400,{msg:"The user is not the owner of the course"});
					}
				}
			});
		},

		getCourseById:function(req,res){
			if(req.body.user.email){
				var email=req.body.user.email;
			}else{
				return res.json(400,{msg:"No email send"});
			}
			if(req.body.course.id){
				var courseId=req.body.course.id;
			}else{
				return res.json(400,{msg:"No course send"});
			}
			sails.models.usrcou.findOne({email:email, status:'t', idCourse:courseId}).exec(function(err, teacher){
				if(err){
					return res.json(500,{msg:"Error"});
				}else{
					if(teacher){
						sails.models.course.findOne({id:courseId}).exec(function(err, courseFinded){
							if(err){
								return res.json(500,{msg:"Error"});
							}else{
								return res.json(200,{msg:"OK",course:courseFinded});
							}
						});
					}else{
						return res.json(400,{msg:"The user is not the owner of the course"});
					}
				}
			});

		},

		editCourse:function(req,res){
			if(req.body.user.email){
				var email=req.body.user.email;
			}else{
				return res.json(400,{msg:"No email send"});
			}
			if(req.body.course.id){
				var courseId=req.body.course.id;
			}else{
				return res.json(400,{msg:"No course send"});
			}

			if(req.body.course.name){
				var courseName=req.body.course.name;
			}else{
				return res.json(400,{msg:"No course's name send"});
			}

			if(req.body.course.description){
				var courseDescription=req.body.course.description;
			}else{
				var courseDescription=null;
			}
			sails.models.usrcou.findOne({email:email, status:'t', idCourse:courseId}).exec(function(err, teacher){
				if(err){
					return res.json(500,{msg:"Error"});
				}else{
					if(teacher){
						sails.models.course.update({id:courseId},{name:courseName,description:courseDescription}).exec(function(err, courseUpdated){
							if(err){
								return res.json(500,{msg:"Error"});
							}else{
								return res.json(200,{msg:"Course updated"});
							}
						});
					}else{
						return res.json(400,{msg:"The user is not the owner of the course"});
					}
				}
			});

		},

		clone:function(req,res){
			if(!req.body.user){
				return res.json(400,{msg:"Error cloning the course, no user send"});
			}
			if(!req.body.course){
				return res.json(400,{msg:"Error cloning the course, no course send"});
			}
			if(req.body.course.id){
				var courseId=req.body.course.id;
			}else{
				return res.json(400,{msg:"Error cloning the course, no course id send"});
			}
			if(req.body.user.email){
				var email=req.body.user.email;
			}else{
				return res.json(400,{msg:"Error cloning the course, no email send"});
			}
			/*Check if the user is the owner of the course to be cloned*/
			sails.models.usrcou.findOne({email:email, idCourse:courseId, status:"t"})
			.then(function(finded){
				if(finded){
					/*retrieved course data*/
					sails.models.course.findOne({idCourse:courseId})
					.then(function(courseFinded){
						/*Create the new course*/
						sails.models.course.create({description:courseFinded.description, name:courseFinded.name, createdBy:courseFinded.createdBy})
						.then(function(courseCreated){
							sails.models.usrcou.create({email:email, idCourse:courseCreated.id, status:'t'})
							.catch(function(error){
								console.log(error);
								return res.json(500,{msg:"Error cloning the course"});
							})
							var queryPromisified=Promise.promisify(sails.models.test.query);
							/*Create all the test of the old course on the new one*/
							var createTestsPromise=queryPromisified("INSERT INTO TEST (IDCOURSE, TITLE, DESCRIPTIONTEST, CREATEDBYTEST, STATUS, STARTDATETIME, FINISHDATETIME, AVERAGESCORE, INTENTS) SELECT ?, TITLE, DESCRIPTIONTEST, CREATEDBYTEST, STATUS, STARTDATETIME, FINISHDATETIME, 0, INTENTS FROM TEST WHERE IDCOURSE = ?",[courseCreated.id,courseId])
							.then(function(){
								sails.models.test.find({idCourse:courseCreated.id})
								.then(function(tests){
									var questionsPromises=[];
									for(var i=0;i<tests.length;i++){
										/*Create all the questions of the old tests on the new ones*/
										var createQuestionPromise=queryPromisified("INSERT INTO QUESTION (IDTEST, TYPEQUESTION, TEXTQUESTION, WEIGHT) SELECT  ?, Q.TYPEQUESTION, Q.TEXTQUESTION, Q.WEIGHT FROM COURSE C, TEST T, QUESTION Q WHERE Q.IDTEST=T.IDTEST AND T.IDCOURSE=C.IDCOURSE AND C.IDCOURSE=?",[tests[i].id,courseId])
										questionsPromises.push(createQuestionPromise);
									}
									Promise.all(questionsPromises)
									.then(function(){
										/*Create all the options of the old questions in the new ones*/
										var newQuestions=[];
										console.log(courseCreated.id);
										var getNewQuestionsPromise=queryPromisified("SELECT Q.IDQUESTION AS id, Q.TEXTQUESTION AS text FROM QUESTION Q, TEST T, COURSE C WHERE Q.IDTEST=T.IDTEST AND T.IDCOURSE=C.IDCOURSE AND C.IDCOURSE=?",[courseCreated.id	])
										.then(function(questions){
											newQuestions=questions;
											var optionsPromises=[];
											console.log(newQuestions);
											for(var i=0; i<newQuestions.length;i++){
												var createOptionPromise=queryPromisified("INSERT INTO OPTIO (IDQUESTION, JUSTIFICATION, ISCORRECT, TEXTOPTION) SELECT  ?, O.JUSTIFICATION, O.ISCORRECT, O.TEXTOPTION  FROM COURSE C, TEST T, QUESTION Q, OPTIO O WHERE O.IDQUESTION=Q.IDQUESTION AND Q.IDTEST=T.IDTEST AND T.IDCOURSE=C.IDCOURSE AND C.IDCOURSE=? AND Q.TEXTQUESTION=?",[newQuestions[i].id,courseId, newQuestions[i].text])
												optionsPromises.push(createOptionPromise);
											}
											Promise.all(optionsPromises)
											.then(function(){
												return res.json(200,{msg:"Course cloned"});
											})
											.catch(function(error){
												console.log(error);
												return res.json(505,{msg:"Error cloning the course"});
											})
										})
										.catch(function(error){
											console.log(error);
											return res.json(504,{msg:"Error cloning the course"});
										})

									})
									.catch(function(error){
										console.log("error");
										return res.json(503,{msg:"Error cloning the course"});
									})
								})
								.catch(function(error){
									console.log(error);
									return res.json(502,{msg:"Error cloning the course"});
								})

								return null;
							})
							.catch(function(error){
								return res.json(400,{msg:"Error cloning the course, no email send"});
							})
						})
						.catch(function(error){
							return res.json(501,{msg:"Error cloning the course"});
						})

					})
					.catch(function(error){

						return res.json(500,{msg:"Error cloning the course"});
					})

				}else{
					return res.json(400,{msg:"Error cloning the course, the user is not the owner of the course"});
				}
			})
			.catch(function(error){
				return res.json(500,{msg:"Error cloning the course"});
			})
		},

	};
