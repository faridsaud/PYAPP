app.controller('testListController',['$scope','$http','$location','toastr','globalVariables','$rootScope','$interval', 'ngDialog',function($scope,$http,$location,toastr,globalVariables,$rootScope,$interval,ngDialog){
  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role=="teacher"){

      $http({
        method:'POST',
        url:globalVariables.url+'/test/createdByUser',
        data:{
          user:{
            email:$rootScope.loggedUser.email
          }
        }
      }).then(function success(response){
        console.log(response);
        $scope.tests=response.data.tests;
        console.log($scope.tests);
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
