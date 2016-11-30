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
      autoIncrement:true,
      primaryKey: true,
      unique: true,
      columnName: 'IDTEST'
    },
    idCourse:{
      type:'integer',
      columnName: 'IDCOURSE'
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
      size:254,
      columnName: 'CREATEDBYTEST'
    },
    status:{
      type:'string',
      size:1,
      columnName: 'STATUS'
    },
    startDateTime:{
      type:'string',
      size:24,
      columnName: 'STARTDATETIME'
    },
    finishDateTime:{
      type:'string',
      size:24,
      columnName:'FINISHDATETIME'
    },
    averageScore:{
      type:'float',
      columnName: 'AVERAGESCORE'
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
