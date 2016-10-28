app.controller('homeStudentController',['$scope','$http','$location','toastr','globalVariables','$rootScope',function($scope,$http,$location,toastr,globalVariables,$rootScope){
  if($rootScope.logedUser){
    if($rootScope.logedUser.role=="student"){
      console.log("home student controller");
    }else{
        $location.path('/home');
    }
  }else{
    $location.path('/home');
  }

}]);
