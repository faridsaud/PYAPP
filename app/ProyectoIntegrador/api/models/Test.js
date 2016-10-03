/**
* Prueba.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'TEST',
  attributes: {

    id:{
      type:'integer',
      primaryKey: true,
      unique: true,
      columnName: 'IDTEST'
    },
    title:{
      type:'text',
      size:100,
      columnName: 'TITLE'
    },
    description:{
      type:'text',
      size:300,
      columnName: 'DESCRIPTIONTEST'
    },
    createdBy:{
      type:'string',
      size:40,
      columnName: 'CREATEDBYTEST'
    },
    status:{
      type:'string',
      size:10,
      columnName: 'TITLE'
    }

    /*
    usuarios:{
      collection:'usuario',
      via:'prueba',
       through:'usrpru'
    }
    */

  }
};
