app.controller('registerCourseController',['$scope','$http','toastr','$location','globalVariables', function($scope,$http, toastr,$location,globalVariables){
  $scope.user={
    email:"test@test.com",
    role:"teacher"
  }
  $scope.register=function(){
    $scope.course.name=$scope.course.name.toUpperCase();
    if($scope.course.name){
      $http({
        method:'POST',
        url:globalVariables.url+'/course/register',
        data:{
          user:{
            email:$scope.user.email,
            role:$scope.user.role
          },
          course:{
            name:$scope.course.name,
            description:$scope.course.description
          }
        }
      }).then(function success(response){
        toastr.success("Curso registrado con éxito","Success");
        console.log(response);
        $location.path('/home');
      }, function error(response){
        toastr.error("Error al crear el curso","Error");
        console.log(response);
      })
    }
  }
}]);
