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
			description:description
		}).exec(function(error, newRecord){
			if(error){
				console.log(error);
				console.log("Estamos aqui en ERRROR");
				return res.json(512, {msg:error});
			}else{
				sails.models.usrrol.query(
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


		}
	};
