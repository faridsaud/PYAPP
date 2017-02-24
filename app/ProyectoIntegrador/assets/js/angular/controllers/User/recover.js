app.controller('recoverPasswordController',['$scope','$http','toastr','$location','globalVariables','ngDialog','$stateParams','$state', function($scope,$http, toastr,$location,globalVariables,ngDialog,$stateParams,$state){
  $scope.error=false;
  $scope.securityQuestions=[];
  /*Load security questions*/
  $http({
    method:'GET',
    url:globalVariables.url+'/securityQuestion/getAll',
  }).then(function success(response){
    $scope.securityQuestions=response.data.securityQuestions;
  },function error(response){
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
    if(!$scope.email){
      toastr.error("No se ingreso email alguno","Error");
      $scope.error=true;
    }
    if($scope.error==false){

      $http({
        method:'POST',
        url:globalVariables.url+'/user/checkUser',
        data:{
          email:$scope.email,
          securityQuestion1:$scope.securityQuestion1,
          securityQuestion2:$scope.securityQuestion2
        }
      }).then(function success(response){
        $state.go('recoverPassword2',{emailVerified:$scope.email});
      },function error(response){
        if(response.data.msgES){
          var msgES=response.data.msgES;
        }else{
          var msgES="Datos de seguridad incorrectos";
        }
        toastr.error(msgES,"Error");
        $state.go("home");
      })
    }

  }

}]);
