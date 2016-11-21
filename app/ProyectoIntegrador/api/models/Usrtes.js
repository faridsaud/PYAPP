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
      columnName:'EMAIL'
    },
    idTest: {
        type:'integer',
        columnName:'IDTEST'
    },
    status:{
      type:'string',
      columnName:'STATUSUSRTES',
      size:1
    },
    score:{
      type:'float',
      columnName: 'SCORE'
    }
  }
};
