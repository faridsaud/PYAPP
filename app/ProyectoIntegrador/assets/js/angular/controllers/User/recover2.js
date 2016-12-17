app.controller('recoverPassword2Controller',['$scope','$http','toastr','$location','globalVariables','ngDialog','$stateParams','$state', function($scope,$http, toastr,$location,globalVariables,ngDialog,$stateParams, $state){
  $scope.error=false;
  $scope.securityQuestions=[];
  $scope.generatePin=false;
  $scope.changeSecurityQuestions=false;
  if(!$stateParams.emailVerified){
    $state.go("home")
  }
  /*Load security questions*/
  $http({
    method:'GET',
    url:globalVariables.url+'/securityQuestion/getAll',
  }).then(function success(response){
    console.log(response);
    $scope.securityQuestions=response.data.securityQuestions;
  },function error(response){
    console.log(response);
  })
  $scope.check=function(){
    if($scope.securityQuestion1 && $scope.securityQuestion2){
      if($scope.securityQuestion1.question && $scope.securityQuestion2.question){
        if($scope.securityQuestion1.question==$scope.securityQuestion2.question){
          toastr.error("Las dos preguntas de seguridad no pueden ser las mismas","Error");
          $scope.error=true;
        }
      }
    }
    if($scope.password!=$scope.passwordRepeated){
      toastr.error("Contraseñas no coinciden","Error");
      $scope.error=true;
    }
    if($scope.error==false){
      console.log($scope.generatePin);
      console.log($stateParams.emailVerified);
      $http({
        method:'POST',
        url:globalVariables.url+'/user/updateSecurityInfo',
        data:{
          securityQuestion1:$scope.securityQuestion1,
          email:$stateParams.emailVerified,
          securityQuestion2:$scope.securityQuestion2,
          generatePin:$scope.generatePin,
          password:$scope.password
        }
      }).then(function success(response){
        toastr.success("Información de seguridad actualizada con éxito","Success");
        $scope.pinGenerated=response.data.pinGenerated;
        if($scope.generatePin==true){
          ngDialog.openConfirm({
            scope: $scope,
            template:
            '<div class="modal-dialog">'+
            '<div class="modal-content">'+
            '<div class="modal-header">'+
            '<h4 class="modal-title">El pin único con el que también puede iniciar sesión es el siguiente, por favor recuerdelo.</h4>'+
            '</div>'+
            '<h3 class="modal-body"> {{pinGenerated}}</h3>'+
            '<div class="modal-footer">'+
            '<button type="button" class="btn btn-primary" ng-click="confirm()">Confirmar</button>'+
            '</div>'+
            '</div><!-- /.modal-content -->'+
            '</div><!-- /.modal-dialog -->'
            ,
            plain: true
          }).then(function (confirm) {
            $location.path('/home');
          })

        }
      },function error(response){
        toastr.error("Error al actualizar la información de seguridad","Error")
        console.log(response);
      })
    }


  }

}]);
