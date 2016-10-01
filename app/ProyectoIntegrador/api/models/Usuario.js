/**
* Usuario.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  /*



  */
  tableName:'USER',
  attributes: {
    //cambiar id por email
    email:{
      type:'string',
      primaryKey: true,
      unique: true,
      columnName: 'EMAIL'
    },
    //cambiar clave por password
    password:{
      type:'string',
      //required:true,
      columnName: 'PASSWORD'
    },
    firstName:{
      type:'string',
      size:30,
      columnName:'FIRSTNAME'
    },
    lastNames:{
      type:'string',
      size:30,
      columnName:'LASTNAMES'
    },
    idPassport:{
      type:'string',
      size:15,
      columnName:'IDPASSPORT'
    },
    country:{
      type:'string',
      size:30,
      columnName:'COUNTRY'
    },
    username:{
      type:'string',
      size:40,
      columnName:'USERNAME'
    }
    /*
    pruebas:{
      collection:'prueba',
      via:'usuario',
      through:'usrpru'
    }*/
    pruebas:{
      collection:'prueba',
      via:'EMAIL',
      through:'usrpru'
    }
  }
};
