/**
* Usuario.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  identity:'usuario',
  tableName:'USUARIO',
  attributes: {

    id:{
      type:'string',
      primaryKey: true,
      unique: true,
      columnName: 'EMAIL'
    },
    clave:{
      type:'string',
      //required:true,
      columnName: 'PASSWORD'
    },
    /*
    pruebas:{
      collection:'prueba',
      via:'usuario',
      through:'usrpru'
    }*/
    pruebas:{
      collection:'prueba',
      via:'usuarios'
    }
  }
};
