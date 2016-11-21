app.controller('courseHomeTeacherController',['$scope','$http','toastr','$location','globalVariables','$rootScope', function($scope,$http, toastr,$location,globalVariables,$rootScope){

  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role=="teacher"){
      if($rootScope.activeCourse){
        $scope.course=$rootScope.activeCourse;
        console.log($scope.course);

        $http({
          method:'POST',
          url:globalVariables.url+'/user/studentsByCourse',
          data:{
            user:{
              email:$rootScope.loggedUser.email
            },
            course:{
              id:$scope.course.id
            }
          }
        }).then(function success(response){
          console.log(response);
          $scope.students=response.data.students;
          console.log($scope.students);
        }, function error(response){
          console.log(response);
        })


        $http({
          method:'POST',
          url:globalVariables.url+'/test/byCourseByTeacher',
          data:{
            user:{
              email:$rootScope.loggedUser.email
            },
            course:{
              id:$scope.course.id
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
  }else{
    $location.path('/home');
  }
}]);
