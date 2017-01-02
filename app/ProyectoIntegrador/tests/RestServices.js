var supertest = require("supertest");
var fs=require('fs');
var assert = require('assert');
var contents=fs.readFileSync("./tests/config.txt",'utf8').toString();
var matchings=contents.match(/url="(.{1,})"/);
var url=matchings[1];
var idCourseCreated;
var idTestCreated;
var idQuestionCreated;


describe('User controller services', function() {
  describe('Register user', function() {
    describe('Without user', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/user/register')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/user/register')
        .send({
          user:{
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });

    describe('Without password', function() {
      it('respond with status 400 code:3', function(done) {
        supertest(url)
        .post('/user/register')
        .send({
          user:{
            email:"test@test.com"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });

    describe('Without security question 1', function() {
      it('respond with status 400 code:4', function(done) {
        supertest(url)
        .post('/user/register')
        .send({
          user:{
            email:"test@test.com",
            password:"test"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });

    describe("Without secuity question 1's question or answer", function() {
      it('respond with status 400 code:5', function(done) {
        supertest(url)
        .post('/user/register')
        .send({
          user:{
            email:"test@test.com",
            password:"test",
            securityQuestion1:{
            }
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,5);
          done();
        });
      });
    });

    describe("Without secuity question 2", function() {
      it('respond with status 400 code:6', function(done) {
        supertest(url)
        .post('/user/register')
        .send({
          user:{
            email:"test@test.com",
            password:"test",
            securityQuestion1:{
              question:1,
              answer:"text"
            }
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,6);
          done();
        });
      });
    });

    describe("Without secuity question 2", function() {
      it('respond with status 400 code:7', function(done) {
        supertest(url)
        .post('/user/register')
        .send({
          user:{
            email:"test@test.com",
            password:"test",
            securityQuestion1:{
              question:1,
              answer:"text"
            },
            securityQuestion2:{

            }
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,7);
          done();
        });
      });
    });

    describe("With security question 1 equal security question 2", function() {
      it('respond with status 400 code:8', function(done) {
        supertest(url)
        .post('/user/register')
        .send({
          user:{
            email:"test@test.com",
            password:"test",
            securityQuestion1:{
              question:1,
              answer:"1"
            },
            securityQuestion2:{
              question:1,
              answer:"2"
            }
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,8);
          done();
        });
      });
    });

    describe("User register course with valid data", function() {
      it('respond with status 201', function(done) {
        supertest(url)
        .post('/user/register')
        .send({
          user:{
            email:"test@test.com",
            password:"test",
            roles:["student", "teacher"],
            securityQuestion1:{
              question:1,
              answer:"1"
            },
            securityQuestion2:{
              question:2,
              answer:"2"
            }
          }
        })
        .expect(201,done);
      });
    });
  });
  describe('Login user', function() {
    describe('Without user', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/login')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/login')
        .send({
          user:{
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });

    describe('Without password', function() {
      it('respond with status 400 code:3', function(done) {
        supertest(url)
        .post('/login')
        .send({
          user:{
            email:"test@test.com"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });

    describe('Invalid credentials', function() {
      it('respond with status 400 code:4', function(done) {
        supertest(url)
        .post('/login')
        .send({
          user:{
            email:"test@test.com",
            password:"invalid"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });
    describe('Invalid credentials', function() {
      it('respond with status:403', function(done) {
        supertest(url)
        .post('/login')
        .send({
          user:{
            email:"test@test.com",
            password:"test",
            role:"invalid"
          }
        })
        .expect(403,done);
      });
    });
    describe('Valid credentials', function() {
      it('respond with status 200', function(done) {
        supertest(url)
        .post('/login')
        .send({
          user:{
            email:"test@test.com",
            password:"test",
            role:"teacher"
          }
        })
        .expect(200,done);
      });
    });
  });
  describe('Check user data for password and pin change', function() {
    describe('Without email', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/user/checkUser')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without security question 1', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/user/checkUser')
        .send({
          email:"test@test.com"
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });
    describe('Without security question 2', function() {
      it('respond with status 400 code:3', function(done) {
        supertest(url)
        .post('/user/checkUser')
        .send({
          email:"test@test.com",
          securityQuestion1:{
            question:1,
            answer:"1"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });


    describe('Invalid data', function() {
      it('respond with status 400 code:4', function(done) {
        supertest(url)
        .post('/user/checkUser')
        .send({
          email:"test@test.com",
          securityQuestion1:{
            question:1,
            answer:"2"
          },
          securityQuestion2:{
            question:2,
            answer:"1"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });

    describe('Valid data', function() {
      it('respond with status 200', function(done) {
        supertest(url)
        .post('/user/checkUser')
        .send({
          email:"test@test.com",
          securityQuestion1:{
            question:1,
            answer:"1"
          },
          securityQuestion2:{
            question:2,
            answer:"2"
          }
        })
        .expect(200,done);
      });
    });
  });
  describe('Change password and pin', function() {
    describe('Without email', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/user/updateSecurityInfo')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without new password', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/user/updateSecurityInfo')
        .send({
          email:"test@test.com"
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });
    describe('With the new securoty questions being the same', function() {
      it('respond with status 400 code 3', function(done) {
        supertest(url)
        .post('/user/updateSecurityInfo')
        .send({
          email:"test@test.com",
          password:"test",
          securityQuestion1:{
            question:1,
            answer:"1"
          },
          securityQuestion2:{
            question:1,
            answer:"2"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });

    describe('With the new securoty questions being the same', function() {
      it('respond with status 400 code 3', function(done) {
        supertest(url)
        .post('/user/updateSecurityInfo')
        .send({
          email:"test@test.com",
          password:"newTest",
          securityQuestion1:{
            question:1,
            answer:"1"
          },
          securityQuestion2:{
            question:2,
            answer:"2"
          }
        })
        .expect(200,done)
      });
    });
  });
});

describe('Course controller services', function() {
  describe('Course register', function() {
    describe('Teacher without email register course with valid data', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/course/register')
        .send({
          course:{
            name:"Arquitectura Computadores",
            description:"Curso 2016-B"
          },
          user:{
            role:"teacher"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });

    describe('Student register course with valid data', function() {
      it('respond with status:403 code:2', function(done) {
        supertest(url)
        .post('/course/register')
        .send({
          course:{
            name:"Arquitectura Computadores",
            description:"Curso 2016-B"
          },
          user:{
            email:"test@test.com",
            role:"student"
          }
        })
        .expect(403)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });

    describe('Teacher without role register course with valid data', function() {
      it('respond with status:403 code:3', function(done) {
        supertest(url)
        .post('/course/register')
        .send({
          course:{
            name:"Arquitectura Computadores",
            description:"Curso 2016-B"
          },
          user:{
            email:"test@test.com"
          }
        })
        .expect(403)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });


    describe('Teacher register course without name', function() {
      it('respond with status 400 code:4', function(done) {
        supertest(url)
        .post('/course/register')
        .send({
          course:{
            description:"Curso 2016-B"
          },
          user:{
            email:"test@test.com",
            role:"teacher"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });

    describe('Teacher register course with valid data', function() {
      it('respond with status 201 : Course created', function(done) {
        supertest(url)
        .post('/course/register')
        .send({
          course:{
            name:"Test Course",
            description:"Description test course"
          },
          user:{
            email:"test@test.com",
            role:"teacher"
          }
        })
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          var newContent=contents.replace(/idCourse=\d{1,}/, "idCourse="+res.body.course.id);
          fs.writeFileSync("./tests/config.txt",newContent);
          idCourseCreated=res.body.course.id;
          done();
        });
      });
    });
  });
  describe('Get courses created by user', function() {
    describe('Without user', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/course/createdByUser')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/course/createdByUser')
        .send({
          user:{
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });

    describe('Valid data', function() {
      it('respond with status 200', function(done) {
        supertest(url)
        .post('/course/createdByUser')
        .send({
          user:{
            email:"test@test.com"
          }
        })
        .expect(200,done);
      });
    });
  });
  describe('Get courses by teacher', function() {
    describe('Without user', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/course/byTeacher')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/course/byTeacher')
        .send({
          user:{
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });

    describe('Valid data', function() {
      it('respond with status 200', function(done) {
        supertest(url)
        .post('/course/byTeacher')
        .send({
          user:{
            email:"test@test.com"
          }
        })
        .expect(200,done);
      });
    });
  });
  describe('Get courses by student', function() {
    describe('Without user', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/course/byStudent')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/course/byStudent')
        .send({
          user:{
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });

    describe('Valid data', function() {
      it('respond with status 200', function(done) {
        supertest(url)
        .post('/course/byStudent')
        .send({
          user:{
            email:"test@test.com"
          }
        })
        .expect(200,done);
      });
    });
  });
  describe('Register a student in a course', function() {
    describe('Without student\'s data', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/course/registerStudent')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without student\'s email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/course/registerStudent')
        .send({
          student:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });
    describe('Without course\'s data', function() {
      it('respond with status 400 code:3', function(done) {
        supertest(url)
        .post('/course/registerStudent')
        .send({
          student:{
            email:"test2@test.com"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });

    describe('Without course\'s id', function() {
      it('respond with status 400 code:4', function(done) {
        supertest(url)
        .post('/course/registerStudent')
        .send({
          student:{
            email:"test2@test.com"
          },
          course:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });

    describe('Without user\'s data', function() {
      it('respond with status 400 code:5', function(done) {
        supertest(url)
        .post('/course/registerStudent')
        .send({
          student:{
            email:"test2@test.com"
          },
          course:{
            id:idCourseCreated
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,5);
          done();
        });
      });
    });

    describe('Without user\'s email', function() {
      it('respond with status 400 code:6', function(done) {
        supertest(url)
        .post('/course/registerStudent')
        .send({
          student:{
            email:"test2@test.com"
          },
          course:{
            id:idCourseCreated
          },
          user:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,6);
          done();
        });
      });
    });

    describe('Without the user being the owner of the course', function() {
      it('respond with status:403', function(done) {
        supertest(url)
        .post('/course/registerStudent')
        .send({
          student:{
            email:"test2@test.com"
          },
          course:{
            id:idCourseCreated
          },
          user:{
            email:"test3@test.com"
          }
        })
        .expect(403,done);
      });
    });

    describe('Without the student being a user with the student role', function() {
      it('respond with status 204', function(done) {
        supertest(url)
        .post('/course/registerStudent')
        .send({
          student:{
            email:"test3@test.com"
          },
          course:{
            id:idCourseCreated
          },
          user:{
            email:"test@test.com"
          }
        })
        .expect(204,done);
      });
    });


    describe('With valid data', function() {
      it('respond with status 200', function(done) {
        supertest(url)
        .post('/course/registerStudent')
        .send({
          student:{
            email:"test2@test.com"
          },
          course:{
            id:idCourseCreated
          },
          user:{
            email:"test@test.com"
          }
        })
        .expect(200,done);
      });
    });
  });
  describe('Get course by id', function() {
    describe('Without user\'s data', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/course/getById')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });

    describe('Without user\'s email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/course/getById')
        .send({
          user:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });
    describe('Without course\'s data', function() {
      it('respond with status 400 code:3', function(done) {
        supertest(url)
        .post('/course/getById')
        .send({
          user:{
            email:"test@test.com"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });
    describe('Without course\'s id', function() {
      it('respond with status 400 code:4', function(done) {
        supertest(url)
        .post('/course/getById')
        .send({
          user:{
            email:"test@test.com"
          },
          course:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });

    describe('Without the user being the owner of the course', function() {
      it('respond with status:403', function(done) {
        supertest(url)
        .post('/course/getById')
        .send({
          user:{
            email:"test2@test.com"
          },
          course:{
            id:idCourseCreated
          }
        })
        .expect(403,done);
      });
    });
    describe('With valid data', function() {
      it('respond with status 200', function(done) {
        supertest(url)
        .post('/course/getById')
        .send({
          user:{
            email:"test@test.com"
          },
          course:{
            id:idCourseCreated
          }
        })
        .expect(200,done);
      });
    });
  });
  describe('Edit course', function() {
    describe('Without user\'s data', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/course/update')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/course/update')
        .send({
          user:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });

    describe('Without course\'s data', function() {
      it('respond with status 400 code:3', function(done) {
        supertest(url)
        .post('/course/update')
        .send({
          user:{
            email:"test@test.com"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });

    describe('Without course\'s id', function() {
      it('respond with status 400 code:4', function(done) {
        supertest(url)
        .post('/course/update')
        .send({
          user:{
            email:"test@test.com"
          },
          course:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });

    describe('Without course\'s name', function() {
      it('respond with status 400 code:5', function(done) {
        supertest(url)
        .post('/course/update')
        .send({
          user:{
            email:"test@test.com"
          },
          course:{
            id:idCourseCreated
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,5);
          done();
        });
      });
    });

    describe('Without the user being the owner of the course', function() {
      it('respond with status:403', function(done) {
        supertest(url)
        .post('/course/update')
        .send({
          user:{
            email:"test2@test.com"
          },
          course:{
            id:idCourseCreated,
            name:"New name",
            description:"New description"
          }
        })
        .expect(403,done);
      });
    });

    describe('With valid data', function() {
      it('respond with status 200', function(done) {
        supertest(url)
        .post('/course/update')
        .send({
          user:{
            email:"test@test.com"
          },
          course:{
            id:idCourseCreated,
            name:"New name",
            description:"New description"
          }
        })
        .expect(200,done);
      });
    });

  });
  describe('Clone course', function() {
    describe('Without user\'s data', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/course/clone')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/course/clone')
        .send({
          user:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });

    describe('Without course\'s data', function() {
      it('respond with status 400 code:3', function(done) {
        supertest(url)
        .post('/course/clone')
        .send({
          user:{
            email:"test@test.com"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });

    describe('Without course\'s id', function() {
      it('respond with status 400 code:4', function(done) {
        supertest(url)
        .post('/course/clone')
        .send({
          user:{
            email:"test@test.com"
          },
          course:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });
    describe('Without the user being the owner of the course', function() {
      it('respond with status:403', function(done) {
        supertest(url)
        .post('/course/clone')
        .send({
          user:{
            email:"test2@test.com"
          },
          course:{
            id:idCourseCreated
          }
        })
        .expect(403,done);
      });
    });
    describe('With valid data', function() {
      it('respond with status 200', function(done) {
        supertest(url)
        .post('/course/clone')
        .send({
          user:{
            email:"test@test.com"
          },
          course:{
            id:idCourseCreated
          }
        })
        .expect(200,done);
      });
    });
  });
});

describe('SecutiryQuestions controller services', function() {
  describe('Get all', function() {
    describe('Valid data', function() {

      it('respond with status 200', function(done) {
        supertest(url)
        .get('/securityQuestion/getAll')
        .send({
        })
        .expect(200,done);
      });

    });
  });
});

describe('Test controller services', function() {
  describe('Register test', function() {
    describe('Without a title', function() {
      it('respond with status:400 code:1', function(done) {
        supertest(url)
        .post('/test/register')
        .send({
          test:{
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without an owner', function() {
      it('respond with status:400 code:2', function(done) {
        supertest(url)
        .post('/test/register')
        .send({
          test:{
            title:"test"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });
    describe('Without a start date time', function() {
      it('respond with status:400 code:3', function(done) {
        supertest(url)
        .post('/test/register')
        .send({
          test:{
            title:"test",
            createdBy:"test@test.com"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });
    describe('Without a finish date time', function() {
      it('respond with status:400 code:4', function(done) {
        var startDateTime= new Date();
        startDateTime=startDateTime.toISOString();
        supertest(url)
        .post('/test/register')
        .send({
          test:{
            title:"test",
            createdBy:"test@test.com",
            startDateTime:startDateTime
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });

    describe('Without a course', function() {
      it('respond with status:400 code:5', function(done) {
        var startDateTime= new Date();
        startDateTime=startDateTime.toISOString();
        var finishDateTime= new Date();
        finishDateTime=finishDateTime.toISOString();
        supertest(url)
        .post('/test/register')
        .send({
          test:{
            title:"test",
            createdBy:"test@test.com",
            startDateTime:startDateTime,
            finishDateTime:finishDateTime
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,5);
          done();
        });
      });
    });
    describe('With the startDateTime being greater than the finishDateTime', function() {
      it('respond with status:400 code:6', function(done) {
        var startDateTime= new Date();
        startDateTime=startDateTime.toISOString();
        supertest(url)
        .post('/test/register')
        .send({
          test:{
            title:"test",
            createdBy:"test@test.com",
            startDateTime:startDateTime,
            finishDateTime:startDateTime,
            course:idCourseCreated
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,6);
          done();
        });
      });
    });
    describe('Without test', function() {
      it('respond with status:400 code:7', function(done) {
        var startDateTime= new Date();
        startDateTime=startDateTime.toISOString();
        supertest(url)
        .post('/test/register')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,7);
          done();
        });
      });
    });
    describe("Valid data: 1 Multiple choice question, 1 Fill question and 1 True or False question", function() {
      it('respond with status:200', function(done) {
        var startDateTime= new Date();
        startDateTime=startDateTime.toISOString();
        var finishDateTime= new Date();
        finishDateTime.setFullYear(finishDateTime.getFullYear()+1);
        finishDateTime=finishDateTime.toISOString();
        supertest(url)
        .post('/test/register')
        .send({
          test:{
            title:"test",
            createdBy:"test@test.com",
            startDateTime:startDateTime,
            finishDateTime:finishDateTime,
            course:idCourseCreated
          },
          multipleChoiceQuestions:[{text:"test",weighing:1,options:[{isCorrect:true,justification:"test",text:"test"}]}],
          fillQuestions:[{weighing:1,statements:[{text:'test'}], options:[{isCorrect:true,justification:'test',text:'test'}]}],
          trueFalseQuestions:[{justification:'test',option:'true',text:'test',weighing:1}]

        })
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          idTestCreated=res.body.test.id;
          idQuestionCreated=res.body.test.multipleChoiceQuestions[0].id;
          done();
        });
      });
    });
  });
  describe('Get tests by course and teacher', function() {
    describe('Without user\'s data', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/test/byCourseByTeacher')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/test/byCourseByTeacher')
        .send({
          user:{
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });

    describe('Without course\'s data', function() {
      it('respond with status 400 code:3', function(done) {
        supertest(url)
        .post('/test/byCourseByTeacher')
        .send({
          user:{
            email:'test@test.com'
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });

    describe('Without course\'s id', function() {
      it('respond with status 400 code:4', function(done) {
        supertest(url)
        .post('/test/byCourseByTeacher')
        .send({
          user:{
            email:'test@test.com'
          },
          course:{
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });
    describe('Without the user being the owner of the course', function() {
      it('respond with status:403', function(done) {
        supertest(url)
        .post('/test/byCourseByTeacher')
        .send({
          user:{
            email:'test2@test.com'
          },
          course:{
            id:idCourseCreated
          }
        })
        .expect(403,done);
      });
    });

    describe('With valid data', function() {
      it('respond with status 200', function(done) {
        supertest(url)
        .post('/test/byCourseByTeacher')
        .send({
          user:{
            email:'test@test.com'
          },
          course:{
            id:idCourseCreated
          }
        })
        .expect(200,done);
      });
    });

  });
  describe('Get tests by course and student', function() {
    describe('Without user\'s data', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/test/byCourseByStudent')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/test/byCourseByStudent')
        .send({
          user:{
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });

    describe('Without course\'s data', function() {
      it('respond with status 400 code:3', function(done) {
        supertest(url)
        .post('/test/byCourseByStudent')
        .send({
          user:{
            email:'test2@test.com'
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });

    describe('Without course\'s id', function() {
      it('respond with status 400 code:4', function(done) {
        supertest(url)
        .post('/test/byCourseByStudent')
        .send({
          user:{
            email:'test2@test.com'
          },
          course:{
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });
    describe('Without the user being the owner of the course', function() {
      it('respond with status:403', function(done) {
        supertest(url)
        .post('/test/byCourseByStudent')
        .send({
          user:{
            email:'test@test.com'
          },
          course:{
            id:idCourseCreated
          }
        })
        .expect(403,done);
      });
    });

    describe('With valid data', function() {
      it('respond with status 200', function(done) {
        supertest(url)
        .post('/test/byCourseByStudent')
        .send({
          user:{
            email:'test2@test.com'
          },
          course:{
            id:idCourseCreated
          }
        })
        .expect(200,done);
      });
    });

  });
  describe('Get tests by student', function() {
    describe('Without user\'s data', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/test/byStudent')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/test/byStudent')
        .send({
          user:{
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });

    describe('With valid data', function() {
      it('respond with status 200', function(done) {
        supertest(url)
        .post('/test/byStudent')
        .send({
          user:{
            email:'test@test.com'
          }
        })
        .expect(200,done);
      });
    });
  });
  describe('Get tests created by user', function() {
    describe('Without user\'s data', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/test/createdByUser')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/test/createdByUser')
        .send({
          user:{
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });

    describe('With valid data', function() {
      it('respond with status 200', function(done) {
        supertest(url)
        .post('/test/createdByUser')
        .send({
          user:{
            email:'test@test.com'
          }
        })
        .expect(200,done);
      });
    });

  });
  describe('Get test by id', function() {
    describe('Without user\'s data', function() {
      it('respond with status:400 code:1', function(done) {
        supertest(url)
        .post('/test/getTestById')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status:400 code:2', function(done) {
        supertest(url)
        .post('/test/getTestById')
        .send({
          user:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });
    describe('Without test\'s data', function() {
      it('respond with status:400 code:3', function(done) {
        supertest(url)
        .post('/test/getTestById')
        .send({
          user:{
            email:'test@test.com'
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });
    describe('Without test\'s id', function() {
      it('respond with status:400 code:4', function(done) {
        supertest(url)
        .post('/test/getTestById')
        .send({
          user:{
            email:'test@test.com'
          },
          test:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });

    describe('Without the user being the owner of the test', function() {
      it('respond with status:403', function(done) {
        supertest(url)
        .post('/test/getTestById')
        .send({
          user:{
            email:'test2@test.com'
          },
          test:{
            id:idTestCreated
          }
        })
        .expect(403,done);
      });
    });

    describe('With valid data', function() {
      it('respond with status:200', function(done) {
        supertest(url)
        .post('/test/getTestById')
        .send({
          user:{
            email:'test@test.com'
          },
          test:{
            id:idTestCreated
          }
        })
        .expect(200,done);
      });
    });
  });
  describe('Get test without questions by id', function() {
    describe('Without user\'s data', function() {
      it('respond with status:400 code:1', function(done) {
        supertest(url)
        .post('/test/getTestByIdWOQuestions')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status:400 code:2', function(done) {
        supertest(url)
        .post('/test/getTestByIdWOQuestions')
        .send({
          user:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });
    describe('Without test\'s data', function() {
      it('respond with status:400 code:3', function(done) {
        supertest(url)
        .post('/test/getTestByIdWOQuestions')
        .send({
          user:{
            email:'test@test.com'
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });
    describe('Without test\'s id', function() {
      it('respond with status:400 code:4', function(done) {
        supertest(url)
        .post('/test/getTestByIdWOQuestions')
        .send({
          user:{
            email:'test@test.com'
          },
          test:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });

    describe('Without the user being the owner of the test', function() {
      it('respond with status:403', function(done) {
        supertest(url)
        .post('/test/getTestByIdWOQuestions')
        .send({
          user:{
            email:'test2@test.com'
          },
          test:{
            id:idTestCreated
          }
        })
        .expect(403,done);
      });
    });

    describe('With valid data', function() {
      it('respond with status:200', function(done) {
        supertest(url)
        .post('/test/getTestByIdWOQuestions')
        .send({
          user:{
            email:'test@test.com'
          },
          test:{
            id:idTestCreated
          }
        })
        .expect(200,done);
      });
    });
  });
  describe('Get students by test id', function() {
    describe('Without user\'s data', function() {
      it('respond with status:400 code:1', function(done) {
        supertest(url)
        .post('/test/getStudentsByTestId')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status:400 code:2', function(done) {
        supertest(url)
        .post('/test/getStudentsByTestId')
        .send({
          user:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });
    describe('Without test\'s data', function() {
      it('respond with status:400 code:3', function(done) {
        supertest(url)
        .post('/test/getStudentsByTestId')
        .send({
          user:{
            email:'test@test.com'
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });
    describe('Without test\'s id', function() {
      it('respond with status:400 code:4', function(done) {
        supertest(url)
        .post('/test/getStudentsByTestId')
        .send({
          user:{
            email:'test@test.com'
          },
          test:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });

    describe('Without the user being the owner of the test', function() {
      it('respond with status:403', function(done) {
        supertest(url)
        .post('/test/getStudentsByTestId')
        .send({
          user:{
            email:'test2@test.com'
          },
          test:{
            id:idTestCreated
          }
        })
        .expect(403,done);
      });
    });

    describe('With valid data', function() {
      it('respond with status:200', function(done) {
        supertest(url)
        .post('/test/getStudentsByTestId')
        .send({
          user:{
            email:'test@test.com'
          },
          test:{
            id:idTestCreated
          }
        })
        .expect(200,done);
      });
    });

  });
  describe('Get test by id for student', function() {
    describe('Without user\'s data', function() {
      it('respond with status:400 code:1', function(done) {
        supertest(url)
        .post('/test/getTestByIdForStudent')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status:400 code:2', function(done) {
        supertest(url)
        .post('/test/getTestByIdForStudent')
        .send({
          user:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });
    describe('Without test\'s data', function() {
      it('respond with status:400 code:3', function(done) {
        supertest(url)
        .post('/test/getTestByIdForStudent')
        .send({
          user:{
            email:'test@test.com'
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });
    describe('Without test\'s id', function() {
      it('respond with status:400 code:4', function(done) {
        supertest(url)
        .post('/test/getTestByIdForStudent')
        .send({
          user:{
            email:'test@test.com'
          },
          test:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });

    describe('Without the user being a student of the test', function() {
      it('respond with status:403', function(done) {
        supertest(url)
        .post('/test/getTestByIdForStudent')
        .send({
          user:{
            email:'test@test.com'
          },
          test:{
            id:idTestCreated
          }
        })
        .expect(403,done);
      });
    });

    describe('With valid data', function() {
      it('respond with status:200', function(done) {
        supertest(url)
        .post('/test/getTestByIdForStudent')
        .send({
          user:{
            email:'test2@test.com'
          },
          test:{
            id:idTestCreated
          }
        })
        .expect(200,done);
      });
    });

  });
  describe('Update test', function() {
    describe('Without a test', function() {
      it('respond with status:400 code:1', function(done) {
        supertest(url)
        .post('/test/update')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without id', function() {
      it('respond with status:400 code:2', function(done) {
        supertest(url)
        .post('/test/update')
        .send({
          test:{
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });
    describe('Without title', function() {
      it('respond with status:400 code:3', function(done) {
        supertest(url)
        .post('/test/update')
        .send({
          test:{
            id:idTestCreated
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });
    describe('Without an owner', function() {
      it('respond with status:400 code:4', function(done) {
        supertest(url)
        .post('/test/update')
        .send({
          test:{
            id:idTestCreated,
            title:"test"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });
    describe('Without a start date time', function() {
      it('respond with status:400 code:5', function(done) {
        supertest(url)
        .post('/test/update')
        .send({
          test:{
            id:idTestCreated,
            title:"test",
            createdBy:"test@test.com"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,5);
          done();
        });
      });
    });
    describe('Without a finish date time', function() {
      it('respond with status:400 code:6', function(done) {
        var startDateTime= new Date();
        startDateTime=startDateTime.toISOString();
        supertest(url)
        .post('/test/update')
        .send({
          test:{
            id:idTestCreated,
            title:"test",
            createdBy:"test@test.com",
            startDateTime:startDateTime
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,6);
          done();
        });
      });
    });

    describe('Without a course', function() {
      it('respond with status:400 code:7', function(done) {
        var startDateTime= new Date();
        startDateTime=startDateTime.toISOString();
        var finishDateTime= new Date();
        finishDateTime=finishDateTime.toISOString();
        supertest(url)
        .post('/test/update')
        .send({
          test:{
            id:idTestCreated,
            title:"test",
            createdBy:"test@test.com",
            startDateTime:startDateTime,
            finishDateTime:finishDateTime
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,7);
          done();
        });
      });
    });
    describe('With the startDateTime being greater than the finishDateTime', function() {
      it('respond with status:400 code:8', function(done) {
        var startDateTime= new Date();
        startDateTime=startDateTime.toISOString();
        supertest(url)
        .post('/test/update')
        .send({
          test:{
            id:idTestCreated,
            title:"test",
            createdBy:"test@test.com",
            startDateTime:startDateTime,
            finishDateTime:startDateTime,
            course:idCourseCreated
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,8);
          done();
        });
      });
    });
    describe("Valid data: 1 Multiple choice question, 1 Fill question and 1 True or False question", function() {
      it('respond with status:200', function(done) {
        var startDateTime= new Date();
        startDateTime=startDateTime.toISOString();
        var finishDateTime= new Date();
        finishDateTime.setFullYear(finishDateTime.getFullYear()+1);
        finishDateTime=finishDateTime.toISOString();
        supertest(url)
        .post('/test/update')
        .send({
          test:{
            id:idTestCreated,
            title:"test",
            createdBy:"test@test.com",
            startDateTime:startDateTime,
            finishDateTime:finishDateTime,
            course:idCourseCreated
          },
          multipleChoiceQuestions:[{text:"test",weighing:1,options:[{isCorrect:true,justification:"test",text:"test"}]}],
          fillQuestions:[{weighing:1,statements:[{text:'test'}], options:[{isCorrect:true,justification:'test',text:'test'}]}],
          trueFalseQuestions:[{justification:'test',option:'true',text:'test',weighing:1}]

        })
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
      });
    });
  });
  describe('Register test taken', function() {
    describe('Without a test', function() {
      it('respond with status:400 code:1', function(done) {
        supertest(url)
        .post('/test/registerTakenTest')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without a test\'s id', function() {
      it('respond with status:400 code:2', function(done) {
        supertest(url)
        .post('/test/registerTakenTest')
        .send({
          test:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });
    describe('Without user', function() {
      it('respond with status:400 code:3', function(done) {
        supertest(url)
        .post('/test/registerTakenTest')
        .send({
          test:{
            id:idTestCreated
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });

    describe('Without user\'s email', function() {
      it('respond with status:400 code:4', function(done) {
        supertest(url)
        .post('/test/registerTakenTest')
        .send({
          test:{
            id:idTestCreated
          },
          user:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });


    describe('Without test\'s questions', function() {
      it('respond with status:400 code:5', function(done) {
        supertest(url)
        .post('/test/registerTakenTest')
        .send({
          test:{
            id:idTestCreated
          },
          user:{
            email:"test2@test.com"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,5);
          done();
        });
      });
    });
    describe('With valid data', function() {
      it('respond with status:200', function(done) {
        supertest(url)
        .post('/test/registerTakenTest')
        .send({
          test:{
            id:idTestCreated,
            questions:[{options:[{isCorrect:true, isSelected:false}]}]
          },
          user:{
            email:"test2@test.com"
          }
        })
        .expect(200,done);
      });
    });

  });
});

describe('Question controller services', function() {
  describe('Clone question', function() {
    describe('Without user\'s data', function() {
      it('respond with status:400 code:1', function(done) {
        supertest(url)
        .post('/test/question/clone')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status:400 code:2', function(done) {
        supertest(url)
        .post('/test/question/clone')
        .send({
          user:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });
    describe('Without test\'s data', function() {
      it('respond with status:400 code:3', function(done) {
        supertest(url)
        .post('/test/question/clone')
        .send({
          user:{
            email:'test@test.com'
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });
    describe('Without test\'s id', function() {
      it('respond with status:400 code:4', function(done) {
        supertest(url)
        .post('/test/question/clone')
        .send({
          user:{
            email:'test@test.com'
          },
          test:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });

    describe('Without question\'s data', function() {
      it('respond with status:400 code:5', function(done) {
        supertest(url)
        .post('/test/question/clone')
        .send({
          user:{
            email:'test@test.com'
          },
          test:{
            id:idTestCreated
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,5);
          done();
        });
      });
    });

    describe('Without the user being the owner of the owner of the question', function() {
      it('respond with status:403', function(done) {
        supertest(url)
        .post('/test/question/clone')
        .send({
          user:{
            email:'test2@test.com'
          },
          test:{
            id:idTestCreated
          },
          question:{
          }
        })
        .expect(403,done);
      });
    });

    describe('With valid data', function() {
      it('respond with status:200', function(done) {
        supertest(url)
        .post('/test/question/clone')
        .send({
          user:{
            email:'test@test.com'
          },
          test:{
            id:idTestCreated
          },
          question:{
            type:"multipleCh",
            text:"test",
            weighing:1,
            options:[
              {isCorrect:true,
                justification:"test",
                text:"test"
              }
            ]
          }
        })
        .expect(200,done);
      });
    });


  });
  describe('Delete question', function() {
    describe('Without question\'s id', function() {
      it('respond with status:400', function(done) {
        supertest(url)
        .post('/question/delete')
        .send({
        })
        .expect(400,done);
      });
    });
    describe('With valid data', function() {
      it('respond with status:200', function(done) {
        supertest(url)
        .post('/question/delete')
        .send({
          id:idQuestionCreated
        })
        .expect(200,done);
      });
    });

  });
});

describe('User controller services', function() {
  describe('Get students by course', function() {
    describe('Without user\'s data', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/user/studentsByCourse')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/user/studentsByCourse')
        .send({
          user:{
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });

    describe('Without course\'s data', function() {
      it('respond with status 400 code:3', function(done) {
        supertest(url)
        .post('/user/studentsByCourse')
        .send({
          user:{
            email:'test@test.com'
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });

    describe('Without course\'s id', function() {
      it('respond with status 400 code:4', function(done) {
        supertest(url)
        .post('/user/studentsByCourse')
        .send({
          user:{
            email:'test@test.com'
          },
          course:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });

    describe('Without the user being the owner of the course', function() {
      it('respond with status:403', function(done) {
        supertest(url)
        .post('/user/studentsByCourse')
        .send({
          user:{
            email:'test2@test.com'
          },
          course:{
            id:idCourseCreated
          }
        })
        .expect(403,done);
      });
    });
    describe('With valid data', function() {
      it('respond with status 200', function(done) {
        supertest(url)
        .post('/user/studentsByCourse')
        .send({
          user:{
            email:'test@test.com'
          },
          course:{
            id:idCourseCreated
          }
        })
        .expect(200,done);
      });
    });
  });
});

describe('Test controller services', function() {
  describe('Delete test', function() {
    describe('Without user\'s data', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/test/delete')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/test/delete')
        .send({
          user:{
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });
    describe('Without test\'s data', function() {
      it('respond with status 400 code:3', function(done) {
        supertest(url)
        .post('/test/delete')
        .send({
          user:{
            email:'test@test.com'
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });
    describe('Without test\'s id', function() {
      it('respond with status 400 code:4', function(done) {
        supertest(url)
        .post('/test/delete')
        .send({
          user:{
            email:'test@test.com'
          },
          test:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });
    describe('Without the user being the owner of the test', function() {
      it('respond with status:403', function(done) {
        supertest(url)
        .post('/test/delete')
        .send({
          user:{
            email:'test2@test.com'
          },
          test:{
            id:idTestCreated
          }
        })
        .expect(403,done);
      });
    });

    describe('With valid data', function() {
      it('respond with status 200', function(done) {
        supertest(url)
        .post('/test/delete')
        .send({
          user:{
            email:'test@test.com'
          },
          test:{
            id:idTestCreated
          }
        })
        .expect(200,done);
      });
    });

  });
});

describe("Course controller services", function() {
  describe('Delete student from course', function() {
    describe('Without student\'s email', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/course/deleteStudent')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without teacher\'s email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/course/deleteStudent')
        .send({
          studentEmail:"test2@test.com"
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });
    describe('Without course\'s id', function() {
      it('respond with status 400 code:3', function(done) {
        supertest(url)
        .post('/course/deleteStudent')
        .send({
          studentEmail:"test2@test.com",
          teacherEmail:"test@test.com"
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });
    describe('With valid data', function() {
      it('respond with status 200', function(done) {
        supertest(url)
        .post('/course/deleteStudent')
        .send({
          studentEmail:"test2@test.com",
          teacherEmail:"test@test.com",
          idCourse:idCourseCreated
        })
        .expect(200,done);
      });
    });
  });
  describe('Delete course', function() {
    describe('Without user\'s data', function() {
      it('respond with status 400 code:1', function(done) {
        supertest(url)
        .post('/course/delete')
        .send({
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,1);
          done();
        });
      });
    });
    describe('Without user\'s email', function() {
      it('respond with status 400 code:2', function(done) {
        supertest(url)
        .post('/course/delete')
        .send({
          user:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,2);
          done();
        });
      });
    });
    describe('Without course\'s data', function() {
      it('respond with status 400 code:3', function(done) {
        supertest(url)
        .post('/course/delete')
        .send({
          user:{
            email:"test@test.com"
          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,3);
          done();
        });
      });
    });
    describe('Without course\'s email', function() {
      it('respond with status 400 code:4', function(done) {
        supertest(url)
        .post('/course/delete')
        .send({
          user:{
            email:"test@test.com"
          },
          course:{

          }
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.code,4);
          done();
        });
      });
    });
    describe('Without the user being the owner of the course', function() {
      it('respond with status:403', function(done) {
        supertest(url)
        .post('/course/delete')
        .send({
          user:{
            email:"test2@test.com"
          },
          course:{
            id:idCourseCreated
          }
        })
        .expect(403,done);
      });
    });
    describe('With valid data', function() {
      it('respond with status 200 ', function(done) {
        supertest(url)
        .post('/course/delete')
        .send({
          user:{
            email:"test@test.com"
          },
          course:{
            id:idCourseCreated
          }
        })
        .expect(200,done);
      });
    });
  });
});
