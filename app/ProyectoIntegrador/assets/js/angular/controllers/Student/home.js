app.controller('homeStudentController',['$scope','$http','$location','toastr','globalVariables','$rootScope','$state',function($scope,$http,$location,toastr,globalVariables,$rootScope,$state){
  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role=="student"){
      console.log("home teacher controller");
      $http({
        method:'POST',
        url:globalVariables.url+'/course/byStudent',
        data:{
          user:{
            email:$rootScope.loggedUser.email
          }
        }
      }).then(function success(response){
        console.log(response);
        $scope.courses=response.data.courses;
        console.log($scope.courses);
      }, function error(response){
        console.log(response);
      })


      $http({
        method:'POST',
        url:globalVariables.url+'/test/byStudent',
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


      $scope.openCourse=function(courseName, courseId, courseDescription){
        console.log(courseDescription);
        $rootScope.activeCourse={};
        $rootScope.activeCourse.name=courseName;
        $rootScope.activeCourse.id=courseId;
        $rootScope.activeCourse.description=courseDescription;
        $location.path('/student/course/home');
      }

      $scope.openTest=function(testId){
        console.log("abreidno test"+testId);
        $rootScope.activeTest={};
        $rootScope.activeTest.id=testId;
        $state.go('studentTakeTest');
      }

    }else{
      $location.path('/home');
    }
  }else{
    $location.path('/home');
  }
}]);
