app.controller('cloneCourseController',['$scope','$http','$location','toastr','globalVariables','$rootScope','$interval', 'ngDialog','$state',function($scope,$http,$location,toastr,globalVariables,$rootScope,$interval,ngDialog,$state){

  if($rootScope.loggedUser ){
    if($rootScope.loggedUser.role=="teacher"){
      console.log("clone course home");

      $scope.loadCourses=function(){
        console.log("Loading courses");
        $http({
          method:'POST',
          url:globalVariables.url+'/course/byTeacher',
          data:{
            user:{
              email:$rootScope.loggedUser.email
            }
          }
        }).then(function success(response){
          $scope.courses=response.data.courses;
          console.log(response);
        }, function error(response){
          console.log(response);
        })
      }

      $scope.loadCourses();

      $scope.cloneCourse=function(idCourse){
        $http({
          method:'POST',
          url:globalVariables.url+'/course/clone',
          data:{
            user:{
              email:$rootScope.loggedUser.email
            },
            course:{
              id:idCourse
            }
          }
        }).then(function success(response){
          toastr.success("Curso clonado con éxito", "Success");
          $state.go("home")
        }, function error(response){
          toastr.error("Error al clonar el curso", "Error");
          console.log(response);
        })
      }


    }else{
      $state.go("home")
    }
  }else{
    $state.go("home")
  }
}]);
