/**
* Role.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'ROLE',

  attributes: {
    name:{
      type:'string',
      primaryKey: true,
      size:10,
      unique: true,
      columnName: 'NAME'
    }
  }
};
