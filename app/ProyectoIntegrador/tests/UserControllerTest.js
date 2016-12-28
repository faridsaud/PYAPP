var supertest = require("supertest");
var fs=require('fs');
var assert = require('assert');
var contents=fs.readFileSync("./tests/config.txt",'utf8').toString();
var matchings=contents.match(/url="(.{1,})"/);
var url=matchings[1];

// This agent refers to PORT where program is runninng.


// User http services tests

describe('User signup', function() {
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


describe('User login', function() {
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
    it('respond with status 403', function(done) {
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

describe('Password and pin change', function() {
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
