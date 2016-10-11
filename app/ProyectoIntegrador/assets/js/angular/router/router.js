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
