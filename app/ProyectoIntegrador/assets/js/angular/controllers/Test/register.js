app.controller('registerTestController',['$scope','$http','toastr','$location','globalVariables','$rootScope', function($scope,$http, toastr,$location,globalVariables,$rootScope){
  if(!$rootScope.loggedUser){
    $location.path('/home');
  }else{
    $scope.test={};
    $scope.imprimir=function(){
      console.log($scope.test);
      if($scope.test.startDateTime<$scope.test.finishDateTime){
        console.log("fecha inicial menor que fecha final")
      }
      var startDateTime=new Date($scope.test.startDateTime);

    }
    /*Fill question scope*/
    $scope.fillQuestions=[];
    $scope.addFillQuestion=function(){

      var fillQuestion={};
      fillQuestion.texts=[];
      fillQuestion.texts.push({});
      fillQuestion.options=[];
      fillQuestion.options.push({correct:true});
      fillQuestion.weighing=1;
      $scope.fillQuestions.push(fillQuestion);
      console.log($scope.fillQuestions);
    }

    $scope.addOptionFillQuestion=function(index){
      console.log(index);
      $scope.fillQuestions[index].options.push({});
      console.log($scope.fillQuestions[index]);
    }
    $scope.addStatementFillQuestion=function(index){
      console.log(index);
      $scope.fillQuestions[index].texts.push({});
      console.log($scope.fillQuestions[index]);
    }

    $scope.removeFillQuestion=function(index){
      if (index > -1) {
        $scope.fillQuestions.splice(index, 1);
      }
    }

    /*Multiple choice question scope*/
    $scope.multipleChoiceQuestions=[];
    $scope.addMultipleChoiceQuestion=function(){
      var multipleChoiceQuestion={};
      multipleChoiceQuestion.options=[];
      multipleChoiceQuestion.options.push({correct:true});
      multipleChoiceQuestion.weighing=1;
      $scope.multipleChoiceQuestions.push(multipleChoiceQuestion);
      console.log($scope.multipleChoiceQuestions);
    }
    $scope.addOptionMultipleChoiceQuestion=function(index){
      $scope.multipleChoiceQuestions[index].options.push({});
      console.log($scope.multipleChoiceQuestions[index].options);
    }
    $scope.removeMultipleChoiceQuestion=function(index){
      if (index > -1) {
        $scope.multipleChoiceQuestions.splice(index, 1);
      }
    }

    /*True/False question scope*/
    $scope.trueFalseQuestions=[];

    $scope.addTrueFalseQuestion=function(){
      var trueFalseQuestion={};
      trueFalseQuestion.option={};
      trueFalseQuestion.option.text=true;
      trueFalseQuestion.weighing=1;
      $scope.trueFalseQuestions.push(trueFalseQuestion);
    }
    $scope.removeTrueFalseQuestion=function(index){
      if (index > -1) {
        $scope.trueFalseQuestions.splice(index, 1);
      }
    }



    $scope.register=function(){
      console.log(Date.parse($scope.test.startDateTime));
      $http({
        method:'POST',
        url:globalVariables.url+'/test/register',
        data:{
          test:{
            createdBy:$rootScope.loggedUser.email,
            title:$scope.test.title,
            description:$scope.test.description,
            startDateTime:$scope.test.startDateTime.toISOString(),
            finishDateTime:$scope.test.finishDateTime.toISOString(),
            course:$scope.test.course
          }

        }
      }).then(function success(response){
        console.log(response);
        toastr.success("Prueba registrada con éxito","Success");
      }, function error(response){
        console.log(response);
        toastr.error("Error al registrar la prueba","Success");
      })
    }
    $http({
      method:'POST',
      url:globalVariables.url+'/course/byTeacher',
      data:{
        user:{
          email:"test@test.com"
        }

      }
    }).then(function success(response){
      console.log(response);
      $scope.courses=response.data.courses;
      console.log($scope.courses);
    }, function error(response){
      console.log(response);
    })
  }
}]);
