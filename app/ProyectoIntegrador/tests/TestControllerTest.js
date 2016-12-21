var supertest = require("supertest");
var fs=require('fs');
var contents=fs.readFileSync("./tests/config.txt",'utf8').toString();
var matchings=contents.match(/url="(.{1,})"/);
var url=matchings[1];

// Test http services tests

describe('Test register', function() {
  describe('Register a test without a title', function() {
    it('respond with status:400 code:1', function(done) {
      supertest(url)
      .post('/test/register')
      .send({
        test:{
        }
      })
      .expect(400,{code:1,msg: 'Error creating the test, there is no title'}, done);
    });
  });
  describe('Register a test without an owner', function() {
    it('respond with status:400 code:2', function(done) {
      supertest(url)
      .post('/test/register')
      .send({
        test:{
          title:"test"
        }
      })
      .expect(400,{code:2,msg: 'Error creating the test, there is no owner'}, done);
    });
  });
  describe('Register a test without a start date time', function() {
    it('respond with status:400 code:3', function(done) {
      supertest(url)
      .post('/test/register')
      .send({
        test:{
          title:"test",
          createdBy:"test@test.com"
        }
      })
      .expect(400,{code:3,msg: 'Error creating the test, there should be an start date-time'}, done);
    });
  });
  describe('Register a test without a finish date time', function() {
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
      .expect(400,{code:4,msg: 'Error creating the test, there should be an finish date-time'}, done);
    });
  });

  describe('Register a test without a course', function() {
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
      .expect(400,{code:5,msg: 'Error creating the test, there should be a course'})
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
    });
  });

});
