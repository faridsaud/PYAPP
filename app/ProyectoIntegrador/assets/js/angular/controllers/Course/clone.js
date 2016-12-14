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


    }else{
      $location.path('/home');
    }
  }else{
    $location.path('/home');
  }
}]);
