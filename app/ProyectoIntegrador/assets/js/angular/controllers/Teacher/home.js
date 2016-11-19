app.controller('homeTeacherController',['$scope','$http','$location','toastr','globalVariables','$rootScope',function($scope,$http,$location,toastr,globalVariables,$rootScope){
  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role=="teacher"){
      console.log("home teacher controller");
      $http({
        method:'POST',
        url:globalVariables.url+'/course/createdByUser',
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
        url:globalVariables.url+'/test/createdByUser',
        data:{
          user:{
            email:$rootScope.loggedUser.email
          }
        }
      }).then(function success(response){
        console.log(response);
        $scope.tests=response.data.tests;/*
        for(var i=0;i<$scope.tests.length;i++){
          var finishDT=new Date(Date.parse($scope.tests[i].finishDateTime));
          $scope.tests[i].finishDateTimeFormatted=finishDT.getFullYear()+"/"+finishDT.getMonth()+"/"+finishDT.getDay()+" "+finishDT.get
          $scope.tests[i].startDateTimeFormatted=new Date(Date.parse($scope.tests[i].startDateTime));
        }*/
        console.log($scope.tests);
      }, function error(response){
        console.log(response);
      })


      $scope.openCourse=function(courseName, courseId){
        $rootScope.activeCourse={};
        $rootScope.activeCourse.name=courseName;
        $rootScope.activeCourse.id=courseId;
        $location.path('/teacher/course/home');
      }
    }else{
      $location.path('/home');
    }
  }else{
    $location.path('/home');
  }
}]);
