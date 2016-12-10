app.controller('homeTeacherController',['$scope','$http','$location','toastr','globalVariables','$rootScope','$interval', 'ngDialog',function($scope,$http,$location,toastr,globalVariables,$rootScope,$interval,ngDialog){
  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role=="teacher"){
      /*In case there was a test to be cloned, undefine it*/
      $rootScope.testToBeCloned=undefined;
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
        ngDialog.openConfirm({
          scope: $scope,

          template:
          /*
          '<div class="ngdialog-message">' +
          '  <h2 class="confirmation-title"><i class="fa fa-exclamation-triangle orange"></i> Are you sure?</h2>' +
          '  <span>{{text}}</span>' +
          '    <div class="ngdialog-buttons">' +
          '      <button type="button" class="ngdialog-button" ng-click="confirm(confirmValue)">{{label}}</button>' +
          '      <button type="button" class="ngdialog-button" ng-click="closeThisDialog()">Cancel</button>' +
          '    </div>' +
          '</div>',
          */
          '<div class="modal-dialog">'+
          '<div class="modal-content">'+
          '<div class="modal-header">'+
          '<h4 class="modal-title">¿Seguro que desea eliminar el curso?</h4>'+
          '</div>'+
          '<div class="modal-footer">'+
          '<button type="button" class="btn btn-danger"  ng-click="closeThisDialog()">Cancelar</button>'+
          '<button type="button" class="btn btn-primary" ng-click="confirm()">Confirmar</button>'+
          '</div>'+
          '</div><!-- /.modal-content -->'+
          '</div><!-- /.modal-dialog -->'
          ,
          plain: true
        }).then(function (confirm) {

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
        }, function(reject) {
        });

      }


      $scope.editTest=function(testId){
        $rootScope.activeTest={};
        $rootScope.activeTest.id=testId;
        $location.path('/test/edit');
      }

      $scope.deleteTest=function(testId){
        ngDialog.openConfirm({
          scope: $scope,

          template:
          /*
          '<div class="ngdialog-message">' +
          '  <h2 class="confirmation-title"><i class="fa fa-exclamation-triangle orange"></i> Are you sure?</h2>' +
          '  <span>{{text}}</span>' +
          '    <div class="ngdialog-buttons">' +
          '      <button type="button" class="ngdialog-button" ng-click="confirm(confirmValue)">{{label}}</button>' +
          '      <button type="button" class="ngdialog-button" ng-click="closeThisDialog()">Cancel</button>' +
          '    </div>' +
          '</div>',
          */
          '<div class="modal-dialog">'+
          '<div class="modal-content">'+
          '<div class="modal-header">'+
          '<h4 class="modal-title">¿Seguro que desea eliminar la prueba?</h4>'+
          '</div>'+
          '<div class="modal-footer">'+
          '<button type="button" class="btn btn-danger"  ng-click="closeThisDialog()">Cancelar</button>'+
          '<button type="button" class="btn btn-primary" ng-click="confirm()">Confirmar</button>'+
          '</div>'+
          '</div><!-- /.modal-content -->'+
          '</div><!-- /.modal-dialog -->'
          ,
          plain: true
        }).then(function (confirm) {

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
        }, function(reject) {
        });
      }

    }else{
      $location.path('/home');
    }
  }else{
    $location.path('/home');
  }
}]);
