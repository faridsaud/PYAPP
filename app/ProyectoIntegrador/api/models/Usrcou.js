/**
* Usrcou.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName:'USR_COU',
  autoPK: false,


  attributes: {
    email:{
      type:'string',
      columnName:'EMAIL'
    },
    idCourse: {
      type:'integer',
      columnName:'IDTEST'
    },
    status:{
      type:'string',
      columnName:'STATUSUSRCOU',
      size:1
    }
  }
};
