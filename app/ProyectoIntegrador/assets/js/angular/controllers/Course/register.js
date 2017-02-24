app.controller('registerCourseController',['$scope','$http','toastr','$location','globalVariables','$rootScope','$state', function($scope,$http, toastr,$location,globalVariables,$rootScope,$state){
  $scope.user={
    email:$rootScope.loggedUser.email,
    role:$rootScope.loggedUser.role
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
        if(response.data.msgES){
          var msgES=response.data.msgES;
        }else{
          var msgES="Curso registrado";
        }
        toastr.success(msgES,"Success");
        $location.path('/home');
      }, function error(response){
        if(response.data.msgES){
          var msgES=response.data.msgES;
        }else{
          var msgES="Curso no registrado";
        }
        toastr.error(msgES,"Error");
      })
    }
  }

  $scope.cloneCourse=function(){
    $state.go('cloneCourse');
  }
}]);
