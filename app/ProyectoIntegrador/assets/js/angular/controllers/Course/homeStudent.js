app.controller('courseHomeStudentController',['$scope','$http','$location','toastr','globalVariables','$rootScope',function($scope,$http,$location,toastr,globalVariables,$rootScope){
  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role=="student"){
      console.log("home teacher controller");
      $scope.course={
        id:$rootScope.activeCourse.id,
        name:$rootScope.activeCourse.name,
        description:$rootScope.activeCourse.description
      }


      $http({
        method:'POST',
        url:globalVariables.url+'/test/byCourseByStudent',
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
}]);
