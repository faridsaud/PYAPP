/**
* PruebaController
*
* @description :: Server-side logic for managing pruebas
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

var Promise = require("bluebird");
module.exports = {
	/*Testing promises*/
/*
	testPromises:function(req,res){


		var promiseUC=sails.models.user.create({email:"faridsaud@yahoo.com"});
		var promiseUC2=sails.models.user.create({email:"faridsaud2@yahoo.com"});
		Promise.join(promiseUC, promiseUC2, function (userCreated1, userCreated2){
			console.log(userCreated1);
			console.log(userCreated2);
		})
		.then(function(){
			console.log("No hubo error");
			return res.ok()
		})
		.catch(function(error){
			console.log(error);
			return res.serverError()
		});
		console.log("Estamos al final");
	}
	*/
	testPromises:function(req,res){

		var userQueryAsyn= Promise.promisify(sails.models.user.query);
		var promiseUC=userQueryAsyn("INSERT INTO USER (EMAIL) VALUES ('faridsaud@yahoo.com')");
		var promiseUC2=userQueryAsyn("INSERT INTO USER (EMAIL) VALUES ('faridsaud2@yahoo.com')");
		Promise.join(promiseUC, promiseUC2, function (userCreated1, userCreated2){
			console.log(userCreated1);
			console.log(userCreated2);
		})
		.then(function(){
			console.log("No hubo error");
			return res.ok()
		})
		.catch(function(error){
			console.log(error);
			return res.serverError()
		});
		console.log("Estamos al final");
	},
	testPromises2:function(req,res){

		var userQueryAsyn= Promise.promisify(sails.models.user.query);
		var promiseUC=userQueryAsyn("SELECT * FROM USER WHERE EMAIL='faridsaud@yahoo.com'");
		var promiseUC2=userQueryAsyn("SELECT * FROM USER WHERE EMAIL='faridsaud2@yahoo.com'");
		Promise.join(promiseUC, promiseUC2, function (userCreated1, userCreated2){
			console.log(userCreated1);
			console.log(userCreated2);
		})
		.then(function(){
			console.log("No hubo error");
			return res.ok()
		})
		.catch(function(error){
			console.log(error);
			return res.serverError()
		});
		console.log("Estamos al final");
	},

		testPromises3:function(req,res){

			var promises=[];
			var promiseUC=sails.models.user.create({email:"faridsaud@yahoo.com"});
			var promiseUC2=sails.models.user.create({email:"faridsaud2@yahoo.com"});
			promises.push(promiseUC);
			promises.push(promiseUC2);
			Promise.all(promiseUC, promiseUC2, function (userCreated1, userCreated2){
				console.log(userCreated1);
				console.log(userCreated2);
			})
			.then(function(){
				console.log("No hubo error");
				return res.ok()
			})
			.catch(function(error){
				console.log(error);
				return res.serverError()
			});
			console.log("Estamos al final");
		}
};
