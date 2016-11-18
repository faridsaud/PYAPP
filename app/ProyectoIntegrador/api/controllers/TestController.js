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
			var startDateTime=new Date(Date.parse(req.body.test.startDateTime));
			var startDateTimeUTC = new Date(startDateTime.getUTCFullYear(), startDateTime.getUTCMonth(), startDateTime.getUTCDate(),  startDateTime.getUTCHours(), startDateTime.getUTCMinutes(), startDateTime.getUTCSeconds());
		}else{
			var startDateTime=null;
		}
		if(req.body.test.finishDateTime){
			var finishDateTime=new Date(Date.parse(req.body.test.finishDateTime));
			var finishDateTimeUTC = new Date(finishDateTime.getUTCFullYear(), finishDateTime.getUTCMonth(), finishDateTime.getUTCDate(),  finishDateTime.getUTCHours(), finishDateTime.getUTCMinutes(), finishDateTime.getUTCSeconds());
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
			startDateTime:startDateTimeUTC,
			finishDateTime:finishDateTimeUTC,
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
			var actualDateUTC = new Date(Date.UTC(actualDate.getUTCFullYear(), actualDate.getUTCMonth(), actualDate.getUTCDate(),  actualDate.getUTCHours(), actualDate.getUTCMinutes(), actualDate.getUTCSeconds()));
			console.log("fecha actual");
			console.log(actualDate);
			console.log("fecha actual UTC");
			console.log(actualDateUTC);
			console.log("pruebas antes del parse");
			console.log(tests);
			sails.controllers.test.parseDatesOfTests(tests);
			console.log("pruebas antes de la verificacion");
			console.log(tests);
			for(var i=0;i<tests.length;i++){
			  if(tests[i].FINISHDATETIME<actualDateUTC){
			    sails.models.test.update({id:tests[i].id},{status:"f"}).exec(function(error, updated){
			      if(error){
			        console.log(error);
			      }
			    });
			    tests[i].status="f"
			  }
			  if((tests[i].FINISHDATETIME>actualDateUTC)&&(tests[i].STARTDATETIME<actualDateUTC)){
			    sails.models.test.update({id:tests[i].id},{status:"e"}).exec(function(error, updated){
			      if(error){
			        console.log(error);
			      }
			    });
			    tests[i].status="e"
			  }
			}
			console.log("Pruebas despues de la verificacion");
			console.log(tests);
			return tests;
		},

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
		}


	};
