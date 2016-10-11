var app=angular.module("myApp",['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {


  //SI LA URL QUE INGRESA EL USUARIO NO EXISTE SE REDIRIGE AQUI:
  $urlRouterProvider.otherwise("/");
  //
  // VISTAS DE NUESTRA APLICACION
  $stateProvider
  .state('test', {
    url: '/',
    templateUrl: '../views/test.html',
    controller: 'testController'
  })
  .state('review', {
    url: '/review',
    templateUrl: '../views/review.html',
    controller: 'reviewController'
  })

});
