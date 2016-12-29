/**
* SecurityQuestionController
*
* @description :: Server-side logic for managing roles
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

module.exports = {
  registerQuestions:function(email, idSecurityQuestion, answerText){
    var createPromise=sails.models.usrsqu.create({email:email, idSQuestion:idSecurityQuestion,answerText:answerText});
  },
  getAll:function(req,res){
    sails.models.securityquestion.find().then(
      function(finded){
          return res.json(200,{msg: 'OK',securityQuestions:finded});
      }
    )
    .catch(function(error){
      console.log(error);
      return res.json(500,{msg: 'Error getting the security questions'});
    })
  },

};
