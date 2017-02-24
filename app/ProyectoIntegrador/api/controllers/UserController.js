/**
* UserController
* @module {Controller} User
* @author Farid Saud Rolleri
* @description :: Server-side logic for managing users
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/
var bcrypt=require('bcrypt-nodejs');
var Promise = require("bluebird");
module.exports = {

  /**
  * @memberof module:User
  * @function register
  * @param  {JSON} req HTTP request object
  * @param  {JSON} req.body.user User to be registered
  * @param  {string} req.body.user.email Email
  * @param  {string} req.body.user.password Password
  * @param  {JSON} req.body.user.securityQuestion1 Security question 1
  * @param  {JSON} req.body.user.securityQuestion2 Security question 2
  * @param  {string} req.body.user.passport Passport id
  * @param  {string} req.body.user.name Name
  * @param  {string} req.body.user.lastName Last Name
  * @param  {string} req.body.user.country Country
  * @param  {string[]} req.body.user.roles List of roles
  * @param  {JSON} res HTTP response object
  * @returns  {JSON} HTTP response object
  * @description Register a user
  */
  register: function (req, res) {
    var error=false;
    if(!req.body.user){
      return res.json(400,{code:1, msg: 'Error creating the user, no user send', msgES:"Datos del usuario no envíado"});
    }
    if(req.body.user.email){
      var email=req.body.user.email;
    }else{
      return res.json(400,{code:2, msg: 'Error creating the user, no email send', msgES:"Email del usuario no envíado"});
    }
    if(req.body.user.password){
      var password=req.body.user.password;
    }else{
      return res.json(400,{code:3,msg: 'Error creating the user, no password send', msgES:"Clave del usuario no envíada"});
    }

    if(req.body.user.securityQuestion1){
      var securityQuestion1=req.body.user.securityQuestion1;
      if(!securityQuestion1.question || !securityQuestion1.answer){
        return res.json(400,{code:5,msg: 'Error creating the user, no security question 1 send', msgES:"Pregunta de seguridad y respuesta 1 del usuario no envíados"});
      }
    }else{
      return res.json(400,{code:4,msg: 'Error creating the user, no security question 1 send', msgES:"Pregunta de seguridad y respuesta 1 del usuario no envíados"});
    }

    if(req.body.user.securityQuestion2){
      var securityQuestion2=req.body.user.securityQuestion2;
      if(!securityQuestion2.question || !securityQuestion2.answer){
        return res.json(400,{code:7,msg: 'Error creating the user, no security question 2 send', msgES:"Pregunta de seguridad y respuesta 2 del usuario no envíados"});
      }
    }else{
      return res.json(400,{code:6,msg: 'Error creating the user, no security question 2 send', msgES:"Pregunta de seguridad y respuesta 2 del usuario no envíados"});
    }
    if(securityQuestion1.question==securityQuestion2.question){
      return res.json(400,{code:8,msg: 'Error creating the user, the security questions can not be the same', msgES:"Las preguntas de seguridad 1 y 2 no pueden ser las mismas"});
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
        return res.json(512, {msg:"Error creating the user, maybe the user email is already in use", msgES:"Posiblemente el email ya ha sido utilizado"})
      }else{
        var queryPromisified=Promise.promisify(sails.models.usrrol.query);
        var promises=[];
        for(var i=0;i<roles.length;i++){
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
          return res.json(201,{msg: 'User created',user:newRecord, msgES:"Prueba creada"});
        })
        .catch(function(error){
          console.log(error);
          return res.json(500,{msg: 'Error creating the user'});
        })
      }
    })

  },

  /**
  * @memberof module:User
  * @function login
  * @param  {JSON} req HTTP request object
  * @param  {JSON} req.body.user User loggin in
  * @param  {string} req.body.user.email Email
  * @param  {string} req.body.user.password Password
  * @param  {string} req.body.user.pin Password
  * @param  {JSON} res HTTP response object
  * @returns  {JSON} HTTP response object
  * @description Login
  */
  login:function(req,res){
    if(!req.body.user){
      return res.json(400,{code:1,msg: 'Error login in the user, no user send', msgES:"Datos del usuario no envíados"});
    }
    /*Find user by pin*/
    if(req.body.user.pin && !req.body.user.password){
      var pin=req.body.user.pin.toString();
      console.log(pin);
      var findPromise=sails.controllers.user.findUserByPin(pin);

    }else{

      if(req.body.user.email){
        var email=req.body.user.email;
      }else{
        return res.json(400,{code:2,msg: 'Error login in the user, no email send', msgES:"Email del usuario no envíado"});
      }
      if(req.body.user.password){
        var password=req.body.user.password;
      }else{
        return res.json(400,{code:3,msg: 'Error login in the user, no password send', msgES:"Clave del usuario no envíada"});
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
        return res.json(400,{code:4,msg: 'Error login in the user, no user with those credentials', msgES:"No existe usuario con esas credenciales"});
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
              return res.json(200,{msg: 'Login successfull',role:role,email:results[0].EMAIL, msgES:"Sesión iniciada"});
            }else{
              return res.json(403,{msg: 'The role is not associated with the user', msgES:"El rol no esta asociado al usuario"});
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

  /**
  * @memberof module:User
  * @function getStudentsByCourse
  * @param  {JSON} req HTTP request object
  * @param  {JSON} req.body.user User retrieving the students
  * @param  {string} req.body.user.email Email
  * @param  {JSON} req.body.course Course of the students
  * @param  {int} req.body.course.id Id
  * @param  {JSON} res HTTP response object
  * @returns  {JSON} HTTP response object
  * @description Get all the students that are registered in the course
  */
  getStudentsByCourse: function (req, res) {
    if(!req.body.user){
      return res.json(400,{code:1,msg:"There is not a user's data send"});
    }
    if(req.body.user.email){
      var userEmail=req.body.user.email;
    }else{
      var idCourse=null;
      return res.json(400,{code:2,msg:"There is not a user's email send"});
    }
    if(!req.body.course){
      return res.json(400,{code:3,msg:"There is not a course's data send"});
    }
    if(req.body.course.id){
      var idCourse=req.body.course.id;
    }else{
      var idCourse=null;
      return res.json(400,{code:4,msg:"There is not a course's id send"});
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
              return res.json(200,{msg:"OK", students:results});
            }
          });

        }else{
          return res.json(403,{msg:"The user is not the owner of the course"});
        }
      }
    });

  },

  /**
  * @memberof module:User
  * @function getStudentDataWithScore
  * @param  {string} email Email of the user
  * @param  {float} score Score of the student
  * @returns  {promise} Promise of the select action
  * @description Get student with score
  */
  getStudentDataWithScore:function(email, score){
    var promise=sails.models.user.findOne({email:email}).
    then(function(userFinded){
      delete userFinded.password;
      userFinded.name=userFinded.firstName+" "+userFinded.lastNames;
      delete userFinded.firstName;
      delete userFinded.lastNames;
      userFinded.score=score;
      return userFinded;
    })
    return promise;

  },

  /**
  * @memberof module:User
  * @function generatePin
  * @returns  {int} PIN generated
  * @description Generates a ramdom PIN
  */
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
  /**
  * @memberof module:User
  * @function findUserByPin
  * @param {int} pin Pin
  * @returns  {promise} Promise of the select action
  * @description Find a user by PIN
  */
  findUserByPin:function(pin){
    var promise=sails.models.user.find()
    .then(function(users){
      var finded=false;
      for(var i=0;i<users.length;i++){
        if(bcrypt.compareSync(pin, users[i].pin)==true){
          finded=true;
          return users[i];
        }
      }
      if(finded==false){
        return undefined;
      }
    })
    return promise;
  },

  /**
  * @memberof module:User
  * @function check
  * @param  {JSON} req HTTP request object
  * @param  {string} req.body.email Email
  * @param  {JSON} req.body.securityQuestion1 Security question 1
  * @param  {JSON} req.body.securityQuestion2 Security question 2
  * @param  {JSON} res HTTP response object
  * @returns  {JSON} HTTP response object
  * @description Check if the security questions and answers given by the user match with the ones in the database
  */
  check:function(req,res){
    if(req.body.email){
      var email=req.body.email;
    }else{
      return res.json(400,{code:1,msg:"Error checking the user, no email send", msgES:"Email del usuario no envíado"});
    }
    if(req.body.securityQuestion1){
      var securityQuestion1=req.body.securityQuestion1;
    }else{
      return res.json(400,{code:2,msg:"Error checking the user, no security question send", msgES:"Pregunta de seguridad 1 no envíada"});
    }
    if(req.body.securityQuestion2){
      var securityQuestion2=req.body.securityQuestion2;
    }else{
      return res.json(400,{code:3,msg:"Error checking the user, no security question send", msgES:"Pregunta de seguridad 2 no envíada"});
    }
    var correctChoices=true;
    var promise1=sails.models.usrsqu.findOne({email:email,idSecurityQuestion:securityQuestion1.question,answerText:securityQuestion1.answer})
    .then(function(finded){
      if(!finded){
        correctChoices=false;
      }
    })
    var promise2=sails.models.usrsqu.findOne({email:email,idSecurityQuestion:securityQuestion2.question,answerText:securityQuestion2.answer})
    .then(function(finded){
      if(!finded){
        correctChoices=false;
      }
    })
    Promise.join(promise1, promise2)
    .then(function(){
      if(correctChoices==true){
        return res.json(200,{msg:"OK"});
      }else{
        return res.json(400,{code:4,msg:"Error checking the user"});
      }
    })
    .catch(function(error){
      return res.json(500,{msg:"Error checking the user"});
    })

  },


  /**
  * @memberof module:User
  * @function updateSecurityInfo
  * @param  {JSON} req HTTP request object
  * @param  {string} req.body.email Email of the user
  * @param  {string} req.body.password New password
  * @param  {JSON} req.body.securityQuestion1 New Security question 1
  * @param  {JSON} req.body.securityQuestion2 New Security question 2
  * @param  {JSON} res HTTP response object
  * @returns  {JSON} HTTP response object
  * @description Updates the security information of the user
  */
  updateSecurityInfo:function(req, res){
    if(req.body.email){
      var email=req.body.email;
    }else{
      return res.json(400,{code:1,msg:"Error updating security info, no email send", msgES:"Email del usuario no envíado"});
    }
    if(req.body.password){
      var password=req.body.password;
    }else{
      return res.json(400,{code:2,msg:"Error updating security info, no password send", msgES:"Clave del usuario no envíado"});
    }
    var securityQuetionsSend=true;
    if(req.body.securityQuestion1){
      var securityQuestion1=req.body.securityQuestion1;
      if(!securityQuestion1.question || !securityQuestion1.answer){
        securityQuetionsSend=false;
      }
    }else{
      securityQuetionsSend=false;
    }

    if(req.body.securityQuestion2){
      var securityQuestion2=req.body.securityQuestion2;
      if(!securityQuestion2.question || !securityQuestion2.answer){
        securityQuetionsSend=false;
      }
    }else{
      securityQuetionsSend=false;
    }
    if(securityQuetionsSend==true){
      if(securityQuestion1.question==securityQuestion2.question){
        return res.json(400,{code:3,msg: 'Error creating the user, the security questions can not be the same', msgES:"Las preguntas de seguridad 1 y 2 no pueden ser las mismas"});
      }
    }
    if(req.body.generatePin){
      var generatePin=req.body.generatePin;
    }else{
      var generatePin=false;
    }
    var promises=[];
    var passwordEncrypted = bcrypt.hashSync(password, bcrypt.genSaltSync());
    var promiseUpdatePassword=sails.models.user.update({email:email}, {password:passwordEncrypted});
    promises.push(promiseUpdatePassword);

    if(generatePin==true){
      var pin=sails.controllers.user.generatePin();
      var pinEncrypted = bcrypt.hashSync(pin, bcrypt.genSaltSync());
      var promiseUpdatePin=sails.models.user.update({email:email}, {pin:pinEncrypted});
      promises.push(promiseUpdatePin);
    }

    if(securityQuetionsSend==true){
      var promiseDeleteSecurityQuestions=sails.models.usrsqu.destroy({email:email})
      .then(function(){
        var promiseCreateSecurityQuestion1=sails.models.usrsqu.create({email:email, idSecurityQuestion:securityQuestion1.question, answerText:securityQuestion1.answer});
        var promiseCreateSecurityQuestion2=sails.models.usrsqu.create({email:email, idSecurityQuestion:securityQuestion2.question, answerText:securityQuestion2.answer});
        var updatePromisesSecurityQuestions=[];
        updatePromisesSecurityQuestions.push(promiseCreateSecurityQuestion1);
        updatePromisesSecurityQuestions.push(promiseCreateSecurityQuestion2);
        return updatePromisesSecurityQuestions;
      })
      promises.push(promiseDeleteSecurityQuestions);

    }

    Promise.all(promises)
    .then(function(results){
      console.log(results);
      Promise.all(results[results.length-1])
      .then(function(){
        return res.json(200,{msg: 'Security info updated successfully',pinGenerated:pin, msgES:"Información de seguridad actualizada"});
      })

      .catch(function(error){
        console.log(error);
        return res.json(500,{msg: 'Error updating the security info'});
      })

    })
    .catch(function(error){
      console.log(error);
      return res.json(500,{msg: 'Error updating the security info'});
    })

  }
};
