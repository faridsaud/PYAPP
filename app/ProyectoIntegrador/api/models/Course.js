/**
* Course.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName:'COURSE',

  attributes: {
    id:{
      type:'integer',
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      columnName: 'IDCOURSE'
    },
    description:{
      type:'text',
      size:300,
      columnName: 'DESCRIPTIONCOURSE'
    },
    name:{
      type:'string',
      size:40,
      columnName: 'NAMECOURSE'
    }
  }
};
