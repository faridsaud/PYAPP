/**
* CourseController
* @module {Controller} Course
* @author Farid Saud Rolleri
* @description :: Server-side logic for managing courses
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/
var Promise = require("bluebird");

Promise.config({
  // Enable warnings
  warnings: false,
  // Enable long stack traces
  longStackTraces: true,
  // Enable cancellation
  cancellation: true,
  // Enable monitoring
  monitoring: true
});
module.exports = {

  /**
  * @memberof module:Course
  * @function register
  * @param  {JSON} req HTTP request object
  * @param  {JSON} req.body.user User registering the course
  * @param  {string} req.body.user.email Email
  * @param  {string} req.body.user.role Role
  * @param  {JSON} req.body.course Course to be registered
  * @param  {string} req.body.course.name Name
  * @param  {string} req.body.course.description Description
  * @param  {JSON} res HTTP response object
  * @returns  {JSON} HTTP response object
  * @description Register a course
  */
  register: function(req, res) {
    if (req.body.user.email) {
      var email = req.body.user.email;
    } else {
      var email = null;
      return res.json(400, {
        code: 1,
        msg: "No user's email send",
        msgES:"Email del usuario no envíado"
      });
    }
    if (req.body.user.role) {
      var role = req.body.user.role;
      var correctRole = false;
      if (role == "teacher") {
        var status = "t";
        correctRole = true;
      }
      if (correctRole == false) {
        return res.json(403, {
          code: 2,
          msg: "Invalid role",
          msgES:"Rol inválido"
        });
      }
    } else {
      var role = null;
      return res.json(403, {
        code: 3,
        msg: "Invalid role",
        msgES:"Rol inválido"
      });
    }
    if (req.body.course.name) {
      var name = req.body.course.name;
    } else {
      var name = null;
      return res.json(400, {
        code: 4,
        msg: "No course's name send",
        msgES:"Curso no envíado"
      });
    }

    if (req.body.course.description) {
      var description = req.body.course.description;
    } else {
      var description = null;
    }

    sails.models.course.create({
      name: name,
      description: description,
      createdBy: email
    })
    .exec(function(error, newRecord) {
      if (error) {
        console.log(error);
        return res.json(500, {
          code: 5,
          msg: "Error creating the course",
          msgES:"Error creando el curso"
        });
      } else {
        sails.models.usrcou.query('INSERT INTO USR_COU (EMAIL, IDCOURSE, STATUSUSRCOU) VALUES (?,?,?)', [email, newRecord.id, status],function(err, results) {
          if (err) {
            console.log(err);
            return res.json(512, {
              msg: "Error creating the course",
              msgES:"Error creando el curso"
            });
          } else {
            return res.json(201, {
              code: 1,
              msg: "Course created",
              msgES:"Curso creado",
              course: newRecord
            });
          }
        });
      }
    });


  },

  /**
  * @memberof module:Course
  * @function getCoursesCreatedByUser
  * @param  {JSON} req HTTP request object
  * @param  {JSON} req.body.user User retrieving the courses
  * @param  {string} req.body.user.email Email
  * @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
  * @description Retrieve the courses created by the user
  */
  getCoursesCreatedByUser: function(req, res) {
    if(!req.body.user){
      return res.json(400, {code:1,msg: "No user send", msgES:"Usuario no envíado"});
    }
    if (req.body.user.email) {
      var email = req.body.user.email;
      var status = "c";
      sails.models.usrcou.query('SELECT C.NAMECOURSE, C.IDCOURSE FROM USR_COU U, COURSE C WHERE U.STATUSUSRCOU=? AND U.EMAIL=? AND C.IDCOURSE=U.IDCOURSE', [status, email], function(err, results) {
        if (err) {
          console.log(err);
          return res.json(512, {
            code:1,
            msg: "Error getting the courses",
            msgES:"Error obteniendo los cursos"
          });
        } else {
          return res.json(200, {
            code:1,
            msg: "OK",
            msgES:"OK",
            courses: results
          });
        }
      });
    } else {
      return res.json(400, {code:2,msg: "Not email send", msgES:"Email no envíado"});
    }
  },


  /**
  * @memberof module:Course
  * @function getCoursesByTeacher
  * @param  {JSON} req HTTP request object
  * @param  {JSON} req.body.user User retrieving the courses
  * @param  {string} req.body.user.email Email
  * @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
  * @description Retrieves the courses where the user is the teacher
  */
  getCoursesByTeacher: function(req, res) {
    if(!req.body.user){
      return res.json(400, {code:1,msg: "No user send", msgES:"Usuario no envíado"});
    }
    if (req.body.user.email) {
      var email = req.body.user.email;
      var status = "t";
      sails.models.usrcou.query('SELECT C.NAMECOURSE,C.DESCRIPTIONCOURSE, C.IDCOURSE FROM USR_COU U, COURSE C WHERE U.STATUSUSRCOU=? AND U.EMAIL=? AND C.IDCOURSE=U.IDCOURSE', [status, email], function(err, results) {
        if (err) {
          console.log(err);
          return res.json(512, {
            code:1,
            msg: "Error getting the courses",
            msgES:"Error obteniendo los cursos"
          });
        } else {
          return res.json(200, {
            code:1,
            msg: "OK",
            msgES:"OK",
            courses: results
          });
        }
      });
    } else {
      return res.json(400, {code:2, msg: "Not email send", msgES:"Email no envíado"});
    }
  },


  /**
  * @memberof module:Course
  * @function getCoursesByStudent
  * @param  {JSON} req HTTP request object
  * @param  {JSON} req.body.user User retrieving the courses
  * @param  {string} req.body.user.email Email
  * @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
  * @description Retrieves the courses where the user is the student
  */
  getCoursesByStudent: function(req, res) {
    if(!req.body.user){
      return res.json(400, {code:1, msg: "Not user send", msgES:"Usuario no envíado"});
    }
    if (req.body.user.email) {
      var email = req.body.user.email;
      var status = "s";
      sails.models.usrcou.query('SELECT C.NAMECOURSE,C.DESCRIPTIONCOURSE, C.IDCOURSE FROM USR_COU U, COURSE C WHERE U.STATUSUSRCOU=? AND U.EMAIL=? AND C.IDCOURSE=U.IDCOURSE', [status, email], function(err, results) {
        if (err) {
          console.log(err);
          return res.json(512, {
            msg: "Error getting the courses",
            msgES:"Error obteniendo los cursos"
          });
        } else {
          return res.json(200, {
            msg: "OK",
            msgES:"OK",
            courses: results
          });
        }
      });
    } else {
      return res.json(400, {code:2,msg: "Not email send", msgES:"Email no envíado"});
    }

  },


  /**
  * @memberof module:Course
  * @function registerStudent
  * @param  {JSON} req HTTP request object
  * @param  {JSON} req.body.user User registering the student
  * @param  {string} req.body.user.email Email
  * @param  {JSON} req.body.student Student to be registered
  * @param  {string} req.body.student.email Email
  * @param  {JSON} req.body.course Course in which the student is going to be registered
  * @param  {int} req.body.course.id Id
  * @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
  * @description Register a student in the course
  */
  registerStudent: function(req, res) {
    if(!req.body.student){
      return res.json(400, {code:1,msg: "No student send", msgES:"Estudiante no envíado"});
    }
    if (req.body.student.email) {
      var studentEmail = req.body.student.email;
    } else {
      return res.json(400, {code:2,msg: "No student's email send", msgES:"Email del estudiante no envíado"});
    }

    if(!req.body.course){
      return res.json(400, {code:3,msg: "No course send", msgES:"Curso no envíado"});
    }
    if (req.body.course.id) {
      var idCourse = req.body.course.id;
    } else {
      return res.json(400, {code:4,msg: "No course's id send", msgES:"Id del curso no envíado"});
    }

    if(!req.body.user){
      return res.json(400, {code:5,msg: "No user send", msgES:"Usuario no envíado"});
    }
    if (req.body.user.email) {
      var userEmail = req.body.user.email;
    } else {
      return res.json(400, {code:6, msg: "There is not a user's email send", msgES:"Email del usuario no envíado"});
    }

    if (userEmail == studentEmail) {
      return res.json(400, {
        code:7,
        msg: "The teacher cannot be an student of the same course",
        msgES:"El profesor no puede ser estudiante del mismo curso"
      });
    }
    /*Compruebo si el profesor es el dueno del curso*/
    sails.models.usrcou.findOne({
      email: userEmail,
      status: 't',
      idCourse: idCourse
    }).exec(function(err, teacher) {
      if (err) {
        console.log(err);
        return res.json(500, {
          code:1,
          msg: "Error registering the student",
          msgES:"Error registrando el estudiante"
        });
      } else {
        if (teacher) {
          /*Compruebo si existe un estudiante con el email a registrar*/
          sails.models.user.query("SELECT * FROM USR_ROL WHERE EMAIL=? AND NAME='student' ", [studentEmail], function(error, results) {
            if (error) {
              console.log(error);
              return res.json(500, {
                code:2,
                msg: "Error registering the student",
                msgES:"Error registrando el estudiante"
              });
            } else {
              if (results[0]) {
                /*Registro al estudiante en el curso*/
                sails.models.usrcou.create({
                  email: studentEmail,
                  idCourse: idCourse,
                  status: 's'
                }).exec(function(err, recordCreated) {
                  if (err) {
                    console.log(err);
                    return res.json(500, {
                      code:3,
                      msg: "Error registering the student",
                      msgES:"Error registrando el estudiante"
                    });
                  } else {
                    /*Asignacion de las pruebas del curso al cual acaba de ser registrado el estudiante*/
                    sails.models.usrtes.query("INSERT INTO USR_TES (EMAIL, IDTEST, STATUSUSRTES,INTENTLEFT,SCORE) SELECT ?, T.IDTEST, 's', T.INTENTS, 0.0 FROM TEST T WHERE T.IDCOURSE=? ", [studentEmail, idCourse], function(error, callback) {
                      if (error) {
                        console.log(error);
                        return res.json(512, {
                          code:1,
                          msg: 'Error registering the student',
                          msgES:"Error registrando el estudiante"
                        });
                      } else {
                        return res.json(200, {code:1, msg: "Student registered", msgES:"Usuario registrado"});
                      }
                    });
                  }
                });
              } else {
                return res.json(400, {code:7, msg: "There is not an student with that email", msgES:"No existe un estudiante con ese email"});
              }
            }
          });
        } else {
          return res.json(403, {msg: "The user is not the owner of the course"});
        }
      }
    });
  },


  /**
  * @memberof module:Course
  * @function deleteCourse
  * @param  {JSON} req HTTP request object
  * @param  {JSON} req.body.user User deleting the course
  * @param  {string} req.body.user.email Email
  * @param  {JSON} req.body.course Course to be deleted
  * @param  {int} req.body.course.id Id
  * @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
  * @description Delete a course
  */
  deleteCourse: function(req, res) {
    if(!req.body.user){
      return res.json(400, {code:1, msg: "No user send", msgES:"Usuario no envíado"});
    }
    if (req.body.user.email) {
      var email = req.body.user.email;
    } else {
      return res.json(400, {code:2, msg: "No user's email send", msgES:"Email del usuario no envíado"});
    }

    if(!req.body.course){
      return res.json(400, {code:3, msg: "No course send", msgES:"Curso no envíado"});
    }
    if (req.body.course.id) {
      var courseId = req.body.course.id;
    } else {
      return res.json(400, {code:4, msg: "No course's id send", msgES:"Id del curso no envíado"});
    }
    sails.models.usrcou.findOne({
      email: email,
      status: 't',
      idCourse: courseId
    }).exec(function(err, teacher) {
      if (err) {
        return res.json(500, {
          code:1,
          msg: "Error deleting the course",
          msgES:"Error borrando el curso"
        });
      } else {
        if (teacher) {
          sails.models.course.destroy({
            id: courseId
          }).exec(function(err) {
            if (err) {
              return res.json(500, {
                code:2,
                msg: "Error deleting the course",
                msgES:"Error borrando el curso"
              });
            } else {
              return res.json(200, {
                code:1,
                msg: "Course deleted",
                msgES:"Curso eliminado"
              });
            }
          });
        } else {
          return res.json(403, {code:1, msg: "The user is not the owner of the course", msgES:"El usuario no es el creador del curso"});
        }
      }
    });
  },


  /**
  * @memberof module:Course
  * @function getCourseById
  * @param  {JSON} req HTTP request object
  * @param  {JSON} req.body.user User retrieving the course
  * @param  {string} req.body.user.email Email
  * @param  {JSON} req.body.course Course to be retrieved
  * @param  {int} req.body.course.id Id
  * @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
  * @description Retrieve the information of the course
  */
  getCourseById: function(req, res) {
    if(!req.body.user){
      return res.json(400, {code:1,msg: "No user send", msgES:"Usuario no envíado"});
    }
    if (req.body.user.email) {
      var email = req.body.user.email;
    } else {
      return res.json(400, {code:2,msg: "No email send", msgES:"Email no envíado"});
    }


    if(!req.body.course){
      return res.json(400, {code:3,msg: "No course send", msgES:"Curso no envíado"});
    }
    if (req.body.course.id) {
      var courseId = req.body.course.id;
    } else {
      return res.json(400, {code:4,msg: "No course\'s id send", msgES:"Id del curso no envíado"});
    }

    sails.models.usrcou.findOne({
      email: email,
      status: 't',
      idCourse: courseId
    }).exec(function(err, teacher) {
      if (err) {
        return res.json(500, {
          code:1,
          msg: "Error getting the course",
          msgES:"Error obteniendo el curso"
        });
      } else {
        if (teacher) {
          sails.models.course.findOne({
            id: courseId
          }).exec(function(err, courseFinded) {
            if (err) {
              return res.json(500, {
                code:2,
                msg: "Error getting the course",
                msgES:"Error obteniendo el curso"
              });
            } else {
              return res.json(200, {
                code:1,
                msg: "Course finded",
                msgES:"Curso encontrado",
                course: courseFinded
              });
            }
          });
        } else {
          return res.json(403, {code:1,msg: "The user is not the owner of the course", msgES:"El usuario no es el propietario del curso"});
        }
      }
    });

  },


  /**
  * @memberof module:Course
  * @function edit
  * @param  {JSON} req HTTP request object
  * @param  {JSON} req.body.user User retrieving the course
  * @param  {string} req.body.user.email Email
  * @param  {JSON} req.body.course Course to be retrieved
  * @param  {int} req.body.course.id Id
  * @param  {string} req.body.course.name New name of the course
  * @param  {string} req.body.course.description New description of the course
  * @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
  * @description Update the information of a course
  */
  edit: function(req, res) {
    if(!req.body.user){
      return res.json(400, {code:1,msg: "No user send", msgES:"Usuario no envíado"});
    }
    if (req.body.user.email) {
      var email = req.body.user.email;
    } else {
      return res.json(400, {code:2,msg: "No user's email send", msgES:"Email no envíado"});
    }
    if(!req.body.course){
      return res.json(400, {code:3,msg: "No course send", msgES:"Curso no envíado"});
    }
    if (req.body.course.id) {
      var courseId = req.body.course.id;
    } else {
      return res.json(400, {code:4,msg: "No course's id send", msgES:"Id del curso no envíado"});
    }

    if (req.body.course.name) {
      var courseName = req.body.course.name;
    } else {
      return res.json(400, {code:5,msg: "No course's name send", msgES:"Nombre del curso no envíado"});
    }

    if (req.body.course.description) {
      var courseDescription = req.body.course.description;
    } else {
      var courseDescription = null;
    }
    sails.models.usrcou.findOne({
      email: email,
      status: 't',
      idCourse: courseId
    }).exec(function(err, teacher) {
      if (err) {
        return res.json(500, {
          code:1,
          msg: "Error updating the course",
          msgES:"Error al actualizar el curso"
        });
      } else {
        if (teacher) {
          sails.models.course.update({
            id: courseId
          }, {
            name: courseName,
            description: courseDescription
          }).exec(function(err, courseUpdated) {
            if (err) {
              return res.json(500, {
                code:2,
                msg: "Error updating the course",
                msgES:"Error al actualizar el curso"
              });
            } else {
              return res.json(200, {
                code:1,
                msg: "Course updated",
                msgES:"Curso actualizado"
              });
            }
          });
        } else {
          return res.json(403, {code:1,msg: "The user is not the owner of the course", msgES:"El usuario no es el propietario del curso"});
        }
      }
    });

  },

  /**
  * @memberof module:Course
  * @function clone
  * @param  {JSON} req HTTP request object
  * @param  {JSON} req.body.user User retrieving the course
  * @param  {string} req.body.user.email Email
  * @param  {JSON} req.body.course Course to be retrieved
  * @param  {int} req.body.course.id Id
  * @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
  * @description Clone the course information in a new one, including the tests
  */
  clone: function(req, res) {
    var responseSend = false;
    if (!req.body.user) {
      return res.json(400, {code:1,msg: "No user send", msgES:"Usuario no envíado"});
    }
    if (req.body.user.email) {
      var email = req.body.user.email;
    } else {
      return res.json(400, {code:2,msg: "No email send", msgES:"Email no envíado"});
    }
    if (!req.body.course) {
      return res.json(400, {code:3,msg: "No course send", msgES:"Curso no envíado"});
    }
    if (req.body.course.id) {
      var courseId = req.body.course.id;
    } else {
      return res.json(400, {code:4,msg: "No course id send", msgES:"Id del curso no envíado"});
    }

    /*Check if the user is the owner of the course to be cloned*/
    sails.models.usrcou.findOne({
      email: email,
      idCourse: courseId,
      status: "t"
    })
    .then(function(finded) {
      if (finded) {
        /*retrieved course data*/
        sails.models.course.findOne({
          idCourse: courseId
        })
        .then(function(courseFinded) {
          /*Create the new course*/
          sails.models.course.create({
            description: courseFinded.description,
            name: courseFinded.name,
            createdBy: courseFinded.createdBy
          })
          .then(function(courseCreated) {

            sails.models.usrcou.create({
              email: email,
              idCourse: courseCreated.id,
              status: 't'
            })
            .catch(function(error) {
              console.log(error);
              if (responseSend == false) {
                responseSend = true;
                return res.json(500, {
                  code:1,
                  msg: "Error cloning the course",
                  msgES:"Error clonando el curso"
                });
              }
            })
            var mappedTests = [];
            var testPromises = [];
            /*Create all the test of the old course on the new one*/
            /*Get all test of the course*/
            var testQueryPromisified = Promise.promisify(sails.models.test.query);
            var selectTestsPromise = testQueryPromisified("SELECT T.IDTEST AS id, T.IDCOURSE AS idCourse, T.TITLE AS title, T.DESCRIPTIONTEST AS description, T.CREATEDBYTEST AS createdBy, T.STATUS AS status, T.STARTDATETIME AS startDateTime, T.FINISHDATETIME AS finishDateTime, 0 AS averageScore, T.INTENTS AS intents  FROM TEST T WHERE  T.IDCOURSE=?", [courseId])
            .then(function(oldTests) {
              /*Insert the old test in the new course as new tests*/

              for (var i = 0; i < oldTests.length; i++) {
                var oldTest = JSON.parse(JSON.stringify(oldTests[i]));
                var createTestPromise = sails.controllers.test.createCloneTest(mappedTests, oldTest, courseCreated.id);
                testPromises.push(createTestPromise);
              }


              Promise.all(testPromises)
              .then(function() {
                /*In table USR_TES insert the owner of the tests created*/
                var testUserPromises = []
                for (var i = 0; i < mappedTests.length; i++) {
                  var testUserPromise = sails.models.usrtes.create({
                    email: email,
                    idTest: mappedTests[i].newTest.id,
                    status: 't'
                  });
                  testUserPromises.push(testUserPromise);
                }
                Promise.all(testUserPromises)
                .then(function() {
                  var setOldQuestionsPromises = [];
                  for (var i = 0; i < mappedTests.length; i++) {
                    var promiseQuestion = sails.controllers.question.setOldQuestionsClone(mappedTests[i].oldTest);
                    setOldQuestionsPromises.push(promiseQuestion);
                  }
                  Promise.all(setOldQuestionsPromises)
                  .then(function() {
                    var createNewQuestionsPromises = []
                    for (var i = 0; i < mappedTests.length; i++) {
                      mappedTests[i].newTest.questions = [];
                      for (var j = 0; j < mappedTests[i].oldTest.questions.length; j++) {
                        var promiseQuestion = sails.controllers.question.createNewQuestionClone(mappedTests[i].newTest, mappedTests[i].oldTest.questions[j]);
                        createNewQuestionsPromises.push(promiseQuestion);
                      }
                    }

                    Promise.all(createNewQuestionsPromises)
                    .then(function() {

                      var setOldOptionsPromises = [];
                      for (var i = 0; i < mappedTests.length; i++) {
                        for (var j = 0; j < mappedTests[i].oldTest.questions.length; j++) {
                          var promise = sails.controllers.option.setOldOptionsClone(mappedTests[i].oldTest.questions[j]);
                          setOldOptionsPromises.push(promise);
                        }
                      }
                      Promise.all(setOldOptionsPromises)
                      .then(function() {

                        var createNewOptionsPromises = [];
                        for (var i = 0; i < mappedTests.length; i++) {
                          for (var j = 0; j < mappedTests[i].oldTest.questions.length; j++) {
                            for (var k = 0; k < mappedTests[i].oldTest.questions[j].options.length; k++) {
                              var promise = sails.controllers.option.createNewOptionClone(mappedTests[i].newTest.questions[j], mappedTests[i].oldTest.questions[j].options[k]);
                              createNewOptionsPromises.push(promise);
                            }
                          }
                        }
                        Promise.all(createNewOptionsPromises)
                        .then(function() {
                          if (responseSend == false) {
                            responseSend = true;
                            return res.json(200, {code:1,msg: "Course cloned", msgES:"Curso clonado"});
                          }
                        })
                        .catch(function(error) {
                          console.log(error);
                          if (responseSend == false) {
                            responseSend = true;
                            return res.json(500, {code:2, msg: "Error cloning the course", msgES:"Error clonando el curso"});
                          }
                        })
                      })
                      .catch(function(error) {
                        console.log(error);
                        if (responseSend == false) {
                          responseSend = true;
                          return res.json(500, {code:3, msg: "Error cloning the course", msgES:"Error clonando el curso"});
                        }
                      })
                    })
                    .catch(function(error) {
                      if (responseSend == false) {
                        responseSend = true;
                        return res.json(500, {code:4,msg: "Error cloning the course",msgES:"Error clonando el curso"});
                      }
                    })
                  })
                  .catch(function(error) {
                    console.log(error);
                    if (responseSend == false) {
                      responseSend = true;
                      return res.json(500, {code:5,msg: "Error cloning the course",msgES:"Error clonando el curso"});
                    }
                  })


                })
                .catch(function(error) {
                  console.log(error);
                  if (responseSend == false) {
                    responseSend = true;
                    return res.json(500, {code:6,msg: "Error cloning the course", msgES:"Error clonando el curso"});
                  }
                })

              })
              .catch(function(error) {
                if (responseSend == false) {
                  responseSend = true;
                  return res.json(500, {code:7,msg: "Error cloning the course", msgES:"Error clonando el curso"});
                }
              })

            })
            .catch(function(error) {
              if (responseSend == false) {
                responseSend = true;
                return res.json(500, {code:8,msg: "Error cloning the course", msgES:"Error clonando el curso"});
              }
            })
          })
          .catch(function(error) {
            console.log(error);
            if (responseSend == false) {
              responseSend = true;
              return res.json(500, {code:9,msg: "Error cloning the course", msgES:"Error clonando el curso"});
            }
          })
        })
        .catch(function(error) {

          if (responseSend == false) {
            responseSend = true;
            return res.json(500, {code:10,msg: "Error cloning the course", msgES:"Error clonando el curso"});
          }
        })

      } else {
        if (responseSend == false) {
          responseSend = true;
          return res.json(403, {code:1, msg: "The user is not the owner of the course", msgES:"El suuario no es el propietario del curso"});
        }
      }
    })
    .catch(function(error) {
      if (responseSend == false) {
        responseSend = true;
        return res.json(500, {code:11, msg: "Error cloning the course", msgES:"Error clonando el curso"});
      }
    })
  },


  /**
  * @memberof module:Course
  * @function deleteStudent
  * @param  {JSON} req HTTP request object
  * @param  {string} req.body.teacherEmail Email of the teacher of the course
  * @param  {string} req.body.studentEmail Email of a student of the course
  * @param  {string} req.body.idCourse Id of the course
  * @param  {JSON} res HTTP response object
	* @returns  {JSON} HTTP response object
  * @description Delete an student from a course
  */
  deleteStudent: function(req, res) {
    if (req.body.studentEmail) {
      var studentEmail = req.body.studentEmail;
    } else {
      return res.json(400, {code:1,msg: "No student email send", msgES:"Email del estudiante no envíado"});
    }
    if (req.body.teacherEmail) {
      var teacherEmail = req.body.teacherEmail;
    } else {
      return res.json(400, {code:2,msg: "No teacher email send", msgES:"Email del profesor no envíado"});
    }
    if (req.body.idCourse) {
      var idCourse = req.body.idCourse;
    } else {
      return res.json(400, {code:3,msg: "No course send", msgES:"Id del curso no envíado"});
    }
    var promises = [];
    var promiseFindUC = sails.models.usrcou.findOne({
      email: teacherEmail,
      idCourse: idCourse,
      status: 't'
    })
    .then(function(finded) {
      if (finded) {
        var promiseDestroyUC = sails.models.usrcou.destroy({
          email: studentEmail,
          status: 's',
          idCourse: idCourse
        });
        promises.push(promiseDestroyUC);
        var promiseFindTests = sails.models.test.find({
          idCourse: idCourse
        })
        .then(function(tests) {
          var promises2 = [];
          for (var i = 0; i < tests.length; i++) {
            var promiseDestroyUT = sails.models.usrtes.destroy({
              email: studentEmail,
              status: 's',
              idTest: tests[i].id
            });
            promises2.push(promiseDestroyUT);
            var queryPromisified = Promise.promisify(sails.models.test.query);
            var promiseDestroyUO = queryPromisified("DELETE FROM USR_OPT WHERE EMAIL=? AND IDOPTION IN ( SELECT IDOPTION  FROM (SELECT O.IDOPTION FROM OPTIO O, QUESTION Q WHERE O.IDQUESTION=Q.IDQUESTION AND Q.IDTEST=?) AS TEMPORALOPT)", [studentEmail, tests[i].id])
            promises2.push(promiseDestroyUO);
          }
          return promises2;
        })
        promises.push(promiseFindTests);
        Promise.all(promises)
        .then(function(inputs) {
          Promise.all(inputs[1])
          .then(function() {
            return res.json(200, {
              code:1,
              msg: "User deleted",
              msgES:"Usuario eliminado"
            });
          })
          .catch(function(error) {
            console.log(error);
            return res.json(501, {
              code:1,
              msg: "Error deleting the user",
              msgES:"Error eliminando el usuario"
            });
          })
        })
        .catch(function(error) {
          console.log(error);
          return res.json(500, {
            code:1,
            msg: "Error deleting the user",
            msgES:"Error eliminado el usuario"
          });
        })
      }
    })


  }

};
