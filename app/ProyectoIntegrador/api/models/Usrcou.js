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
      columnName:'EMAIL',
      primaryKey:true
    },
    idCourse: {
      type:'integer',
      columnName:'IDCOURSE',
      primaryKey:true
    },
    status:{
      type:'string',
      columnName:'STATUSUSRCOU',
      primaryKey:true,
      size:1
    }
  }
};
