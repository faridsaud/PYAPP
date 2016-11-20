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
		}).exec(function (error, newRecord){
			if(error){
				console.log(error);
				return res.json(512, {msg:error})
			}else{
				console.log("Datos a alamcenarse");
				console.log(createdBy);
				console.log(newRecord);
				sails.models.usrtes.query(
					'INSERT INTO USR_TES (EMAIL, IDTEST) VALUES (?,?)',
					[createdBy, newRecord.id ]
					, function(err, results) {
						if (err){
							console.log(err);
							return res.json(512, {msg:err});
						}else{
							return res.json(201,{
								msg: 'Test created'
							});
						}
					});
				}
			})
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
/*
		parseMysqlDateToJSDate:function(mysqlDate){
			var JSDate=new Date(Date.parse(mysqlDate.toString().replace('-','/','g')));
			return JSDate;
		},

		parseDatesOfTests:function(tests){
			for(var i=0;i<tests.length;i++){
				tests[i].startDateTime=sails.controllers.test.parseMysqlDateToJSDate(tests[i].startDateTime);
				tests[i].finishDateTime=sails.controllers.test.parseMysqlDateToJSDate(tests[i].finishDateTime);
			}
			sails.controllers.test.createUTCDates(tests);
			return tests
		},

		createUTCDates:function(tests){
			for(var i=0;i<tests.length;i++){
				tests[i].startDateTime=new Date(Date.UTC(tests[i].startDateTime.getFullYear(), tests[i].startDateTime.getMonth(), tests[i].startDateTime.getDay(),tests[i].startDateTime.getHours(), tests[i].startDateTime.getMinutes(), tests[i].startDateTime.getSeconds()));
				tests[i].finishDateTime=new Date(Date.UTC(tests[i].finishDateTime.getFullYear(), tests[i].finishDateTime.getMonth(), tests[i].finishDateTime.getDay(),tests[i].finishDateTime.getHours(), tests[i].finishDateTime.getMinutes(), tests[i].finishDateTime.getSeconds()));
			}
			return tests;
		},
*/

		getTestsByCourse:function(req, res){
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
