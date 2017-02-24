app.controller('courseHomeTeacherController',['$scope','$http','toastr','$location','globalVariables','$rootScope','ngDialog','$state', function($scope,$http, toastr,$location,globalVariables,$rootScope,ngDialog,$state){

  if($rootScope.loggedUser){
    if($rootScope.loggedUser.role=="teacher"){
      if($rootScope.activeCourse){
        $scope.course=$rootScope.activeCourse;
        console.log($scope.course);

        $http({
          method:'POST',
          url:globalVariables.url+'/user/studentsByCourse',
          data:{
            user:{
              email:$rootScope.loggedUser.email
            },
            course:{
              id:$scope.course.id
            }
          }
        }).then(function success(response){
          console.log(response);
          $scope.students=response.data.students;
          console.log($scope.students);
        }, function error(response){
          console.log(response);
        })


        $http({
          method:'POST',
          url:globalVariables.url+'/test/byCourseByTeacher',
          data:{
            user:{
              email:$rootScope.loggedUser.email
            },
            course:{
              id:$scope.course.id
            }
          }
        }).then(function success(response){
          console.log(response);
          $scope.tests=response.data.tests;
          console.log($scope.tests);
        }, function error(response){
          console.log(response);
        })

        $scope.editTest=function(testId){
          $rootScope.activeTest={};
          $rootScope.activeTest.id=testId;
          $location.path('/test/edit');
        }
        $scope.deleteStudent=function(studentEmail){
          ngDialog.openConfirm({
            scope: $scope,
            template:
            '<div class="modal-dialog">'+
            '<div class="modal-content">'+
            '<div class="modal-header">'+
            '<h4 class="modal-title">¿Seguro que desea eliminar al estudiante del curso?</h4>'+
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
              url:globalVariables.url+'/course/deleteStudent',
              data:{
                studentEmail:studentEmail,
                teacherEmail:$rootScope.loggedUser.email,
                idCourse:$scope.course.id
              }
            }).then(function success(response){
              if(response.data.msgES){
                var msgES=response.data.msgES;
              }else{
                var msgES="Estudiante eliminado";
              }
              toastr.success(msgES,"Success");
              $state.reload();
            }, function error(response){
              if(response.data.msgES){
                var msgES=response.data.msgES;
              }else{
                var msgES="Estudiante no eliminado";
              }
              toastr.error(msgES,"Error");
            })
          }, function(reject) {
          });
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
              if(response.data.msgES){
                var msgES=response.data.msgES;
              }else{
                var msgES="Prueba eliminada";
              }
              toastr.success(msgES,"Success");
              $location.path('/home');
            }, function error(response){
              if(response.data.msgES){
                var msgES=response.data.msgES;
              }else{
                var msgES="Prueba no eliminada";
              }
              toastr.error(msgES,"Error");
            })
          }, function(reject) {
          });
        }

        $scope.reviewTest=function(testId){
          $state.go('teacherReviewTest',{testToBeReviewed:testId});
        }

      }else{
        $location.path('/home');
      }
    }else{
      $location.path('/home');
    }
  }else{
    $location.path('/home');
  }
}]);
