app.controller('editTestController',['$scope','$http','toastr','$location','globalVariables','$rootScope','$state','ngDialog', function($scope,$http, toastr,$location,globalVariables,$rootScope,$state,ngDialog){
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
      ngDialog.openConfirm({
        scope: $scope,
        template:
        '<div class="modal-dialog">'+
        '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<h4 class="modal-title">¿Seguro que desea eliminar la pregunta?</h4>'+
        '</div>'+
        '<div class="modal-footer">'+
        '<button type="button" class="btn btn-danger"  ng-click="closeThisDialog()">Cancelar</button>'+
        '<button type="button" class="btn btn-primary" ng-click="confirm()">Confirmar</button>'+
        '</div>'+
        '</div><!-- /.modal-content -->'+
        '</div><!-- /.modal-dialog -->'
        ,
        plain: true
      }).then(function (confirm) {

        if($scope.fillQuestions[index].id){

          $http({
            method:'POST',
            url:globalVariables.url+'/question/delete',
            data:{
              id:$scope.fillQuestions[index].id
            }
          }).then(function success(response){
            console.log(response);
          }, function error(response){
            console.log(response);
          })
        }
        if (index > -1) {
          $scope.fillQuestions.splice(index, 1);
        }
      }, function(reject) {
      });
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
      ngDialog.openConfirm({
        scope: $scope,
        template:
        '<div class="modal-dialog">'+
        '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<h4 class="modal-title">¿Seguro que desea eliminar la pregunta?</h4>'+
        '</div>'+
        '<div class="modal-footer">'+
        '<button type="button" class="btn btn-danger"  ng-click="closeThisDialog()">Cancelar</button>'+
        '<button type="button" class="btn btn-primary" ng-click="confirm()">Confirmar</button>'+
        '</div>'+
        '</div><!-- /.modal-content -->'+
        '</div><!-- /.modal-dialog -->'
        ,
        plain: true
      }).then(function (confirm) {

        if($scope.multipleChoiceQuestions[index].id){
          $http({
            method:'POST',
            url:globalVariables.url+'/question/delete',
            data:{
              id:$scope.multipleChoiceQuestions[index].id
            }
          }).then(function success(response){
            console.log(response);
          }, function error(response){
            console.log(response);
          })
        }
        if (index > -1) {
          $scope.multipleChoiceQuestions.splice(index, 1);
        }
      }, function(reject) {
      });
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
      ngDialog.openConfirm({
        scope: $scope,
        template:
        '<div class="modal-dialog">'+
        '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<h4 class="modal-title">¿Seguro que desea eliminar la pregunta?</h4>'+
        '</div>'+
        '<div class="modal-footer">'+
        '<button type="button" class="btn btn-danger"  ng-click="closeThisDialog()">Cancelar</button>'+
        '<button type="button" class="btn btn-primary" ng-click="confirm()">Confirmar</button>'+
        '</div>'+
        '</div><!-- /.modal-content -->'+
        '</div><!-- /.modal-dialog -->'
        ,
        plain: true
      }).then(function (confirm) {

        if($scope.trueFalseQuestions[index].id){

          $http({
            method:'POST',
            url:globalVariables.url+'/question/delete',
            data:{
              id:$scope.trueFalseQuestions[index].id
            }
          }).then(function success(response){
            console.log(response);
          }, function error(response){
            console.log(response);
          })
        }
        if (index > -1) {
          $scope.trueFalseQuestions.splice(index, 1);
        }
      }, function(reject) {
      });
    }


    $scope.checkData=function(){
      var errorCheckingData=false;
      var errorMultipleChoice=$scope.checkMultipleChoiceQuestions();
      if(errorMultipleChoice.error==true){
        toastr.error("Error checking multipleChoiceQuestions" + errorMultipleChoice.msg);
        errorCheckingData=true;
      }
      var errorTrueFalse=$scope.checkTrueFalseQuestions();
      if(errorTrueFalse.error==true){
        toastr.error("Error checking trueFalseQuestions" + errorTrueFalse.msg);
        errorCheckingData=true;
      }
      var errorFillQuestion=$scope.checkFillQuestions();
      if(errorFillQuestion.error==true){
        toastr.error("Error checking fillQuestions" + errorFillQuestion.msg);
        errorCheckingData=true;
      }
      return errorCheckingData;
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
          var patt = /^\d{1,1}$/;
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
          var patt = /^\d{1,1}$/;
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
          var patt = /^\d{1,1}$/;
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
    $scope.update=function(){
      if($scope.test.startDateTime>$scope.test.finishDateTime){
        toastr.error("La fecha de inicio de la prueba debe ser antes que la fecha de finalizacion", "Error");
      }else{
        var error=$scope.checkData();
        if(error==true){
          return;
        }
        $http({
          method:'POST',
          url:globalVariables.url+'/test/update',
          data:{
            test:{
              id:$rootScope.activeTest.id,
              createdBy:$rootScope.loggedUser.email,
              title:$scope.test.title,
              description:$scope.test.description,
              intents:$scope.test.intents,
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
          $location.path('/home');
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
          email:$rootScope.loggedUser.email
        }

      }
    }).then(function success(response){
      console.log(response);
      $scope.courses=response.data.courses;
      console.log($scope.courses);
    }, function error(response){
      console.log(response);
    })

    /*Load test*/
    $http({
      method:'POST',
      url:globalVariables.url+'/test/getTestById',
      data:{
        user:{
          email:$rootScope.loggedUser.email
        },
        test:{
          id:$rootScope.activeTest.id
        }

      }
    }).then(function success(response){
      console.log(response);
      $scope.test=response.data.test;
      $scope.test.course=$scope.test.course.toString();
      $scope.multipleChoiceQuestions=$scope.test.multipleChoiceQuestions;
      $scope.fillQuestions=$scope.test.fillQuestions;
      $scope.trueFalseQuestions=$scope.test.trueFalseQuestions;
      $scope.test.startDateTime=new Date($scope.test.startDateTime);
      $scope.test.finishDateTime=new Date($scope.test.finishDateTime);;
      $scope.formatTrueFalseQuestionsServerToAngular();
      $scope.formatFillQuestionsServerToAngular();
      console.log($scope.test);
      console.log($scope.courses);
    }, function error(response){
      console.log(response);
    })


    $scope.formatTrueFalseQuestionsServerToAngular=function(){
      for(var i=0;i<$scope.trueFalseQuestions.length;i++){
        for(var j=0; j<$scope.trueFalseQuestions[i].options.length;j++){
          if(($scope.trueFalseQuestions[i].options[j].text=="verdadero")&&($scope.trueFalseQuestions[i].options[j].isCorrect==true)){
            $scope.trueFalseQuestions[i].option="true";
          }
          if(($scope.trueFalseQuestions[i].options[j].text=="falso")&&($scope.trueFalseQuestions[i].options[j].isCorrect==true)){
            $scope.trueFalseQuestions[i].option="false";
          }
          if($scope.trueFalseQuestions[i].options[j].justification.length>1){
            $scope.trueFalseQuestions[i].justification=$scope.trueFalseQuestions[i].options[j].justification;
          }
        }
      }
    }

    $scope.formatFillQuestionsServerToAngular=function(){
      for(var i=0; i<$scope.fillQuestions.length;i++){
        var statements=$scope.fillQuestions[i].text.split(".espacio en blanco.");
        $scope.fillQuestions[i].statements=[];
        for(var j=0;j<statements.length;j++ ){
          $scope.fillQuestions[i].statements.push({text:statements[j]});
        }
      }
    }

    $scope.cloneMultipleChoiceQuestion=function(index){
      var question = $scope.multipleChoiceQuestions[index];
      $scope.cloneQuestion(question);
    }

    $scope.cloneTrueFalseQuestion=function(index){
      var question = $scope.trueFalseQuestions[index];
      $scope.cloneQuestion(question);
    }

    $scope.cloneFillQuestion=function(index){
      var question = $scope.fillQuestions[index];
      $scope.cloneQuestion(question);
    }

    $scope.cloneQuestion=function(question){
      $rootScope.questionToBeCloned=question;
      console.log($rootScope.questionToBeCloned);
      $state.go("cloneQuestion");
    }


  }
}]);
