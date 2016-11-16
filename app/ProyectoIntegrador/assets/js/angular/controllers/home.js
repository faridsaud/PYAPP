app.controller('homeController',['$scope','$http','$location','toastr','globalVariables','$rootScope',function($scope,$http,$location,toastr,globalVariables,$rootScope){
  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role){
      console.log("estamos aqui");
      $location.path('/'+$rootScope.loggedUser.role+'/home');
    }
  }else{
    console.log("home controller");
    $scope.login=function(){
      $http({
        method:'POST',
        url:globalVariables.url+'/login',
        data:{
          user:{
            email:$scope.user.email,
            password:$scope.user.password,
            role:$scope.user.role
          }
        }
      }).then(function success(response){
        toastr.success("Login con éxito","Success");
        console.log(response);
        $rootScope.loggedUser={};
        $rootScope.loggedUser.email=response.data.email;
        $rootScope.loggedUser.role=response.data.role;
        $location.path('/'+response.data.role+'/home');
      }, function error(response){
        toastr.error(response.data.msg,"Error");
        console.log(response);
      })
    }
  }

}]);
