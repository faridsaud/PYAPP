app.controller("studentTestTakenController",["$scope","$document","$http","$location","$rootScope",'globalVariables',"$state",function($scope,$document,$http,$location,$rootScope, globalVariables,$state){
  $rootScope.loggedUser={};
  $rootScope.activeTest={};
  $rootScope.loggedUser.email="test3@test.com";
  $rootScope.activeTest.id=21;
  if(!$rootScope.loggedUser.email ||!$rootScope.activeTest.id){
    $location.path('/home');
  }else{

    /*Loading the test*/
    var instructionSpoken=false;
    //Narrador
    $rootScope.msg = new SpeechSynthesisUtterance();
    $rootScope.synth = window.speechSynthesis;
    $rootScope.synth.onvoiceschanged = function() {
      voices = $rootScope.synth.getVoices();
      console.log(voices);
      $rootScope.msg.rate = 0.8;
      $rootScope.msg.voice = voices[6]; // Note: some voices don't support altering params
      $rootScope.msg.lang = 'es-US';
      if(instructionSpoken==false){
        $rootScope.synth.cancel();
        $rootScope.msg.text="Instrucciones: teclas arriba y abajo para moverse entre opciones y preguntas. Derecha e izquierda para moverse entre preguntas. Espacio para seleccionar la opción. Control para iniciar la prueba";

      }
      $rootScope.synth.speak($rootScope.msg);
      instructionSpoken=true;
    }
    var finishedSpeaking=false;
    $rootScope.msg.onstart=function(event){
      finishedSpeaking=false;
      console.log("On start");
    }
    $rootScope.msg.onend=function(event){
      finishedSpeaking=true;
      console.log("On end");
    }









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
            $scope.test.questions[i].options[j].isSelected=false;
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
              $scope.test.questions[i].options[j].isSelected=true;
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
        console.log($scope.test);
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
          //$scope.saveData();
          $rootScope.msg.text="Evaluación enviada con éxito";
          $rootScope.synth.speak($rootScope.msg);
          $rootScope.testSend=$scope.test;
          console.log($rootScope.testSend);
          console.log("Vamos cambiarnos de vista");
          $state.go('studentReviewTest');
        }
        if(document.getElementById("r"+number)){
          $scope.selectOption(number);
          $rootScope.msg.text="Opción seleccionada con éxito";
          $rootScope.synth.speak($rootScope.msg);
          console.log($scope.test);
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
    $http({
      method:'POST',
      url:globalVariables.url+'/test/getTestByIdForStudent',
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
      //$scope.formatTestToBeTaken($scope.test);


      console.log($scope.test.questions);
      $scope.generateIndex();
      console.log($scope.test.questions);
      console.log($scope.test);
    }, function error(response){
      console.log(response);
    })

  }
}]);
