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

	registrarUsuPru2: function (req, res) {
		var email=req.body.email;
		var password=req.body.password;
		var idPrueba=req.body.idprueba;
		var creadoPor=req.body.creador;

		console.log(email);
		console.log(password);
		sails.models.prueba.findOne(idPrueba).exec(function(error, pruebaEncontrada){
			if(error){
				console.log("error aqui");
				console.log(error);
			}else{
				sails.models.usuario.findOne(email).populate('pruebas').exec(function(error, usuarioEncontrado){
					if(error){
						console.log(error);
					}else{

						console.log("LLegamos hasta aca")
						usuarioEncontrado.pruebas.add(idPrueba);
						console.log("Llegamos al fin")
						usuarioEncontrado.save(function(err){});
					}
				})
			}
		})
	},
	registrarUsuPru: function (req, res) {
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
