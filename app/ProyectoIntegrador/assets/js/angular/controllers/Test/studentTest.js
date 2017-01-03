app.controller("studentTestTakenController",["$scope","$document","$http","$location","$rootScope",'globalVariables',"$state",function($scope,$document,$http,$location,$rootScope, globalVariables,$state){

  console.log("TEst controller")
  if($rootScope.loggedUser&&$rootScope.activeTest){
    console.log("logged user and active test")
    if($rootScope.loggedUser.email &&$rootScope.activeTest.id){
      console.log("email and id");



      //Narrador
      if(!$rootScope.msg & !$rootScope.synth){
        $rootScope.msg = new SpeechSynthesisUtterance();
        $rootScope.synth = window.speechSynthesis;
        $rootScope.msg.rate =1.0;
        $rootScope.msg.lang='es-US';
      }
      $rootScope.synth.onvoiceschanged = function() {
        voices = $rootScope.synth.getVoices();
        console.log(voices);
        console.log("Entrando a hablar");
        $rootScope.msg.voice = voices[6]; // Note: some voices don't support altering params
        $rootScope.synth.speak($rootScope.msg);

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
            index:$scope.test.questions[i].index,
            options:[]
          }
          $scope.mapper.push(mapped);
          for(var j=0;j<$scope.test.questions[i].options.length;j++){
            counter++;
            $scope.test.questions[i].options[j].index=counter;
            var mapped={
              originalId:$scope.test.questions[i].options[j].id,
              index:$scope.test.questions[i].options[j].index
            }
            $scope.mapper[i].options.push(mapped);
          }
        }
        console.log($scope.mapper);
        $scope.lastIndex=counter;
      }





      //funcion buscar siguiente pregunta
      $scope.findNextQuestion=function(questionIndex){
        /*Button send*/
        if(questionIndex==($scope.lastIndex+1)){
          return 1;
        }
        var originalId=$scope.findQuestionOriginalIdByIndex(questionIndex);
        if(originalId){
          for(var i=0;i<$scope.test.questions.length;i++){
            if($scope.test.questions[i].id==originalId){
              if(i<($scope.test.questions.length-1)){
                var nextQuestionId=$scope.test.questions[i+1].id;
                var indexNextQuestion=$scope.findQuestionIndexByOriginalId(nextQuestionId);
                return indexNextQuestion;
              }else{
                return $scope.lastIndex+1;
              }
            }
          }
        }
      }

      //funcion buscar anterior pregunta
      $scope.findPreviousQuestion=function(questionIndex){
        /*button index*/
        if(questionIndex==($scope.lastIndex+1)){
          var questionsNumber=$scope.test.questions.length;
          var indexPreviousQuestion=$scope.findQuestionIndexByOriginalId($scope.test.questions[questionsNumber-1].id);
          console.log(indexPreviousQuestion);
          return indexPreviousQuestion;
        }
        var originalId=$scope.findQuestionOriginalIdByIndex(questionIndex);
        if(originalId){
          for(var i=0;i<$scope.test.questions.length;i++){
            if($scope.test.questions[i].id==originalId){
              if(i>0){
                var nextQuestionId=$scope.test.questions[i-1].id;
                var indexNextQuestion=$scope.findQuestionIndexByOriginalId(nextQuestionId);
                return indexNextQuestion;
              }else{

                return $scope.lastIndex+1;
              }
            }
          }
        }
      }

      //buscar IdOriginal Pregunta By Index
      $scope.findQuestionOriginalIdByIndex=function(questionIndex){
        for(var i=0;i<$scope.mapper.length;i++){
          if($scope.mapper[i].index==questionIndex){
            var originalId=$scope.mapper[i].originalId;
            return originalId;
          }
        }
      }

      //buscar IdOriginal option By Index
      $scope.findOptionOriginalIdByIndex=function(optionIndex){
        for(var i=0;i<$scope.mapper.length;i++){
          for(var j=0;j<$scope.mapper[i].options.length;j++){
            if($scope.mapper[i].options[j].index==optionIndex){
              var originalId=$scope.mapper[i].options[j].originalId;
              return originalId;
            }
          }
        }
      }

      //buscar index Pregunta By originalId
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
              $document[0].getElementById("r"+$scope.test.questions[i].options[j].index).classList.remove("selected");
            }
          }
        }
      }
      //funcion seleccionar
      $scope.selectOption=function(optionIndex){
        var optionId=$scope.findOptionOriginalIdByIndex(optionIndex);
        var questionId=$scope.findQuestionByOption(optionId);
        if(questionId){
          $scope.cleanSelectedOptionByQuestion(questionId);
        }
        if(optionId && questionId){
          for(var i=0;i<$scope.test.questions.length;i++){
            for(var j=0;j<$scope.test.questions[i].options.length;j++){
              if($scope.test.questions[i].options[j].id==optionId){
                $scope.test.questions[i].options[j].isSelected=true;
                $document[0].getElementById("r"+$scope.test.questions[i].options[j].index).classList.add("selected");
              }
            }
          }
        }
      }


      //peticion http con los datos
      $scope.saveData=function(){
        $http({
          method: 'POST',
          url:globalVariables.url+'/test/registerTakenTest',
          data:{
            test:$scope.test,
            user:$rootScope.loggedUser
          }
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
        //CTRL
        if(event.which==17){
          if(finishedSpeaking==false){
            $rootScope.synth.cancel();
          }else{
            if(!$scope.focusedElement){
              $document[0].getElementById("p1").focus();
              $scope.lastQuestion="p1";
            }
            speakP();
          }
        }

        //arriba
        if(event.which==38){
          if(!$scope.focusedElement){
            $rootScope.synth.cancel();
            $document[0].getElementById("p1").focus();
            $scope.lastQuestion="p1";
          }else{
            $rootScope.synth.cancel();
            console.log("Evento:");
            console.log(event);
            var matchings=$scope.focusedElement.match(/[p,r](\d*)/);
            console.log("Match:");
            console.log(matchings);
            var number=Number(matchings[1])-1;
            if($document[0].getElementById("r"+number)){
              $document[0].getElementById("r"+number).focus();
            }
            if($document[0].getElementById("p"+number)){
              number=$scope.findNextQuestion(number)-1;
              if($document[0].getElementById("r"+number)){
                $document[0].getElementById("r"+number).focus();
              }
            }
          }
        }
        //abajo
        if(event.which==40){
          if(!$scope.focusedElement){
            $rootScope.synth.cancel();
            $document[0].getElementById("p1").focus();
            $scope.lastQuestion="p1";
          }else{
            $rootScope.synth.cancel();
            console.log("Evento:");
            console.log(event);
            var matchings=$scope.focusedElement.match(/[p,r](\d*)/);
            var number=Number(matchings[1])+1;
            if($document[0].getElementById("r"+number)){
              $document[0].getElementById("r"+number).focus();
            }
            if($document[0].getElementById("p"+number)){

              matchings=$scope.lastQuestion.match(/p(\d*)/);
              console.log(matchings);
              number=Number(matchings[1])+1;
              console.log(number);
              if($document[0].getElementById("r"+number)){
                $document[0].getElementById("r"+number).focus();
              }
            }
            console.log($scope.test);
          }
        }
        //derecha
        if(event.which==39){
          if(!$scope.focusedElement){
            $rootScope.synth.cancel();
            $document[0].getElementById("p1").focus();
            $scope.lastQuestion="p1";
          }else{

            $rootScope.synth.cancel();
            var matchings=$scope.lastQuestion.match(/p(\d*)/);
            console.log(matchings);
            var number=$scope.findNextQuestion(Number(matchings[1]));
            console.log(number);
            if($document[0].getElementById("p"+number)){
              $document[0].getElementById("p"+number).focus();
              $scope.lastQuestion="p"+number;
            }
          }
        }
        //izquierda
        if(event.which==37){
          if(!$scope.focusedElement){
            $rootScope.synth.cancel();
            $document[0].getElementById("p1").focus();
            $scope.lastQuestion="p1";
          }else{

            $rootScope.synth.cancel();
            var matchings=$scope.lastQuestion.match(/p(\d*)/);
            console.log(matchings);
            var number=$scope.findPreviousQuestion(Number(matchings[1]));
            console.log(number);
            console.log($scope.mapper);
            if($document[0].getElementById("p"+number)){
              $document[0].getElementById("p"+number).focus();
              $scope.lastQuestion="p"+number;
            }

          }
        }

        //espacio
        if(event.which==32){
          $rootScope.synth.cancel();
          var matchings=$scope.focusedElement.match(/[p,r](\d*)/);
          var number=Number(matchings[1]);
          if(number==($scope.lastIndex+1)){
            $scope.saveData();
            $rootScope.msg.text="Evaluación enviada";
            $rootScope.synth.speak($rootScope.msg);
            $rootScope.testSend=$scope.test;
            $state.go('studentReviewTest');
          }
          if($document[0].getElementById("r"+number)){
            $scope.selectOption(number);
            $rootScope.msg.text="Opción seleccionada";
            $rootScope.synth.speak($rootScope.msg);
          }

        }

        //+
        if(event.which==107){
          if($rootScope.msg){
            if($rootScope.msg.rate){
              if($rootScope.msg.rate<1.9){
                $rootScope.msg.rate=$rootScope.msg.rate+0.1;
                console.log($rootScope.msg.rate);
                $rootScope.synth.cancel();
                speakP();
              }
            }
          }
        }

        //-
        if(event.which==109){
          if($rootScope.msg){
            if($rootScope.msg.rate){
              if($rootScope.msg.rate>0.1){
                $rootScope.msg.rate=$rootScope.msg.rate-0.1;
                console.log($rootScope.msg.rate);
                $rootScope.synth.cancel();
                speakP();
              }
            }
          }
        }
      });
      $scope.selectOptionOnClick=function(htmlElementId){
        console.log("evento on click");
        console.log(htmlElementId);
        var matchings=htmlElementId.match(/[p,r](\d*)/);
        var number=Number(matchings[1]);
        $scope.selectOption(number);
      }
      $scope.sentTestOnClick=function(){
        $scope.saveData();
        $rootScope.testSend=$scope.test;
        $state.go('studentReviewTest');
      }
      //al hacer focus
      $document.unbind('focusin').bind("focusin",function(event){
        console.log("se hizo focus");
        console.log(event.target.id);
        $scope.focusedElement=event.target.id;
        console.log($scope.focusedElement);
        console.log($document[0].getElementById($scope.focusedElement));
        speakP();

      });
      function speakP(){
        var textoP=$document[0].getElementById($scope.focusedElement).innerHTML;
        $rootScope.msg.text=textoP;
        $rootScope.synth.speak($rootScope.msg);
        console.log($rootScope.synth);
      }

      function init(){
        if($rootScope.synth && $rootScope.msg){
          $rootScope.synth.cancel();
          $rootScope.msg.text="Instrucciones: Flecha derecha, siguiente pregunta. Flecha izquierda, pregunta anterior. Flecha abajo, siguiente opción. Flecha arriba, anterior opción. Espacio, seleccionar una opción. Control, cancelar o reanudar audio";
          $rootScope.synth.speak($rootScope.msg);
        }
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
        $scope.test=response.data.test;
        $scope.test.id=$rootScope.activeTest.id;
        $scope.generateIndex();
        init();
      }, function error(response){
        console.log(response);
      });



    }else{
      $location.path('/home');
    }
  }else{
    $location.path('/home');
  }

}]);
