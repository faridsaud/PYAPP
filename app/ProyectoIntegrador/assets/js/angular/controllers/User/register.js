app.controller('registerUserController',['$scope','$http','toastr','$location','globalVariables','ngDialog', function($scope,$http, toastr,$location,globalVariables,ngDialog){
  console.log("Register user controller");
  $scope.user={};
  $scope.user.roleStudent=true;
  $scope.user.roleTeacher=false;
  $scope.user.roles=[];

  /*Load security questions*/
  $http({
    method:'GET',
    url:globalVariables.url+'/securityQuestion/getAll',
  }).then(function success(response){
    $scope.securityQuestions=response.data.securityQuestions;
  },function error(response){
    console.log(response);
  })


  $scope.register=function(){
    $scope.error=false;
    $scope.user.roles=[];
    if($scope.securityQuestion1 && $scope.securityQuestion2){
      if($scope.securityQuestion1.question && $scope.securityQuestion2.question){
        if($scope.securityQuestion1.question==$scope.securityQuestion2.question){
          toastr.error("Las dos preguntas de seguridad no pueden ser las mismas","Error");
          $scope.error=true;
        }
      }
    }
    if($scope.user.password!=$scope.user.confirmPassword){
      toastr.error("Claves ingresadas no son iguales","Error");
      $scope.error=true;
    }
    if($scope.user.roleStudent==true){
      $scope.user.roles.push('student');
    }

    if($scope.user.roleTeacher==true){
      $scope.user.roles.push('teacher');
    }
    if($scope.user.roles.length==0){
      $scope.error=true;
    }
    if($scope.user.email && $scope.user.password && $scope.user.confirmPassword && $scope.error==false){
      console.log($scope.user);
      $http({
        method:'POST',
        url:globalVariables.url+'/user/register',
        data:{
          user:{
            email:$scope.user.email,
            password:$scope.user.password,
            name:$scope.user.name,
            lastName:$scope.user.lastName,
            passport:$scope.user.passportId,
            country:$scope.user.country,
            roles:$scope.user.roles,
            securityQuestion1:$scope.securityQuestion1,
            securityQuestion2:$scope.securityQuestion2
          }
        }
      }).then(function success(response){
        toastr.success("Usuario registrado con éxito","Success");
        console.log(response);
        $scope.pinGenerated=response.data.user.pin;
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

      }, function error(response){
        toastr.error("Error al crear el usuario" + response.data.msg,"Error");
        console.log(response);
      })
    }
  };
}]);
