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
      fillQuestion.statements=[];
      fillQuestion.statements.push({text:""});
      fillQuestion.options=[];
      fillQuestion.options.push({isCorrect:true});
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
      $scope.fillQuestions[index].statements.push({text:""});
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
      multipleChoiceQuestion.options.push({isCorrect:true});
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
      trueFalseQuestion.text="";
      trueFalseQuestion.option="true";
      trueFalseQuestion.weighing=1;
      $scope.trueFalseQuestions.push(trueFalseQuestion);
    }
    $scope.removeTrueFalseQuestion=function(index){
      if (index > -1) {
        $scope.trueFalseQuestions.splice(index, 1);
      }
    }


    $scope.checkData=function(){
      var errorMultipleChoice=$scope.checkMultipleChoiceQuestions();
      if(errorMultipleChoice.error==true){
        console.log("Error checking multipleChoiceQuestions" + errorMultipleChoice.msg);
      }else{
        console.log("No error checking multipleChoiceQuestions");
      }
      console.log($scope.multipleChoiceQuestions);
      var errorTrueFalse=$scope.checkTrueFalseQuestions();
      if(errorTrueFalse.error==true){
        console.log("Error checking trueFalseQuestions" + errorTrueFalse.msg);
      }else{
        console.log("No error checking trueFalseQuestions");
      }
      console.log($scope.trueFalseQuestions);
      var errorFillQuestion=$scope.checkFillQuestions();
      if(errorFillQuestion.error==true){
        console.log("Error checking fillQuestions" + errorFillQuestion.msg);
      }else{
        console.log("No error checking fillQuestions");
      }
      console.log($scope.fillQuestions);
    }


    $scope.checkTrueFalseQuestions=function(){
      for(var i=0;i<$scope.trueFalseQuestions.length;i++){
        console.log("imprimiendo preguntas trufalse")
        console.log($scope.trueFalseQuestions);
        console.log($scope.trueFalseQuestions[i]);
        if($scope.trueFalseQuestions[i].text){
          if($scope.trueFalseQuestions[i].text.length>=1){
            console.log($scope.trueFalseQuestions[i].text);
            var patt = /^\w{1,}.{0,}$/;
            var res = patt.test($scope.trueFalseQuestions[i].text);
            console.log(res);
            if(res==false){
              return {
                error:true,
                msg:"Wrong statement in question "+i+", cannot be empty",
                question:i,
                type:"trueFalseQuestions"
              }
            }
          }else{
            return {
              error:true,
              msg:"Wrong statement in question "+i+", cannot be empty",
              question:i,
              type:"trueFalseQuestions"
            }
          }
        }else{
          return {
            error:true,
            msg:"Wrong statement in question "+i+", cannot be empty",
            question:i,
            type:"trueFalseQuestions"
          }
        }
        if($scope.trueFalseQuestions[i].weighing){
          var patt = new RegExp("^\d{1,1}$");
          var res = patt.test($scope.trueFalseQuestions[i].weighing);
          if(res==false){
            $scope.trueFalseQuestions[i].weighing=1;
          }
        }else{
          $scope.trueFalseQuestions[i].weighing=1;
        }
        if($scope.trueFalseQuestions[i].justification){
          if($scope.trueFalseQuestions[i].justification.length>=1){
            console.log($scope.trueFalseQuestions[i].justification);
            var patt = /^\w{1,}.{0,}$/;
            var res = patt.test($scope.trueFalseQuestions[i].justification);
            console.log(res);
            if(res==false){
              $scope.trueFalseQuestions[i].justification="";
            }
          }else{
            $scope.trueFalseQuestions[i].justification=""
          }
        }else{
          $scope.trueFalseQuestions[i].justification="";
        }
      }
      return {
        error:false,
        msg:"Not error found"
      }
    }

    $scope.checkMultipleChoiceQuestions=function(){
      for(var i=0;i<$scope.multipleChoiceQuestions.length;i++){
        /*check weighing*/
        if($scope.multipleChoiceQuestions[i].weighing){
          var patt = new RegExp("^\d{1,1}$");
          var res = patt.test($scope.multipleChoiceQuestions[i].weighing);
          if(res==false){
            $scope.multipleChoiceQuestions[i].weighing=1;
          }
        }else{
          $scope.multipleChoiceQuestions[i].weighing=1;
        }
        /*Check statement*/
        if($scope.multipleChoiceQuestions[i].text){
          if($scope.multipleChoiceQuestions[i].text.length>=1){
            console.log($scope.multipleChoiceQuestions[i].text);
            var patt = /^\w{1,}.{0,}$/;
            var res = patt.test($scope.multipleChoiceQuestions[i].text);
            console.log(res);
            if(res==false){
              return {
                error:true,
                msg:"Wrong statement in question "+i+", cannot be empty",
                question:i,
                type:"multipleChoiceQuestions"
              }
            }
          }else{
            return {
              error:true,
              msg:"Wrong statement in question "+i+", cannot be empty",
              question:i,
              type:"multipleChoiceQuestions"
            }
          }
        }else{
          return {
            error:true,
            msg:"Wrong statement in question "+i+", cannot be empty",
            question:i,
            type:"multipleChoiceQuestions"
          }
        }
        console.log("antes de correctAnswers");
        var correctAnswers=0;
        console.log($scope.multipleChoiceQuestions[i].options);
        /*check Options*/
        for(var j=0;j<$scope.multipleChoiceQuestions[i].options.length;j++){
          /*check Options*/
          console.log("chequeando opciones");
          if($scope.multipleChoiceQuestions[i].options[j].text){
            if($scope.multipleChoiceQuestions[i].options[j].text.length>=1){
              var patt = /^\w{1,}.{0,}$/;
              var res = patt.test($scope.multipleChoiceQuestions[i].options[j].text);
              if(res==false){
                return {
                  error:true,
                  msg:"Wrong statement in question "+i+" option "+j+", cannot be empty",
                  question:i,
                  type:"multipleChoiceQuestions"
                }
              }
            }else{
              return {
                error:true,
                msg:"Wrong statement in question "+i+" option "+j+", cannot be empty",
                question:i,
                type:"multipleChoiceQuestions"
              }
            }
          }else{
            return {
              error:true,
              msg:"Wrong statement in question "+i+" option "+j+", cannot be empty",
              question:i,
              type:"multipleChoiceQuestions"
            }
          }
          /*check justification*/
          if($scope.multipleChoiceQuestions[i].options[j].justification){
            if($scope.multipleChoiceQuestions[i].options[j].justification.length>=1){
              var patt = /^\w{1,}.{0,}$/;
              var res = patt.test($scope.multipleChoiceQuestions[i].options[j].justification);
              if(res==false){
                $scope.multipleChoiceQuestions[i].options[j].justification="";
              }
            }else{
              $scope.multipleChoiceQuestions[i].options[j].justification="";
            }
          }else{
            $scope.multipleChoiceQuestions[i].options[j].justification="";

          }
          /*check correctAnswers*/
          console.log($scope.multipleChoiceQuestions[i].options[j].isCorrect);
          if($scope.multipleChoiceQuestions[i].options[j].isCorrect){
            console.log("tratando");
            correctAnswers++;
          }else{
            $scope.multipleChoiceQuestions[i].options[j].isCorrect=false;
          }
        }
        console.log("estamos aqui");
        console.log(correctAnswers);
        if(correctAnswers==0){
          return {
            error:true,
            msg:"There should be at least 1 correct answer in question "+i,
            question:i,
            type:"multipleChoiceQuestions"
          }
        }
      }
      console.log("Multiple choice questions after verification");
      console.log($scope.multipleChoiceQuestions);
      return {
        error:false,
        msg:"not error found"
      }
    }

    $scope.checkFillQuestions=function(){
      for(var i=0;i<$scope.fillQuestions.length;i++){
        if($scope.fillQuestions[i].weighing){
          var patt = new RegExp("^\d{1,1}$");
          var res = patt.test($scope.fillQuestions[i].weighing);
          if(res==false){
            $scope.fillQuestions[i].weighing=1;
          }
        }else{
          $scope.fillQuestions[i].weighing=1;
        }
        for(var j=0;j<$scope.fillQuestions[i].statements.length;j++){
          console.log($scope.fillQuestions[i].statements[j].text);
          if($scope.fillQuestions[i].statements[j].text){
            if($scope.fillQuestions[i].statements[j].text.length>=1){
              var patt = /^\w{1,}.{0,}$/;
              var res = patt.test($scope.fillQuestions[i].statements[j].text);
              console.log($scope.fillQuestions[i].statements[j].text);
              if(res==false){
                return {
                  error:true,
                  msg:"Wrong statement in question "+i+" statement "+j+", cannot be empty",
                  question:i,
                  type:"fillQuestions"
                }
              }
            }else{
              return {
                error:true,
                msg:"Wrong statement in question "+i+" statement "+j+", cannot be empty",
                question:i,
                type:"fillQuestions"
              }

            }
          }else{

            return {
              error:true,
              msg:"Wrong statement in question "+i+" statement "+j+", cannot be empty",
              question:i,
              type:"fillQuestions"
            }
          }
        }
        var correctAnswers=0;
        for(var j=0;j<$scope.fillQuestions[i].options.length;j++){
          /*check Options*/
          console.log("chequeando opciones");
          if($scope.fillQuestions[i].options[j].text){
            if($scope.fillQuestions[i].options[j].text.length>=1){
              var patt = /^\w{1,}.{0,}$/;
              var res = patt.test($scope.fillQuestions[i].options[j].text);
              if(res==false){
                return {
                  error:true,
                  msg:"Wrong statement in question "+i+" option "+j+", cannot be empty",
                  question:i,
                  type:"fillQuestions"
                }
              }
            }else{
              return {
                error:true,
                msg:"Wrong statement in question "+i+" option "+j+", cannot be empty",
                question:i,
                type:"fillQuestions"
              }
            }
          }else{
            return {
              error:true,
              msg:"Wrong statement in question "+i+" option "+j+", cannot be empty",
              question:i,
              type:"fillQuestions"
            }
          }
          /*check justification*/
          if($scope.fillQuestions[i].options[j].justification){
            if($scope.fillQuestions[i].options[j].justification.length>=1){
              var patt = /^\w{1,}.{0,}$/;
              var res = patt.test($scope.fillQuestions[i].options[j].justification);
              if(res==false){
                $scope.fillQuestions[i].options[j].justification="";
              }
            }else{
              $scope.fillQuestions[i].options[j].justification="";
            }
          }else{
            $scope.fillQuestions[i].options[j].justification="";

          }
          /*check correctAnswers*/
          console.log($scope.fillQuestions[i].options[j].isCorrect);
          if($scope.fillQuestions[i].options[j].isCorrect){
            console.log("tratando");
            correctAnswers++;
          }else{
            $scope.fillQuestions[i].options[j].isCorrect=false;
          }
        }
        if(correctAnswers==0){
          if(correctAnswers==0){
            return {
              error:true,
              msg:"There should be at least 1 correct answer in question "+i,
              question:i,
              type:"fillQuestions"
            }
          }
        }
      }
      return {
        error:false,
        msg:"not error found"
      }
    }
    $scope.register=function(){
      if($scope.test.startDateTime>$scope.test.finishDateTime){
        toastr.error("La fecha de inicio de la prueba debe ser antes que la fecha de finalizacion", "Error");
      }else{

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
            },
            multipleChoiceQuestions:$scope.multipleChoiceQuestions,
            fillQuestions:$scope.fillQuestions,
            trueFalseQuestions:$scope.trueFalseQuestions

          }
        }).then(function success(response){
          console.log(response);
          toastr.success("Prueba registrada con éxito","Success");
        }, function error(response){
          console.log(response);
          toastr.error("Error al registrar la prueba","Success");
        })
      }
    }

    /*Load course by teacher*/
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
