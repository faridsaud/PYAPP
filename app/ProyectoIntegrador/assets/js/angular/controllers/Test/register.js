app.controller('registerTestController',['$scope','$http','toastr','$location','globalVariables', function($scope,$http, toastr,$location,globalVariables){
  $http({
    method:'POST',
    url:globalVariables.url+'/course/user/created',
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
