app.controller('courseRegisterStudent',['$scope','$http','toastr','$location','globalVariables','$rootScope','$q','$state', function($scope,$http, toastr,$location,globalVariables,$rootScope,$q,$state){
  $scope.user={
    email:$rootScope.loggedUser.email,
    role:$rootScope.loggedUser.role
  }
  $scope.course={
    id:$rootScope.activeCourse.id
  }

  $scope.register=function(){
    var regexSepareteEmails=/;\s{0,}/;
    var emails=$scope.studentEmail.split(regexSepareteEmails);
    console.log(emails);
    var promises=[];
    for(var i=0;i<emails.length;i++){
      emails[i]=emails[i].toLowerCase();
      var regexEmail=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      var isValid=regexEmail.test(emails[i]);
      if(isValid==true){
        console.log(emails[i]);
        var promise=$http({
          method:'POST',
          url:globalVariables.url+'/course/registerStudent',
          data:{
            student:{
              email:emails[i]
            },
            course:{
              id:$scope.course.id
            },
            user:{
              email:$scope.user.email
            }
          }
        })
        promises.push(promise);
      }
    }
    $q.all(promises).then(function(success){
      toastr.success("Usuarios registrados con éxito", "Success");
      $state.go('home');
    },function(error){
      toastr.error("Error al registrar los estudiantes", "Error");
    })
  }
}]);
