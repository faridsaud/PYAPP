/**
* Usrpru.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName:'USR_PRU',
  autoPK: false,


  attributes: {
    EMAIL:{
      model:'usuario'
    },
    IDPRUEBA: {
      model: 'prueba'
    }
  }
};
