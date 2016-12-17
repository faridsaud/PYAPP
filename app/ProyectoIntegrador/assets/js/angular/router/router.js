console.log("Loading router");
app.config(function ($stateProvider, $urlRouterProvider) {


  //SI LA URL QUE INGRESA EL USUARIO NO EXISTE SE REDIRIGE AQUI:
  $urlRouterProvider.otherwise("/home");
  //
  // VISTAS DE NUESTRA APLICACION
  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: 'html/angular/views/home.html',
    controller: 'homeController'
  })
  .state('registerUser', {
    url: '/user/register',
    templateUrl: 'html/angular/views/User/register.html',
    controller: 'registerUserController'
  })
  .state('registerCourse', {
    url: '/course/register',
    templateUrl: 'html/angular/views/Course/register.html',
    controller: 'registerCourseController'
  })
  .state('registerTest', {
    url: '/test/register',
    templateUrl: 'html/angular/views/Test/register.html',
    controller: 'registerTestController',
    params: {
      testToBeCloned: undefined
    }
  })
  .state('editTest', {
    url: '/test/edit',
    templateUrl: 'html/angular/views/Test/edit.html',
    controller: 'editTestController'
  })
  .state('homeStudent', {
    url: '/student/home',
    templateUrl: 'html/angular/views/Student/home.html',
    controller: 'homeStudentController'
  })

  .state('homeTeacher', {
    url: '/teacher/home',
    templateUrl: 'html/angular/views/Teacher/home.html',
    controller: 'homeTeacherController'
  })
  .state('courseHomeTeacher', {
    url: '/teacher/course/home',
    templateUrl: 'html/angular/views/Course/homeTeacher.html',
    controller: 'courseHomeTeacherController'
  })
  .state('courseRegisterStudent', {
    url: '/course/registerStudent',
    templateUrl: 'html/angular/views/Course/registerStudent.html',
    controller: 'courseRegisterStudent'
  })
  .state('courseHomeStudent', {
    url: '/student/course/home',
    templateUrl: 'html/angular/views/Course/homeStudent.html',
    controller: 'courseHomeStudentController'
  })

  .state('editCourse', {
    url: '/course/edit',
    templateUrl: 'html/angular/views/Course/edit.html',
    controller: 'editCourseController'
  })
  .state('studentTakeTest', {
    url: '/student/test/take',
    templateUrl: 'html/angular/views/Test/studentTest.html',
    controller: 'studentTestTakenController'
  })
  .state('studentReviewTest', {
    url: '/student/test/review',
    templateUrl: 'html/angular/views/Test/studentReview.html',
    controller: 'studentTestReviewController'
  })
  .state('testList', {
    url: '/teacher/test/all',
    templateUrl: 'html/angular/views/Test/listAll.html',
    controller: 'testListController'
  })
  .state('cloneQuestion', {
    url: '/teacher/test/question/clone',
    templateUrl: 'html/angular/views/Question/clone.html',
    controller: 'cloneQuestionController',
    params: {
      questionToBeCloned: undefined
    }
  })
  .state('cloneCourse', {
    url: '/teacher/course/clone',
    templateUrl: 'html/angular/views/Course/clone.html',
    controller: 'cloneCourseController'
  })

  .state('prueba', {
    url: '/prueba',
    templateUrl: 'html/angular/views/Test/prueba.html',
    controller: 'pruebaController'
  })
  .state('recoverPassword', {
    url: '/recover',
    templateUrl: 'html/angular/views/User/recover.html',
    controller: 'recoverPasswordController'
  })
  .state('recoverPassword2', {
    url: '/recover2',
    templateUrl: 'html/angular/views/User/recover2.html',
    controller: 'recoverPassword2Controller',
    params: {
      emailVerified: undefined
    }
  })
  .state('teacherReviewTest', {
    url: '/teacher/test/review',
    templateUrl: 'html/angular/views/Test/teacherReview.html',
    controller: 'teacherTestReviewController',
    params: {
      testToBeReviewed: undefined
    }

  })
});
console.log("router finished loading");
