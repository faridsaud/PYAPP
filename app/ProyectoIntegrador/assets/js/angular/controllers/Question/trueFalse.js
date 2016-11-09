app.controller('newQuestionTrueFalseController',['$scope','$http','$location','toastr','globalVariables','$rootScope',function($scope,$http,$location,toastr,globalVariables,$rootScope){
  $scope.question={};
  $scope.question.option={};
  $scope.question.option.text=true;

  $scope.save=function(){
    console.log($scope.question);
  }

}]);
