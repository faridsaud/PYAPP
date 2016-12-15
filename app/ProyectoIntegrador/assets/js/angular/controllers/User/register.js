app.controller('registerUserController',['$scope','$http','toastr','$location','globalVariables', function($scope,$http, toastr,$location,globalVariables){
  console.log("Register user controller");
  $scope.user={};
  $scope.error=false;
  $scope.user.roleStudent=true;
  $scope.user.roleTeacher=false;
  $scope.user.roles=[];
  $scope.register=function(){
    $scope.user.roles=[];
    if($scope.user.password!=$scope.user.confirmPassword){
      toastr.error("Claves ingresadas no son iguales","Error");
      $scope.error=true;
    }
    if($scope.user.roleStudent==true){
      $scope.user.roles.push('student');
    }

    if($scope.user.roleTeacher==true){
      $scope.user.roles.push('teacher');
    }
    if($scope.user.roles.length==0){
      $scope.error=true;
    }
    if($scope.user.email && $scope.user.password && $scope.user.confirmPassword && $scope.error==false){
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
            country:$scope.user.country,
            roles:$scope.user.roles
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
