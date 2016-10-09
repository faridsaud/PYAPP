app.controller('homeController',['$scope','$http','$location','toastr','globalVariables',function($scope,$http,$location,toastr,globalVariables){
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

      $location.path('/home/'+response.data.role);
    }, function error(response){
      toastr.error(response.data.msg,"Error");
      console.log(response);
    })
  }

}]);
