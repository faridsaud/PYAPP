/**
* Usuario.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var sync = require('synchronize');
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
      columnName:'LASTNAME'
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
    pin:{
      type:'string',
      columnName:'PIN'
    },
    /*
    pruebas:{
      collection:'prueba',
      via:'usuario',
      through:'usrpru'
    }*/


    testToDo: function(cb){
      console.log(this.email);
      sails.models.usrpru.query(
        'SELECT * FROM USR_PRU WHERE EMAIL=?',
        [ this.email ]
        , function(err, results) {
          if (err){
            return res.serverError(err);
          }else{
            cb(results);
          }
        });
    },

  }
};
