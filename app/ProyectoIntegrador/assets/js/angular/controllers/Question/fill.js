app.controller('newQuestionFillController',['$scope','$http','$location','toastr','globalVariables','$rootScope',function($scope,$http,$location,toastr,globalVariables,$rootScope){
  $scope.question={};
  $scope.question.texts=[];
  $scope.question.texts.push({});
  $scope.question.options=[];
  $scope.question.options.push({});
  $scope.addOption=function(){
    $scope.question.options.push({});
    console.log($scope.question.options);
  }
  $scope.addStatement=function(){
    $scope.question.texts.push({});
    console.log($scope.question.texts);
  }


}]);
