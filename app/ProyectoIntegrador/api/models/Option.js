/**
* Option.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'OPTION_A',

  attributes: {
    id:{
      type:'integer',
      primaryKey: true,
      unique: true,
      columnName: 'IDOPTION'
    },
    justification:{
      type:'text',
      size:800,
      columnName: 'NAMEINSTITUTION'
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
