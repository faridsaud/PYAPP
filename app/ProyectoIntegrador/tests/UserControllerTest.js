var supertest = require("supertest");
var url="http://localhost:1337";
var fs=require('fs');
fs.readFileSync(file[, options])
// This agent refers to PORT where program is runninng.


// User http services tests

describe('User signup', function() {

  describe('valid credentials', function() {
    it('respond with status 201 : User created', function(done) {
      supertest(url)
      .post('/user/register')
      .send({user:{
        email:"test@test.com",
        password:"test",
        name:"test name",
        lastName:"test last name",
        passport:"1111111111",
        country:"ECU",
        username:"test",
        role:"student"
      }})
      .expect(201,{msg:"User created"}, done);
    });
  });

  describe('valid credentials without role', function() {
    it('respond with status 400 : No role send', function(done) {
      supertest(url)
      .post('/user/register')
      .send({user:{
        email:"test4@test.com",
        password:"test4",
        name:"test name",
        lastName:"test last name",
        passport:"1111111111",
        country:"ECU",
        username:"test4"
      }})
      .expect(400,{msg:"No role send"}, done);
    });
  });

  describe('valid credentials without role', function() {
    it('respond with status 400 : Invalid role', function(done) {
      supertest(url)
      .post('/user/register')
      .send({user:{
        email:"test3@test.com",
        password:"test3",
        name:"test name",
        lastName:"test last name",
        passport:"1111111111",
        country:"ECU",
        username:"test3",
        role:"studente"
      }})
      .expect(400,{msg:"Invalid role"}, done);
    });
  });
});


describe('User login', function() {
  describe('valid credentials and role, login with email', function() {
    it('respond with status 200 : Login successfull', function(done) {
      supertest(url)
      .post('/login')
      .send({user:{
        email:"test@test.com",
        password:"test",
        role:"student"
      }})
      .expect(200, done);
    });
  });

  describe('valid credentials and role, login with username', function() {
    it('respond with status 200 : Login successfull', function(done) {
      supertest(url)
      .post('/login')
      .send({user:{
        email:"test",
        password:"test",
        role:"student"
      }})
      .expect(200, done);
    });
  });
  describe('invalid credentials, non existent user', function() {
    it('respond with status 400 : Not user finded with those credentials ', function(done) {
      supertest(url)
      .post('/login')
      .send({user:{
        email:"test@test.com",
        password:"test2",
        role:"student"
      }})
      .expect(400,{msg:"Not user finded with those credentials"}, done);
    });
  });

  describe('valid credentials, invalid role', function() {
    it('respond with status 403 : The role is not associated with the user', function(done) {
      supertest(url)
      .post('/login')
      .send({user:{
        email:"test@test.com",
        password:"test",
        role:"teacher"
      }})
      .expect(403,{msg:"The role is not associated with the user"}, done);
    });
  });

  describe('without username or email', function() {
    it('respond with status 400 : Non email or username send', function(done) {
      supertest(url)
      .post('/login')
      .send({user:{
        password:"test",
        role:"teacher"
      }})
      .expect(400,{msg:"Non email or username send"}, done);
    });
  });
});
