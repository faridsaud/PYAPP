var supertest = require("supertest");
var fs=require('fs');
var assert = require('assert');
var contents=fs.readFileSync("./tests/config.txt",'utf8').toString();
var matchings=contents.match(/url="(.{1,})"/);
var url=matchings[1];
var idCourseCreated;

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
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.code,1);
        done();
      });
    });
  });

  describe('Student register course with valid data', function() {
    it('respond with status 403 code:2', function(done) {
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
    it('respond with status 403 code:3', function(done) {
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
    it('respond with status 400 code:7', function(done) {
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
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.code,7);
        done();
      });
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
    it('respond with status 400 code:5', function(done) {
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
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.code,5);
        done();
      });
    });
  });
  describe('With valid data', function() {
    it('respond with status 200', function(done) {
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
      .expect(400,done);
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
    it('respond with status 400 code:6', function(done) {
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
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.code,6);
        done();
      });
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
    it('respond with status 400 code:5', function(done) {
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
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.code,5);
        done();
      });
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
    it('respond with status 400 code:5', function(done) {
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
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.code,5);
        done();
      });
    });
  });
  describe('Without valid data', function() {
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
