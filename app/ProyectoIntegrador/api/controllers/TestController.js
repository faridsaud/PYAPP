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
	}
};
