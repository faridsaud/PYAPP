/**
* Prueba.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
identity:'prueba',
  tableName:'PRUEBA',
  attributes: {

    id:{
      type:'integer',
      primaryKey: true,
      unique: true,
      columnName: 'IDPRUEBA'
    },
    creadoPor:{
      type:'integer',
      required:true,
      columnName: 'CREADORPOR'
    },
    /*
    usuarios:{
      collection:'usuario',
      via:'prueba',
       through:'usrpru'
    }
    */
    usuarios:{
      collection:'usuario',
      via:'pruebas',
    }
  }
};
