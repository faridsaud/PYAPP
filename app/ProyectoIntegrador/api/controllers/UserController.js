/**
* UsuarioController
*
* @description :: Server-side logic for managing usuarios
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/
var bcrypt=require('bcrypt-nodejs');
var Promise = require("bluebird");
module.exports = {

  register: function (req, res) {
    var error=false;
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
    if(req.body.user.roles){
      var roles=req.body.user.roles;
    }else{
      var roles=null;
    }
    var pin=sails.controllers.user.generatePin();
    console.log(pin);
    if(error){
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
        pin:pin
      }).exec(function (error, newRecord){
        if(error){
          console.log(error);
          return res.json(512, {msg:error})
        }else{
          var queryPromisified=Promise.promisify(sails.models.usrrol.query);
          var promises=[];
          console.log("roles");
          console.log(roles);
          for(var i=0;i<roles.length;i++){
            console.log(roles[i]);
            var promise=queryPromisified('INSERT INTO USR_ROL (NAME, EMAIL) VALUES (?,?)',[roles[i],email ]);
            promises.push(promise);
          }
          Promise.all(promises)
          .then(function(){
            return res.json(201,{msg: 'User created'});
          })
          .catch(function(error){
            console.log(error);
            return res.json(400,{msg: 'Invalid role'});
          })
        }
      })
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
        msg: 'No email or username send'
      });
    }else{
      console.log(role);
      sails.models.user.findOne({email:email}).exec(function (error, userFinded){
        if(error){
          console.log(error);
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
                      req.session.userLogged=results[0].EMAIL;
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
            else{
              return res.json(400,{
                msg: 'Not user finded with those credentials'
              });

            }
          }
        });
      }
    },

    getStudentsByCourse: function (req, res) {
      if(req.body.course.id){
        var idCourse=req.body.course.id;
      }else{
        var idCourse=null;
        return res.json(400,{msg:"There is not a course's id send"});
      }
      if(req.body.user.email){
        var userEmail=req.body.user.email;
      }else{
        var idCourse=null;
        return res.json(400,{msg:"There is not a user's email send"});
      }

      sails.models.usrcou.findOne({email:userEmail, status:'t', idCourse:idCourse}).exec(function(err, result){
        if(err){
          console.log(err);
          return res.json(500,{msg:"Error"});
        }else{
          if(result){
            var status='s';
            sails.models.user.query(
              'SELECT USR.FIRSTNAME, USR.LASTNAME, USR.EMAIL FROM USR_COU U, USER USR WHERE U.STATUSUSRCOU=? AND U.EMAIL=USR.EMAIL AND U.IDCOURSE=? ',
              [status, idCourse]
              , function(err, results) {
                if (err){
                  console.log(err);
                  return res.json(512,{msg:"Error"});
                }else{
                  return res.json(201,{msg:"OK", students:results});
                }
              });

            }else{
              return res.json(400,{msg:"The user is not the owner of the course"});
            }
          }
        });

      },
      getStudentDataWithScore:function(email, score){
        var promise=sails.models.user.findOne({email:email}).
        then(function(userFinded){
          delete userFinded.password;
          userFinded.name=userFinded.firstName+" "+userFinded.lastNames;
          delete userFinded.firstName;
          delete userFinded.lastNames;
          userFinded.score=score;
          console.log("Usuario en promesa");
          console.log(userFinded);
          return userFinded;
        })
        return promise;

      },

      generatePin:function(){
        var initialNumber="";
        for(var i=0;i<2;i++){
          initialNumber=initialNumber+Math.floor((Math.random() * 10)).toString();
        }
        var finalNumber=Math.floor((Math.random() * 10)).toString();;
        var date=new Date();
        var middleNumber=date.getTime().toString();
        var pin=initialNumber+middleNumber+finalNumber;
        return pin;
      }
    };
