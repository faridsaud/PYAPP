/**
* UsuarioController
*
* @description :: Server-side logic for managing usuarios
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/
var bcrypt=require('bcrypt-nodejs');
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
    if(req.body.user.role){
      var role=req.body.user.role;
    }else{
      var role=null;
    }
    console.log(role);
    if(role==null){
      return res.json(400,{
        msg: 'No role send'
      });
    }else{
      console.log("estamos aqui");
      var hash = bcrypt.hashSync(password, bcrypt.genSaltSync());
      console.log(hash);
      sails.models.user.create({
        email:email,
        password:hash,
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

          sails.models.usrrol.query(
            'INSERT INTO USR_ROL (NAME, EMAIL) VALUES (?,?)',
            [role,email ]
            , function(err, results) {
              if (err) return res.json(400,{
                msg: 'Invalid role'
              });
              return res.json(201,{
                msg: 'User created'
              });
            });

          }
        });
      }

    },

    login:function(req,res){
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
      if(req.body.user.role){
        var role=req.body.user.role;
      }else{
        var role="student";
      }
      if(email==null){
        return res.json(400,{
          msg: 'Non email or username send'
        });
      }else{
        console.log(role);
        sails.models.user.findOne({
          or : [
            { email: email },
            { username: email }
          ]
        }).exec(function (error, userFinded){
          if(error){
            console.log(error);
            console.log("error aqui");
            return res.json(512, {msg:error})
          }else{
            if(userFinded){
              console.log(userFinded);
              if(bcrypt.compareSync(password, userFinded.password)==true){
                console.log("hola");
                sails.models.usrrol.query(
                  'SELECT * FROM USR_ROL WHERE NAME=? AND EMAIL=?',
                  [role,userFinded.email ]
                  , function(err, results) {
                    if (err) return res.serverError(err);
                    else{
                      if(results[0]){
                        return res.json(200,{
                          msg: 'Login successfull',
                          role:role,
                          email:results[0].EMAIL
                        });
                      }else{
                        return res.json(403,{
                          msg: 'The role is not associated with the user'
                        });
                      }
                    }
                  });

                }else{
                  return res.json(400,{
                    msg: 'Not user finded with those credentials'
                  });
                }
              }
            }

          });
        }



      },
    };
