/**
* Question.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'QUESTION',

  attributes: {
    id:{
      type:'integer',
      primaryKey: true,
      unique: true,
      columnName: 'IDQUESTION'
    },
    type:{
      type:'string',
      size:10,
      columnName: 'TYPEQUESTION'
    },
    text:{
      type:'text',
      size:800,
      columnName: 'TEXTQUESTION'
    }
  }
};
