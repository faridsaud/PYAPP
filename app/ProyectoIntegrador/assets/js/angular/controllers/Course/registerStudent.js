app.controller('courseRegisterStudent',['$scope','$http','toastr','$location','globalVariables','$rootScope', function($scope,$http, toastr,$location,globalVariables,$rootScope){
  $scope.user={
    email:$rootScope.loggedUser.email,
    role:$rootScope.loggedUser.role
  }
  $scope.course={
      id:$rootScope.activeCourse.id
  }

  $scope.register=function(){
    $scope.studentEmail=$scope.studentEmail.toLowerCase();
    if($scope.studentEmail){
      $http({
        method:'POST',
        url:globalVariables.url+'/course/registerStudent',
        data:{
          student:{
            email:$scope.studentEmail
          },
          course:{
            id:$scope.course.id
          },
          user:{
            email:$scope.user.email
          }
        }
      }).then(function success(response){
        toastr.success("Estudiante registrado con éxito en el curso","Success");
        console.log(response);
        $location.path('/course/home');
      }, function error(response){
        toastr.error("Error registrar el estudiante en el curso","Error");
        console.log(response);
      })
    }
  }
}]);
