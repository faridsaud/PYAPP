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
      return res.json(400,{msg: 'Error creating the user, no email send'});
    }
    if(req.body.user.password){
      var password=req.body.user.password;
    }else{
      return res.json(400,{msg: 'Error creating the user, no password send'});
    }

    if(req.body.user.securityQuestion1){
      var securityQuestion1=req.body.user.securityQuestion1;
      if(!securityQuestion1.question || !securityQuestion1.answer){
        return res.json(400,{msg: 'Error creating the user, no security question 1 send'});
      }
    }else{
      return res.json(400,{msg: 'Error creating the user, no security question 1 send'});
    }

    if(req.body.user.securityQuestion2){
      var securityQuestion2=req.body.user.securityQuestion2;
      if(!securityQuestion2.question || !securityQuestion2.answer){
        return res.json(400,{msg: 'Error creating the user, no security question 2 send'});
      }
    }else{
      return res.json(400,{msg: 'Error creating the user, no security question 2 send'});
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
      var roles=["student"];
    }
    var pin=sails.controllers.user.generatePin();
    console.log("a"+pin+"a");
    console.log("estamos aqui");
    var passwordEncrypted = bcrypt.hashSync(password, bcrypt.genSaltSync());
    var pinEncrypted = bcrypt.hashSync(pin, bcrypt.genSaltSync());

    sails.models.user.create({
      email:email,
      password:passwordEncrypted,
      firstName:name,
      lastNames:lastName,
      idPassport:passport,
      country:country,
      pin:pinEncrypted
    }).exec(function (error, newRecord){
      if(error){
        console.log(error);
        return res.json(512, {msg:"Error creating the user, maybe the user email is already in use"})
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
        var promiseSQuestion1=sails.models.usrsqu.create({email:email,idSecurityQuestion:securityQuestion1.question, answerText:securityQuestion1.answer});
        var promiseSQuestion2=sails.models.usrsqu.create({email:email,idSecurityQuestion:securityQuestion2.question, answerText:securityQuestion2.answer});
        promises.push(promiseSQuestion1);
        promises.push(promiseSQuestion2);
        Promise.all(promises)
        .then(function(){
          newRecord.pin=pin;
          return res.json(201,{msg: 'User created',user:newRecord});
        })
        .catch(function(error){
          console.log(error);
          return res.json(500,{msg: 'Error creating the user'});
        })
      }
    })

  },


  login:function(req,res){
    if(!req.body.user){
      return res.json(400,{msg: 'Error login in the user, no user send'});
    }
    /*Find user by pin*/
    if(req.body.user.pin){
      var pin=req.body.user.pin.toString();
      console.log(pin);
      var findPromise=sails.controllers.user.findUserByPin(pin);

    }else{

      if(req.body.user.email){
        var email=req.body.user.email;
      }else{
        return res.json(400,{msg: 'Error login in the user, no email send'});
      }
      if(req.body.user.password){
        var password=req.body.user.password;
      }else{
        return res.json(400,{msg: 'Error login in the user, no password send'});
      }
      /*Find user by email and password*/
      var findPromise=sails.models.user.findOne({email:email})
      .then(function(userFinded){
        if(userFinded){
          if(bcrypt.compareSync(password, userFinded.password)==true){
            return userFinded;
          }else{
            return undefined;
          }
        }else{
          return undefined;
        }
      })
    }
    Promise.join(findPromise, function(userFinded){
      if(!userFinded){
        return res.json(400,{msg: 'Error login in the user, no user with those credentials'});
      }else{
        if(req.body.user.role){
          var role=req.body.user.role;
        }else{
          var role="student";
        }
        sails.models.usrrol.query('SELECT * FROM USR_ROL WHERE NAME=? AND EMAIL=?',[role,userFinded.email ], function(err, results) {
          if (err) return res.serverError(err);
          else{
            if(results[0]){
              req.session.userLogged=results[0].EMAIL;
              return res.json(200,{msg: 'Login successfull',role:role,email:results[0].EMAIL});
            }else{
              return res.json(403,{msg: 'The role is not associated with the user'});
            }
          }
        });
      }
    })
    .catch(function(error){
      console.log(error);
      return res.json(500,{msg: 'Error login in the user'});
    })

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
          sails.models.user.query('SELECT USR.FIRSTNAME, USR.LASTNAME, USR.EMAIL FROM USR_COU U, USER USR WHERE U.STATUSUSRCOU=? AND U.EMAIL=USR.EMAIL AND U.IDCOURSE=? ',[status, idCourse], function(err, results) {
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
  },

  findUserByPin:function(pin){
    var promise=sails.models.user.find()
    .then(function(users){
      var finded=false;

      console.log("Se encontro todos los usuarios");
      console.log(users);
      for(var i=0;i<users.length;i++){
        console.log("pin enviado"+pin);
        console.log("pin del usuario"+users[i].pin);
        if(bcrypt.compareSync(pin, users[i].pin)==true){
          console.log("usuario encontrado");
          console.log(users[i]);
          finded=true;
          return users[i];
        }
      }
      if(finded==false){
        return undefined;
      }
    })
    return promise;
  }
};
