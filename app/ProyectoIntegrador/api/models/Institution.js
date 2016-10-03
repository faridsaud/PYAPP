/**
* Institution.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'INSTITUTION',

  attributes: {
    id:{
      type:'integer',
      primaryKey: true,
      unique: true,
      columnName: 'IDCOURSE'
    },
    name:{
      type:'string',
      size:30,
      columnName: 'NAMEINSTITUTION'
    },
    createdBy:{
      type:'string',
      size:40,
      columnName: 'CREATEDBYINSTITUTION'
    }
  }
};
