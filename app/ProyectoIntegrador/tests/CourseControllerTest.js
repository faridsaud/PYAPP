var supertest = require("supertest");
var fs=require('fs');
var contents=fs.readFileSync("./tests/config.txt",'utf8').toString();
var matchings=contents.match(/url="(.{1,})"/);
var url=matchings[1];

// Course http services tests

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
      .expect(400, {code:1,msg:"No user's email send"}, done);
    });
  });

  describe('Student register course with valid data', function() {
    it('respond with status 400 code:2', function(done) {
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
      .expect(403,{code:2,msg:"Invalid role"}, done);
    });
  });

  describe('Teacher without role register course with valid data', function() {
    it('respond with status 400 code:3', function(done) {
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
      .expect(403,{code:3,msg:"Invalid role"}, done);
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
      .expect(400,{code:4,msg:"No course's name send"}, done);
    });
  });

  describe('Teacher register course with valid data', function() {
    it('respond with status 201 : Course created', function(done) {
      supertest(url)
      .post('/course/register')
      .send({
        course:{
          name:"Arquitectura Computadores",
          description:"Curso 2016-B"
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
        done();
      });
    });
  });


});
