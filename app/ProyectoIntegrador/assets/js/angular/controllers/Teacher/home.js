app.controller('homeTeacherController',['$scope','$http','$location','toastr','globalVariables','$rootScope','$interval',function($scope,$http,$location,toastr,globalVariables,$rootScope,$interval){
  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role=="teacher"){
      console.log("home teacher controller");
      $http({
        method:'POST',
        url:globalVariables.url+'/course/byTeacher',
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
        $scope.tests=response.data.tests;
        console.log($scope.tests);
      }, function error(response){
        console.log(response);
      })


      $scope.openCourse=function(courseName, courseId, courseDescription){
        $rootScope.activeCourse={};
        $rootScope.activeCourse.name=courseName;
        $rootScope.activeCourse.id=courseId;
        $rootScope.activeCourse.description=courseDescription;
        $location.path('/teacher/course/home');
      }


      $scope.editCourse=function(courseId){
        $rootScope.activeCourse={};
        $rootScope.activeCourse.id=courseId;
        $location.path('/course/edit');
      }


      $scope.deleteCourse=function(courseId){
        console.log("Deleting course");
        $http({
          method:'POST',
          url:globalVariables.url+'/course/delete',
          data:{
            user:{
              email:$rootScope.loggedUser.email
            },
            course:{
              id:courseId
            }
          }
        }).then(function success(response){
          console.log(response);
          toastr.success("Curso eliminado con éxito","Success");
          $location.path('/home');
        }, function error(response){
          toastr.error("Error al eliminar el curso","Error");
          console.log(response);
        })
      }


      $scope.editTest=function(testId){
        $rootScope.activeTest={};
        $rootScope.activeTest.id=testId;
        $location.path('/test/edit');
      }

      $scope.deleteTest=function(testId){
        $http({
          method:'POST',
          url:globalVariables.url+'/test/delete',
          data:{
            user:{
              email:$rootScope.loggedUser.email
            },
            test:{
              id:testId
            }
          }
        }).then(function success(response){
          console.log(response);
          toastr.success("Prueba eliminada con éxito","Success");
          $location.path('/home');
        }, function error(response){
          toastr.error("Error al eliminar la prueba","Error");
          console.log(response);
        })
      }

    }else{
      $location.path('/home');
    }
  }else{
    $location.path('/home');
  }
}]);
