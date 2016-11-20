/**
* CourseController
*
* @description :: Server-side logic for managing courses
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

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
		}).exec(function(error, newRecord){
			if(error){
				console.log(error);
				console.log("Estamos aqui en ERRROR");
				return res.json(512, {msg:error});
			}else{
				sails.models.usrcou.query(
					'INSERT INTO USR_COU (EMAIL, IDCOURSE, STATUSUSRCOU) VALUES (?,?,?)',
					[email, newRecord.id, status]
					, function(err, results) {
						if (err){
							console.log("Estamos aqui en ERR");
							return res.json(512,{msg:error});
						}else{
							console.log("Estamos en 201");
							return res.json(201,{msg:"Course created"});
						}
					});
				}
			})


		},


		getCoursesCreatedByUser:function(req,res){
			if(req.body.user.email){
				var email=req.body.user.email;
				var status="t";
				sails.models.usrcou.query(
					'SELECT C.NAMECOURSE, C.IDCOURSE FROM USR_COU U, COURSE C WHERE U.STATUSUSRCOU=? AND U.EMAIL=? AND C.IDCOURSE=U.IDCOURSE',
					[status, email]
					, function(err, results) {
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
				sails.models.usrcou.findOne({email:userEmail, status:'t'}).exec(function(err, user){
					if(err){
						console.log(err);
						return res.json(500,{msg:"Error"});
					}else{
						if(user){
							sails.models.usrcou.create({email:studentEmail, idCourse:idCourse, status:'s'}).exec(function(err, recordCreated){
								if(err){
									console.log(err);
									return res.json(500,{msg:"Error registering the student"});
								}else{
									return res.json(200,{msg:"Student registered"});
								}
							});
						}else{
							return res.json(400,{msg:"The user is not the owner of the course"});
						}
					}
				});
			},

		};
