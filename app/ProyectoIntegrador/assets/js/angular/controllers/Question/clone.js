app.controller('cloneQuestionController',['$scope','$http','$location','toastr','globalVariables','$rootScope','$interval', 'ngDialog','$state','$stateParams',function($scope,$http,$location,toastr,globalVariables,$rootScope,$interval,ngDialog,$state,$stateParams){
  if($rootScope.loggedUser && $stateParams.questionToBeCloned){
    if($rootScope.loggedUser.role=="teacher"){
      /*Load course data from id course*/
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

      $scope.cloneQuestion=function(testId){
        var questionToBeCloned=$stateParams.questionToBeCloned;
        $http({
          method:'POST',
          url:globalVariables.url+'/test/question/clone',
          data:{
            user:{
              email:$rootScope.loggedUser.email
            },
            test:{
              id:testId
            },
            question:questionToBeCloned
          }
        }).then(function success(response){
          if(response.data.msgES){
            var msgES=response.data.msgES;
          }else{
            var msgES="Pregunta clonada";
          }
          toastr.success(msgES,"Success");
          $state.go("editTest");
        }, function error(response){
          if(response.data.msgES){
            var msgES=response.data.msgES;
          }else{
            var msgES="Pregunta no clonada";
          }
          toastr.error(msgES,"Error");
          $state.go("editTest");
        })
      }

    }else{
      $location.path('/home');
    }
  }else{
    $location.path('/home');
  }
}]);
