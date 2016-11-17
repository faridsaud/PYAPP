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
		}

	};
