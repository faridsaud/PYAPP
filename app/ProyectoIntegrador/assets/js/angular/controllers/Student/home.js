app.controller('homeStudentController',['$scope','$http','$location','toastr','globalVariables','$rootScope',function($scope,$http,$location,toastr,globalVariables,$rootScope){
  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role=="student"){
      console.log("home student controller");
    }else{
        $location.path('/home');
    }
  }else{
    $location.path('/home');
  }

}]);
