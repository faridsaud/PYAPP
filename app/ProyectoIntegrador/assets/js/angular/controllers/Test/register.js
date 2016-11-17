app.controller('registerTestController',['$scope','$http','toastr','$location','globalVariables','$rootScope', function($scope,$http, toastr,$location,globalVariables,$rootScope){
  if(!$rootScope.loggedUser){
    $location.path('/home');
  }else{
    $scope.test={};
    $scope.imprimir=function(){
      console.log($scope.test);
      if($scope.test.startDateTime<$scope.test.finishDateTime){
        console.log("fecha inicial menor que fecha final")
      }
      var startDateTime=new Date($scope.test.startDateTime);

    }
    $scope.register=function(){
      $http({
        method:'POST',
        url:globalVariables.url+'/test/register',
        data:{
          test:{
            createdBy:$rootScope.loggedUser.email,
            title:$scope.test.title,
            description:$scope.test.description,
            startDateTime:$scope.test.startDateTime,
            finishDateTime:$scope.test.finishDateTime,
            course:$scope.test.course
          }

        }
      }).then(function success(response){
        console.log(response);
        toastr.success("Prueba registrada con éxito","Success");
      }, function error(response){
        console.log(response);
        toastr.error("Error al registrar la prueba","Success");
      })
    }
    $http({
      method:'POST',
      url:globalVariables.url+'/course/createdByUser',
      data:{
        user:{
          email:"test@test.com"
        }

      }
    }).then(function success(response){
      console.log(response);
      $scope.courses=response.data;
      console.log($scope.courses);
    }, function error(response){
      console.log(response);
    })
  }
}]);
