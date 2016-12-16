/**
* Usrtes.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName:'USR_SQU',
  autoPK: false,


  attributes: {
    email:{
      type:'string',
      columnName:'EMAIL',
      primaryKey:true
    },
    idSecurityQuestion: {
      type:'integer',
      columnName:'IDSECURITYQUESTION',
      primaryKey:true
    },
    answerText:{
      type:'string',
      columnName:'ANSWERSELECTED'
    }
  }
};
