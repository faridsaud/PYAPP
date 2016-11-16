app.controller('homeTeacherController',['$scope','$http','$location','toastr','globalVariables','$rootScope',function($scope,$http,$location,toastr,globalVariables,$rootScope){
  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role=="teacher"){
      console.log("home student controller");
    }else{
        $location.path('/home');
    }
  }else{
    $location.path('/home');
  }
}]);
