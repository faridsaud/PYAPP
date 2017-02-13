/**
* SecurityQuestionController
* @module {Controller} SecurityQuestion
* @author Farid Saud Rolleri
* @description :: Server-side logic for managing security questions
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/
module.exports = {
  /**
  * @memberof module:SecurityQuestion
  * @function registerQuestions
  * @param  {string} email Email of the user
  * @param  {int} idSecurityQuestion Id of the security question
  * @param  {string} answerText Text for the answer given by the user
  * @returns  {promise} Promise of the create action
  * @description Register the security question and the answer given by the user
  */
  registerQuestions:function(email, idSecurityQuestion, answerText){
    var createPromise=sails.models.usrsqu.create({email:email, idSQuestion:idSecurityQuestion,answerText:answerText});
  },

  /**
  * @memberof module:SecurityQuestion
  * @function getAll
  * @param  {JSON} req HTTP request objec
  * @param  {JSON} res HTTP response object
  * @returns  {JSON} HTTP response object
  * @description Get all the security questions available
  */
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
