app.controller('testListController',['$scope','$http','$location','toastr','globalVariables','$rootScope','$interval', 'ngDialog','$state',function($scope,$http,$location,toastr,globalVariables,$rootScope,$interval,ngDialog,$state){
  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role=="teacher"){

      $scope.loadCourseData=function(test){
        $http({
          method:'POST',
          url:globalVariables.url+'/course/getById',
          data:{
            user:{
              email:$rootScope.loggedUser.email
            },
            course:{
              id:test.idCourse
            }
          }
        }).then(function success(response){
          console.log(response);
          test.course=response.data.course;
          console.log($scope.tests);
        }, function error(response){
          console.log(response);
        })

      }
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
        for(var i=0;i<$scope.tests.length;i++){
          $scope.loadCourseData($scope.tests[i]);
        }
      }, function error(response){
        console.log(response);
      })

      $scope.cloneTest=function(idTest){
        $rootScope.testToBeCloned=idTest;
        $state.go("registerTest");
      }
    }else{
      $location.path('/home');
    }
  }else{
    $location.path('/home');
  }
}]);
