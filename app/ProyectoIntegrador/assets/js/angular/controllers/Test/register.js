app.controller('registerTestController',['$scope','$http','toastr','$location','globalVariables', function($scope,$http, toastr,$location,globalVariables){
$scope.test={};
$scope.imprimir=function(){
  console.log($scope.test);
  if($scope.test.initialDate<$scope.test.endDate){
    console.log("fecha inicial menor que fecha final")
  }
  var initialDate=new Date($scope.test.initialDate);
  console.log(initialDate);
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
}]);
