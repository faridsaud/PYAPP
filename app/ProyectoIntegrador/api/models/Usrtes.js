/**
* Usrtes.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName:'USR_TES',
  autoPK: false,


  attributes: {
    email:{
      type:'string',
      columnName:'EMAIL',
      primaryKey:true
    },
    idTest: {
      type:'integer',
      columnName:'IDTEST',
      primaryKey:true
    },
    status:{
      type:'string',
      columnName:'STATUSUSRTES',
      size:1,
      primaryKey:true
    },
    score:{
      type:'float',
      columnName: 'SCORE'
    },
    intentLeft: {
      type:'integer',
      columnName:'INTENTLEFT'
    }
  }
};
