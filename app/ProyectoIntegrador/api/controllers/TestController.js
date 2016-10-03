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
	registrar: function (req, res) {
		var email=req.body.email;
		var password=req.body.password;
		console.log(email);
		console.log(password);
		sails.models.test.create({id:email,clave:password}).exec(function (error, newRecord){
			if(error){
				console.log(error);
			}else{

				return res.json({
					msg: 'todo bien'
				});
			}
		});
	},

/*
	registrarUsuPru: function (req, res) {
		var email=req.body.email;
		var password=req.body.password;
		var idPrueba=req.body.idprueba;
		var creadoPor=req.body.creador;

		console.log(email);
		console.log(password);
		Usuario.findOne(email).exec(function(err, user) {
			if(err){
				res.serverError(err);
			} // handle error

			// Queue up a record to be inserted into the join table
			user.pruebas.add(idPrueba);

			// Save the user, creating the new associations in the join table
			user.save(function(err) {});
		});
	},*/
	registrarUsuPru:function(req,res){
		User.findOne('1').exec(function(err, user) {
			if(err){
				res.serverError(err);
			} // handle error

			console.log(user.pruebas);
			var tests;
			console.log(user.testToDo(function (tests){
				console.log(tests);
				user.tests=tests;
				res.json(user);
			}));
		});

	},
	registrarUsuPru2: function (req, res) {
		var email=req.body.email;
		var password=req.body.password;
		var idPrueba=req.body.idprueba;
		var creadoPor=req.body.creador;
		sails.models.usrpru.query(
			'INSERT INTO USR_PRU (IDPRUEBA, EMAIL) VALUES (?,?)',
			[ idPrueba, email ]
			, function(err, results) {
				if (err) return res.serverError(err);
				return res.json(results);
			});
		}
	};
