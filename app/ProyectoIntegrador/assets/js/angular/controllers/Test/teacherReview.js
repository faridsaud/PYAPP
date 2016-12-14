app.controller('teacherTestReviewController',['$scope','$http','$location','toastr','globalVariables','$rootScope','$interval', 'ngDialog','$state','$stateParams',function($scope,$http,$location,toastr,globalVariables,$rootScope,$interval,ngDialog,$state,$stateParams){
  if($rootScope.loggedUser && $stateParams.testToBeReviewed){
    if($rootScope.loggedUser.role=="teacher"){
      /*Load test data from id test*/
        $http({
          method:'POST',
          url:globalVariables.url+'/test/getTestByIdWOQuestions',
          data:{
            user:{
              email:$rootScope.loggedUser.email
            },
            test:{
              id:$stateParams.testToBeReviewed
            }
          }
        }).then(function success(response){
          console.log(response);
          $scope.test=response.data.test;
          $scope.test.startDateTime=new Date($scope.test.startDateTime);
          $scope.test.finishDateTime=new Date($scope.test.finishDateTime);;

        }, function error(response){
          console.log(response);
        })

        /*Load students data from id test*/
          $http({
            method:'POST',
            url:globalVariables.url+'/test/getStudentsByTestId',
            data:{
              user:{
                email:$rootScope.loggedUser.email
              },
              test:{
                id:$stateParams.testToBeReviewed
              }
            }
          }).then(function success(response){
            console.log(response);
            $scope.students=response.data.students;
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
