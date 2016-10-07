/**
* UsuarioController
*
* @description :: Server-side logic for managing usuarios
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

module.exports = {

  register: function (req, res) {
    if(req.body.user.email){
      var email=req.body.user.email;
    }else{
      var email=null;
    }
    if(req.body.user.password){
      var password=req.body.user.password;
    }else{
      var password=null;
    }
    if(req.body.user.username){
      var username=req.body.user.username;
    }else{
      var username=null;
    }
    if(req.body.user.passport){
      var passport=req.body.user.passport;
    }else{
      var passport=null
    }
    if(req.body.user.name){
      var name=req.body.user.name;
    }else{
      var name=null;
    }
    if(req.body.user.lastName){
      var lastName=req.body.user.lastName;
    }else{
      var lastName=null;
    }
    if(req.body.user.country){
      var country=req.body.user.country;
    }else{
      var country=null;
    }
    sails.models.user.create({
      email:email,
      password:password,
      firstName:name,
      lastNames:lastName,
      idPassport:passport,
      country:country,
      username:username
    }).exec(function (error, newRecord){
      if(error){
        console.log(error);
        return res.json(512, {msg:error})
      }else{
        return res.json(201,{
          msg: 'todo bien'
        });
      }
    });
  },

  login:function(req,res){
    /*Email could be an email or username*/
    if(req.body.user.email){
      var email=req.body.user.email;
    }else{
      var email=null;
    }
    if(req.body.user.password){
      var password=req.body.user.password;
    }else{
      var password=null;
    }
    if(email==null){
      return res.json(400,{
        msg: 'Non email or username send'
      });
    }else{
      sails.models.user.findOne(
        {
          or:[
            {email:email,password:password},
            {username:email,password:password}
          ]
        }).exec(function (error, userFinded){
          if(error){
            console.log(error);
            return res.json(512, {msg:error})
          }else{
            if(userFinded){
              return res.json(200,{
                msg: 'Login successfull'
              });
            }else{
              return res.json(400,{
                msg: 'Invalid credentials'
              });
            }
          }
        });
      }



    },
  };
