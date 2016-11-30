app.controller('editCourseController',['$scope','$http','toastr','$location','globalVariables','$rootScope', function($scope,$http, toastr,$location,globalVariables,$rootScope){
  if($rootScope.loggedUser){
    console.log("Estamos aqui en editar curso");
    if($rootScope.loggedUser.role=="teacher"){
      console.log("Estamos aca en editar curso");
      $scope.user={
        email:$rootScope.loggedUser.email,
        role:$rootScope.loggedUser.role
      }
      $http({
        method:'POST',
        url:globalVariables.url+'/course/getById',
        data:{
          user:{
            email:$scope.user.email
          },
          course:{
            id:$rootScope.activeCourse.id
          }
        }
      }).then(function success(response){
        console.log(response);
        $scope.course=response.data.course;
        console.log($scope.course);
      }, function error(response){
        console.log(response);
      })

      $scope.save=function(){
        $scope.course.name=$scope.course.name.toUpperCase();
        if($scope.course.name){
          $http({
            method:'POST',
            url:globalVariables.url+'/course/update',
            data:{
              user:{
                email:$scope.user.email,
                role:$scope.user.role
              },
              course:{
                id:$rootScope.activeCourse.id,
                name:$scope.course.name,
                description:$scope.course.description
              }
            }
          }).then(function success(response){
            toastr.success("Curso actualizado con exito","Success");
            console.log(response);
            $location.path('/home');
          }, function error(response){
            toastr.error("Error al actualizar el curso","Error");
            console.log(response);
          })
        }
      }
    }else{
      $location.path('/home');
    }
  }else{
    $location.path('/home');
  }
}]);
