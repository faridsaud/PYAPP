app.controller('newQuestionMultipleChoiceController',['$scope','$http','$location','toastr','globalVariables','$rootScope',function($scope,$http,$location,toastr,globalVariables,$rootScope){
  $scope.question={};
  $scope.question.options=[];
  $scope.question.options.push({});
  $scope.addOption=function(){
    $scope.question.options.push({});
    console.log($scope.question.options);
  }

}]);
