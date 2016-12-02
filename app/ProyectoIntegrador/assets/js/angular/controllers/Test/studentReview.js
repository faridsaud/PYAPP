app.controller("studentTestReviewController",["$scope","$document","$http","$location","$rootScope",'globalVariables','$state',function($scope,$document,$http,$location,$rootScope, globalVariables,$state){
  console.log("Entramos a review");
  if(!$rootScope.loggedUser.email ||!$rootScope.activeTest.id){
    $location.path('/home');
  }else{
    var correctAnswers=0;
    var instructionSpoken=false;
    $scope.focusedElement="p1";
    $scope.lastQuestion="p1";
    $scope.test=$rootScope.testSend;
    if($scope.test===undefined){
      $location.path('/home');
    }else{
      $scope.generateStatementsReview=function(){
        $scope.questions=[]
        for(var i=0;i<$scope.test.questions.length;i++){
          var id=(i*5)+1;
          $scope.questions.push({text:$scope.test.questions[i].text, id:id, index:id});
        }
        for(var i=0;i<$scope.test.questions.length;i++){
          $scope.questions[i].options=[];
          var isOptionSelected=false;
          for(var j=0;j<$scope.test.questions[i].options.length;j++){
            if($scope.test.questions[i].options[j].isSelected==true){
              isOptionSelected=true;
              $scope.questions[i].options.push({text:$scope.test.questions[i].options[j].text, id:(i*5)+2, index:(i*5)+2});
              if($scope.test.questions[i].options[j].justification=="" ||!$scope.test.questions[i].options[j].justification){
                $scope.questions[i].options.push({text:"No existe justificación", id:(i*5)+3, index:(i*5)+3});
              }else{
                $scope.questions[i].options.push({text:$scope.test.questions[i].options[j].justification, id:(i*5)+3, index:(i*5)+3});
              }
            }
          }
          if(isOptionSelected==false){
            $scope.questions[i].options.push({text:"No existe respuesta seleccionada para esta pregunta", id:(i*5)+2, index:(i*5)+2});
            $scope.questions[i].options.push({text:"No existe justificación", id:(i*5)+3, index:(i*5)+3});
          }
          for(var j=0;j<$scope.test.questions[i].options.length;j++){
            if($scope.test.questions[i].options[j].isCorrect==true){
              $scope.questions[i].options.push({text:$scope.test.questions[i].options[j].text, id:(i*5)+4, index:(i*5)+4});
              if($scope.test.questions[i].options[j].justification=="" ||!$scope.test.questions[i].options[j].justification){
                $scope.questions[i].options.push({text:"No existe justificación", id:(i*5)+5, index:(i*5)+5});
              }else{
                $scope.questions[i].options.push({text:$scope.test.questions[i].options[j].justification, id:(i*5)+5, index:(i*5)+5});
              }
            }
          }
        }
      }
      $scope.generateStatementsReview();
      console.log($scope.questions);







      //funcion generadora de index
      $scope.generateIndex=function(){
        $scope.mapper=[];
        var counter=0;
        for(var i=0;i<$scope.test.questions.length;i++){
          counter++;
          $scope.test.questions[i].index=counter;
          var mapped={
            originalId:$scope.test.questions[i].id,
            index:$scope.test.questions[i].index
          }
          $scope.mapper.push(mapped);
          for(var j=0;j<$scope.test.questions[i].options.length;j++){
            counter++;
            $scope.test.questions[i].options[j].index=counter;
            var mapped={
              originalId:$scope.test.questions[i].options[j].id,
              index:$scope.test.questions[i].options[j].index
            }
            $scope.mapper.push(mapped);
          }
        }
        console.log($scope.mapper);
        $scope.lastIndex=counter;
      }





      //funcion buscar siguiente pregunta
      $scope.findNextQuestion=function(questionIndex){
        var originalId=$scope.findQuestionOriginalIdByIndex(questionIndex);
        if(originalId){
          for(var i=0;i<$scope.test.questions.length;i++){
            if($scope.test.questions[i].id==originalId){
              if(i<($scope.test.questions.length-1)){
                var nextQuestionId=$scope.test.questions[i+1].id;
                var indexNextQuestion=$scope.findQuestionIndexByOriginalId(nextQuestionId);
                return indexNextQuestion;
              }else{
                var nextQuestionId=$scope.test.questions[0].id;
                var indexNextQuestion=$scope.findQuestionIndexByOriginalId(nextQuestionId);
                return indexNextQuestion;
              }
            }
          }
        }
      }

      //funcion buscar anterior pregunta
      $scope.findPreviousQuestion=function(questionIndex){
        var originalId=$scope.findQuestionOriginalIdByIndex(questionIndex);
        if(originalId){
          for(var i=0;i<$scope.test.questions.length;i++){
            if($scope.test.questions[i].id==originalId){
              if(i>0){
                var nextQuestionId=$scope.test.questions[i-1].id;
                var indexNextQuestion=$scope.findQuestionIndexByOriginalId(nextQuestionId);
                return indexNextQuestion;
              }else{
                var nextQuestionId=$scope.test.questions[$scope.test.questions.length-1].id;
                var indexNextQuestion=$scope.findQuestionIndexByOriginalId(nextQuestionId);
                return indexNextQuestion;
              }
            }
          }
        }
      }

      //buscar IdOriginal Pregunta By Index, sirve tambien para options
      $scope.findQuestionOriginalIdByIndex=function(questionIndex){
        for(var i=0;i<$scope.mapper.length;i++){
          if($scope.mapper[i].index==questionIndex){
            var originalId=$scope.mapper[i].originalId;
            return originalId;
          }
        }
      }


      //buscar index Pregunta By originalId, sirve tambien para options
      $scope.findQuestionIndexByOriginalId=function(questionId){
        for(var i=0;i<$scope.mapper.length;i++){
          if($scope.mapper[i].originalId==questionId){
            var questionIndex=$scope.mapper[i].index;
            return questionIndex;
          }
        }
      }

      //Buscar a que pregunta pertenece la respuesta
      $scope.findQuestionByOption=function(optionId){
        for(var i=0;i<$scope.test.questions.length;i++){
          for(var j=0;j<$scope.test.questions[i].options.length;j++){
            if($scope.test.questions[i].options[j].id==optionId){
              var questionId=$scope.test.questions[i].id;
              return questionId;
            }
          }
        }
      }

      //Funcion para limpiar las options seleccionadas de la pregunta
      $scope.cleanSelectedOptionByQuestion=function(questionId){
        for(var i=0;i<$scope.test.questions.length;i++){
          if($scope.test.questions[i].id==questionId){
            for(var j=0;j<$scope.test.questions[i].options.length;j++){
              $scope.test.questions[i].options[j].selected=false;
              //quitar estilo
              document.getElementById("r"+$scope.test.questions[i].options[j].index).classList.remove("selected");
            }
          }
        }
      }
      //funcion seleccionar
      $scope.selectOption=function(optionIndex){
        var optionId=$scope.findQuestionOriginalIdByIndex(optionIndex);
        var questionId=$scope.findQuestionByOption(optionId);
        if(questionId){
          $scope.cleanSelectedOptionByQuestion(questionId);
        }
        if(optionId && questionId){
          for(var i=0;i<$scope.test.questions.length;i++){
            for(var j=0;j<$scope.test.questions[i].options.length;j++){
              if($scope.test.questions[i].options[j].id==optionId){
                $scope.test.questions[i].options[j].selected=true;
                document.getElementById("r"+$scope.test.questions[i].options[j].index).classList.add("selected");
              }
            }
          }
        }
      }
      //Dar efecto de selección
      $scope.efectoSeleccion=function(index){
        var optionId=$scope.findQuestionOriginalIdByIndex(index);
      }


      //peticion http con los datos
      $scope.saveData=function(){
        var datosEnviar=JSON.parse(JSON.stringify($scope.test.questions));
        $http({
          method: 'POST',
          url: 'http://186.4.134.233:1337/testData',
          data:datosEnviar
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log(response);
        }, function errorCallback(response) {
          console.log(response);
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
      }
      //Valores de angular
      //Eventos de presionar
      $document.unbind('keydown').bind("keydown",function(event){
        //  console.log(event);
        //CTRL
        if(event.which==17){
          $rootScope.synth.cancel();

          document.getElementById("p1").focus();
          $scope.focusedElement="p1";
          $scope.lastQuestion="p1";

        }

        //numero es el valor del id
        //arriba
        if(event.which==38){
          $rootScope.synth.cancel();
          console.log("Evento:");
          console.log(event);
          var matchings=$scope.focusedElement.match(/[p,r](\d*)/);
          console.log("Match:");
          console.log(matchings);
          var number=Number(matchings[1])-1;
          if(document.getElementById("r"+number)){
            document.getElementById("r"+number).focus();
          }
          if(document.getElementById("p"+number)){
            document.getElementById("p"+number).focus();
            $scope.lastQuestion="p"+number;
          }



        }
        //abajo
        if(event.which==40){
          $rootScope.synth.cancel();
          console.log("Evento:");
          console.log(event);
          var matchings=$scope.focusedElement.match(/[p,r](\d*)/);
          var number=Number(matchings[1])+1;
          if(document.getElementById("r"+number)){
            document.getElementById("r"+number).focus();
          }
          if(document.getElementById("p"+number)){
            document.getElementById("p"+number).focus();
            $scope.lastQuestion="p"+number;
          }
        }
        //derecha
        if(event.which==39){
          $rootScope.synth.cancel();
          var matchings=$scope.lastQuestion.match(/p(\d*)/);
          console.log(matchings);
          var number=$scope.findNextQuestion(Number(matchings[1]));
          console.log(number);
          if(document.getElementById("p"+number)){
            document.getElementById("p"+number).focus();
            $scope.lastQuestion="p"+number;
          }

        }
        //izquierda
        if(event.which==37){
          $rootScope.synth.cancel();
          var matchings=$scope.lastQuestion.match(/p(\d*)/);
          console.log(matchings);
          var number=$scope.findPreviousQuestion(Number(matchings[1]));
          console.log(number);
          if(document.getElementById("p"+number)){
            document.getElementById("p"+number).focus();
            $scope.lastQuestion="p"+number;
          }

        }

        //espacio
        if(event.which==32){
          $rootScope.synth.cancel();
          /*
          console.log("Evento: Espacio");
          console.log(event);
          */
          var matchings=$scope.focusedElement.match(/[p,r](\d*)/);
          var number=Number(matchings[1]);
          if(number==($scope.lastIndex+1)){
            $scope.saveData();
            $rootScope.msg.text="Evaluación enviada con éxito";
            $rootScope.synth.speak($rootScope.msg);
            $location.path('/home');
          }
        }
      });
      //al hacer focus
      $document.unbind('focusin').bind("focusin",function(event){
        console.log("se hizo focus");
        console.log(event.target.id);
        $scope.focusedElement=event.target.id;
        console.log(document.getElementById($scope.focusedElement));
        speakP();

      });
      function speakP(){
        var textoP=document.getElementById($scope.focusedElement).innerHTML;
        $rootScope.msg.text=textoP;
        $rootScope.synth.speak($rootScope.msg);
        console.log($rootScope.synth);
      }
    }
  }
}]);
