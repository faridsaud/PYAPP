app.controller('homeTeacherController',['$scope','$http','$location','toastr','globalVariables','$rootScope',function($scope,$http,$location,toastr,globalVariables,$rootScope){
  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role=="teacher"){
      console.log("home teacher controller");
      $http({
        method:'POST',
        url:globalVariables.url+'/course/createdByUser',
        data:{
          user:{
            email:$rootScope.loggedUser.email
          }
        }
      }).then(function success(response){
        console.log(response);
        $scope.courses=response.data;
        console.log($scope.courses);
      }, function error(response){
        console.log(response);
      })
    }else{
        $location.path('/home');
    }
  }else{
    $location.path('/home');
  }
}]);
