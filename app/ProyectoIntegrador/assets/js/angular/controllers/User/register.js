app.controller('registerUserController',['$scope','$http','toastr','$location','globalVariables', function($scope,$http, toastr,$location,globalVariables){
  console.log("Register user controller");
  $scope.user={};
  $scope.error=false;
  $scope.register=function(){
    if($scope.user.password!=$scope.user.confirmPassword){
      toastr.error("Claves ingresadas no son iguales","Error");
      $scope.error=true;
    }
    $scope.user.username=$scope.user.username.toLowerCase();
    if($scope.user.email && $scope.user.username && $scope.user.password && $scope.user.confirmPassword && $scope.error==false){
      console.log($scope.user);
      $http({
        method:'POST',
        url:globalVariables.url+'/user/register',
        data:{
          user:{
            email:$scope.user.email,
            password:$scope.user.password,
            name:$scope.user.name,
            lastName:$scope.user.lastName,
            passport:$scope.user.passportId,
            username:$scope.user.username,
            country:$scope.user.country,
            role:$scope.user.role
          }
        }
      }).then(function success(response){
        toastr.success("Usuario registrado con éxito","Success");
        console.log(response);
        $location.path('/home');
      }, function error(response){
        toastr.error("Error al crear el usuario" + response.data.msg,"Error");
        console.log(response);
      })
    }
    };
}]);
