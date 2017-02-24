app.controller('cloneCourseController',['$scope','$http','$location','toastr','globalVariables','$rootScope','$interval', 'ngDialog','$state',function($scope,$http,$location,toastr,globalVariables,$rootScope,$interval,ngDialog,$state){

  if($rootScope.loggedUser ){
    if($rootScope.loggedUser.role=="teacher"){

      $scope.loadCourses=function(){
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
          if(response.data.msgES){
            var msgES=response.data.msgES;
          }else{
            var msgES="Curso clonado";
          }
          toastr.success(msgES, "Success");
          $state.go("home")
        }, function error(response){
          if(response.data.msgES){
            var msgES=response.data.msgES;
          }else{
            var msgES="Curso no clonado";
          }
          toastr.error(msgES, "Error");
        })
      }


    }else{
      $state.go("home")
    }
  }else{
    $state.go("home")
  }
}]);
