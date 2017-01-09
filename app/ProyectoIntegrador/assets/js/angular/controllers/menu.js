app.controller('menuController',['$scope','$state','$window',function($scope,$state,$window){
  $scope.reload=function(){
    $window.location.reload();
  }
}]);
