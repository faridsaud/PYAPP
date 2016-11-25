/**
* Option.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'OPTIO',

  attributes: {
    id:{
      type:'integer',
      autoIncrement:true,
      primaryKey: true,
      unique: true,
      columnName: 'IDOPTION'
    },
    idQuestion:{
      type:'integer',
      columnName: 'IDQUESTION'
    },
    justification:{
      type:'text',
      size:800,
      columnName: 'JUSTIFICATION'
    },
    isCorrect:{
      type:'boolean',
      columnName: 'ISCORRECT'
    },
    isSelected:{
      type:'boolean',
      columnName: 'ISSELECTED'
    },
    type:{
      type:'string',
      size:10,
      columnName: 'TYPEOPTION'
    },
    text:{
      type:'text',
      size:800,
      columnName: 'TEXTOPTION'
    }
  }
};
