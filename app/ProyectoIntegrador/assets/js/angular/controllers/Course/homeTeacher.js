app.controller('courseHomeTeacherController',['$scope','$http','toastr','$location','globalVariables','$rootScope', function($scope,$http, toastr,$location,globalVariables,$rootScope){

  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role=="teacher"){
      if($rootScope.activeCourse){
        $scope.course=$rootScope.activeCourse;
        console.log($scope.course);
      }else{
        $location.path('/home');
      }
    }else{
      $location.path('/home');
    }
  }else{
    $location.path('/home');
  }
}]);
