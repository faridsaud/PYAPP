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
    controller: 'registerTestController'
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
  .state('newMultipleChoice', {
    url: '/question/multipleChoice',
    templateUrl: 'html/angular/views/Question/multipleChoice.html',
    controller: 'newQuestionMultipleChoiceController'
  })
  .state('newTrueFalse', {
    url: '/question/trueFalse',
    templateUrl: 'html/angular/views/Question/trueFalse.html',
    controller: 'newQuestionTrueFalseController'
  })
  .state('newFill', {
    url: '/question/fill',
    templateUrl: 'html/angular/views/Question/fill.html',
    controller: 'newQuestionFillController'
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
  /*
  .state('categoriaHome', {
    url: '/categoria/home/{idCategoria:int}',
    templateUrl: 'html/angular/views/categoria/home.html',
    controller: 'categoriaHomeController'
  })
  .state('postRegistrar', {
    url: '/post/registrar',
    templateUrl: 'html/angular/views/post/registrar.html',
    controller: 'postRegistrarController'
  })
  .state('usuarioIniciarSesion', {
    url: '/login',
    templateUrl: 'html/angular/views/usuario/iniciarSesion.html',
    controller: 'iniciarSesionController'
  })
  .state('usuarioRegistrar', {
    url: '/usuario/registrar',
    templateUrl: 'html/angular/views/usuario/registrar.html',
    controller: 'usuarioRegistrarController'
  })*/
});
console.log("router finished loading");
